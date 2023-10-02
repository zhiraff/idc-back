require("dotenv").config();
const knex = require("../../knex_init");
const fs = require('fs');
const multer  = require('multer')
let saveFolder = process.env.UPLOAD_PATH
const defaultPath = './upload/document'

//Проверка достуности папки для загрузки скан-файлов
if (typeof saveFolder === 'undefined'){
    console.log(`Не указана директория сохранения файлов \nбудет использована директория по умолчанию (${defaultPath})`)
    //проверка на доступность дефолтной директории
    saveFolder = defaultPath
    fs.access(saveFolder, fs.constants.R_OK | fs.constants.W_OK, (err) => {
       if (err) {
        console.log("Директория для сохранения файлов не существут () %s ) \nпопытка создать директорию", saveFolder);
        try {
            fs.mkdirSync(saveFolder, { recursive: true })
            console.log('Директория создана')
        } catch (e) {
            console.log(`Невозможно создать директорию ${saveFolder} \n выход`)
            process.exit(100)
        }
       } else {

       }

       });
}else{
   //проверка на доступность указанной директории
   fs.access(saveFolder, fs.constants.R_OK | fs.constants.W_OK, (err) => {
    if (err) {
    console.log("Директория для сохранения файлов не существут () %s ) \nпопытка создать директорию", saveFolder);
    
    try {
        fs.mkdirSync(saveFolder, { recursive: true })
        console.log('Директория создана')
    } catch (e) {
        console.log(`Невозможно создать директорию ${saveFolder} \n выход`)
        process.exit(100)
    }

    } else {
    console.log('Директория для сохранения файлов %s', saveFolder);
    }
   });   
}

// настройка парметров сохранения файлов
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        dt = new Date()
        fldr = `${saveFolder}/${dt.getFullYear()}`
        if (!fs.existsSync(fldr)){
            fs.mkdirSync(fldr, { recursive: true });
            try {
                fs.mkdirSync(fldr, { recursive: true })
            } catch (e) {
                console.log(`Невозможно создать директорию ${fldr} \n для сохранения файла`)
            }
        }
      cb(null, `${fldr}/`)
    },
    filename: function (req, file, cb) {
        let exten = file.originalname.split(".").pop()
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
      cb(null, `${file.fieldname}-${Date.now()}.${exten}`)
    }
  })

  const upload = multer({ storage: storage })
    //методы работы с файлами
  //скачать файл по ID
  const getDocFile = async (fileId) => {
    let downloadFile = await knex("docFile").first().where({ id: fileId })
    console.log(downloadFile)
    return downloadFile
  }

  //посомтреть информацию о файле по ID
    const getDocFileInfo = async (fileId) => {
      return knex("docFile").first().where({ id: fileId })
    }

  //посомтреть информацию обо всех файлах по docHeadID
  const getDocFileInfoByDocHeader = async (page, perpage, docHeaderId) => {
    const pg = typeof page !== 'undefined' && page !== '' ? page : 1
    const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25

    let countData = await knex("docFile").where({ docKey: docHeaderId }).first().count('id as countRow')
    let resultData = await knex("docFile").select().where({ docKey: docHeaderId }).limit(prpg).offset((pg-1)*prpg)
    countData['pages'] = Math.ceil(countData.countRow/prpg)
    countData['currentPage'] = pg
    resultData.push(countData)
    return resultData
  }

   //сохранить файл
   const saveDocFile = async (docKey, file, user) => {
    const { originalname, filename, mimetype, path, size } = file
    const newDocFile = {
      docKey: docKey,
      originalName: originalname,
      name: filename,
      mimetype: mimetype,
      extension: originalname.split(".").pop(),
      pathSave: path,
      placeSave: "",
      size: size,
      createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
      updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    };
     const result = await knex("docFile").insert([newDocFile], ["id"]);
     newDocFile['id'] = result[0].id
     return newDocFile;
   }

  //удаление Файла по id file
  const deleteDocFile = async (docFileId) => {
  return knex("docFile").where({ id: docFileId }).del()
  }
  //удаление всех файлов по id doc header
  const deleteDocFileByHeader = async (docHeaderId) => {
  return knex("docFile").where({ docKey: docHeaderId }).del()
  }

/*
  //методы работы с файлами
  //Получить список всех файлов, с постраничной пагинацией
const getDocFile = async (page, perpage, sort) => {
    const pg = typeof page !== 'undefined' && page !== '' ? page : 1
    const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
    let sortField = 'id'
    let sortDirect = 'asc'
    if (typeof sort !== 'undefined'){
      if (sort.startsWith('-')){
        sortField = sort.slice(1)
        sortDirect = 'desc'
      }else{
        sortField = sort
      }
    }
    let countData = await knex("docFile").first().count('id as countRow')
    let resultData = await knex("docFile").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
    countData['pages'] = Math.ceil(countData.countRow/prpg)
    countData['currentPage'] = pg
    resultData.push(countData)
    return resultData
  }
  
  //Получить список файлов, с постраничной пагинацией и параметрами
  const getDocFileParam = async (page, perpage, docKey, originalName, name, mimetype, extension, pathSave, placeSave, size, sort) => {
    const pg = typeof page !== 'undefined' && page !== '' ? page : 1
    const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
      let sortField = 'id'
    let sortDirect = 'asc'
    if (typeof sort !== 'undefined'){
      if (sort.startsWith('-')){
        sortField = sort.slice(1)
        sortDirect = 'desc'
      }else{
        sortField = sort
      }
    }
  
    let queryObject = {}
    if (typeof docKey !== 'undefined'){
      queryObject['docKey'] = docKey
    }
      if (typeof size !== 'undefined'){
      queryObject['size'] = size
    }

  let queryObjectString = {}
  if (typeof originalName !== 'undefined'){
    queryObjectString['originalName'] = '%' + originalName + '%'
  } else {
    queryObjectString['originalName'] = '%%'
  }
    if (typeof name !== 'undefined'){
      queryObjectString['name'] = '%' +  name + '%'
  }else {
    queryObjectString['name'] = '%%'
  }
  if (typeof mimetype !== 'undefined'){
    queryObjectString['mimetype'] = '%' +  mimetype + '%'
}else {
  queryObjectString['mimetype'] = '%%'
}
if (typeof extension !== 'undefined'){
    queryObjectString['extension'] = '%' +  extension + '%'
}else {
  queryObjectString['extension'] = '%%'
}
if (typeof pathSave !== 'undefined'){
    queryObjectString['pathSave'] = '%' +  pathSave + '%'
}else {
  queryObjectString['pathSave'] = '%%'
}
if (typeof placeSave !== 'undefined'){
    queryObjectString['placeSave'] = '%' +  placeSave + '%'
}else {
  queryObjectString['placeSave'] = '%%'
}
  
  let countData = await knex("docFile")
  .where(queryObject)
  .andWhereILike("originalName", queryObjectString.originalName)
  .andWhereILike("name", queryObjectString.name)
  .andWhereILike("mimetype", queryObjectString.mimetype)
  .andWhereILike("extension", queryObjectString.extension)
  .andWhereILike("pathSave", queryObjectString.pathSave)
  .andWhereILike("placeSave", queryObjectString.placeSave)
  .first()
  .count('id as countRow')
  
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  
   let resultData = await knex("docFile")
   .where(queryObject)
   .andWhereILike("originalName", queryObjectString.originalName)
   .andWhereILike("name", queryObjectString.name)
   .andWhereILike("mimetype", queryObjectString.mimetype)
   .andWhereILike("extension", queryObjectString.extension)
   .andWhereILike("pathSave", queryObjectString.pathSave)
   .andWhereILike("placeSave", queryObjectString.placeSave)
   .select()
   .orderBy(sortField, sortDirect)
   .limit(prpg).offset((pg-1)*prpg)
    resultData.push(countData)
    return resultData
  }
  
  //Показать файл подробно (по ID файла, не заголовка документа)
  const getOneDocFileById = async(docFileId) => {
    //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
    return knex("docFile").first().where({ id: docFileId })
  }

   //Показать все файлы по ID заголовка документа
   const getDocFilesByHeaderId = async(docHeaderId) => {
    //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
    let resultData = await knex("docFile")
    .select()
    .where({ docKey: docHeaderId })
    let countData = await knex("docFile")
    .where({ docKey: docHeaderId })
    .first()
    .count('id as countRow')
    
    //countData['pages'] = Math.ceil(countData.countRow/prpg)
    //countData['currentPage'] = pg
    resultData.push(countData)
    return resultData
  }
  
  //Сохранить файл (базовый случай)
  const creatDocFile = async(docKey, originalName, name, mimetype, extension, pathSave, placeSave, size, user) => {
    
    const newDocFile = {
      docKey: docKey,
      originalName: originalName,
      name: name,
      mimetype: mimetype,
      extension: extension,
      pathSave: pathSave,
      placeSave: placeSave,
      size: size,
      createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
      updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    }
     const result = await knex("docFile").insert([newDocFile], ["id"]);
     newDocFile['id'] = result[0].id
     return newDocFile
  }

   //удаление Файла по id file
   const deleteDocFile = async (docFileId) => {
    return knex("docFile").where({ id: docFileId }).del()
   }
   //удаление всех файлов по id doc header
   const deleteDocFileByHeader = async (docHeaderId) => {
    return knex("docFile").where({ docKey: docHeaderId }).del()
   }
  
*/
module.exports.download = getDocFile;
module.exports.getOneById = getDocFileInfo;
module.exports.getAllByDocId = getDocFileInfoByDocHeader;
module.exports.save = saveDocFile;
module.exports.deleteById = deleteDocFile;
module.exports.deleteByHeader = deleteDocFileByHeader;
module.exports.upload = upload
  