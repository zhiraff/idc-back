const knex = require("../../knex_init");
//Методы работы с результатми БФО
//Получить результаты БФО, с постраничной пагинацией
const getDocBpe = async (page, perpage, sort) => {
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
  let countData = await knex("docBpe").first().count('id as countRow')
  let resultData = await knex("docBpe")
  .leftJoin("radionuclide", "docBpe.radionuclideKey", "radionuclide.id")
  .leftJoin("FL", "docBpe.flKey", "FL.id")
  .leftJoin("kindIdc", "docBpe.typeControlKey", "kindIdc.id")
  .select("docBpe.*", 
  "radionuclide.name as radionuclideName",
  "FL.accNum as flAccNum",
  "kindIdc.kindShort as typeControlShortName")
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)
  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить результаты БФО, с постраничной пагинацией и параметрами
const getDocBpeParam = async (page, perpage, docKey, flKey, dateExam, 
  typeControlKey, radionuclideKey, material, consist, 
  flAccNum, typeControlName, radionuclideName, sort) => {
  // 1. Поиск по числовым значениям осуществляется через where
  // 2. Поиск по текстовым значением осуществлется через like
  // 3. Для полей, которые не обязательны для заполнения (в миграции не указано notNull() )
  // дополнительно проверяется на null !
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
    if (typeof flKey !== 'undefined'){
    queryObject['flKey'] = flKey
  }
  if (typeof dateExam !== 'undefined'){
    queryObject['dateExam'] = dateExam
  }
   if (typeof radionuclideKey !== 'undefined'){
    queryObject['radionuclideKey'] = radionuclideKey
  }
  if (typeof consist !== 'undefined'){
    queryObject['consist'] = consist
  }
  if (typeof typeControlKey !== 'undefined'){
    queryObject['typeControlKey'] = typeControlKey
  }

let queryObjectString = {}

  if (typeof material !== 'undefined'){
    queryObjectString['material'] = '%' +  material + '%'
}else {
  queryObjectString['material'] = '%%'
}

// параметры поиска физического лица
if (typeof flAccNum !== 'undefined'){
  queryObjectString['flAccNum'] = '%' +  flAccNum + '%'
}else {
queryObjectString['flAccNum'] = '%%'
}

// параметры поиска типа ИДК
if (typeof typeControlName !== 'undefined'){
  queryObjectString['typeControlName'] = '%' +  typeControlName + '%'
}else {
queryObjectString['typeControlName'] = '%%'
}

// параметры поиска радионуклида
if (typeof radionuclideName !== 'undefined'){
  queryObjectString['radionuclideName'] = '%' +  radionuclideName + '%'
}else {
queryObjectString['radionuclideName'] = '%%'
}

let countData = await knex("docBpe")
.where(queryObject)
.andWhereILike("material", queryObjectString.material)
.whereIn('radionuclideKey', function() {
  this.select('id').from('radionuclide')
  .whereILike("name", queryObjectString.radionuclideName)
})
.whereIn('flKey', function() {
  this.select('id').from('FL')
  .whereILike("accNum", queryObjectString.flAccNum)
})
.whereIn('typeControlKey', function() {
  this.select('id').from('kindIdc')
  .whereILike("kindShort", queryObjectString.typeControlName)
})
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("docBpe")
 .where(queryObject)
 .andWhereILike("material", queryObjectString.material)
 .whereIn('radionuclideKey', function() {
  this.select('id').from('radionuclide')
  .whereILike("name", queryObjectString.radionuclideName)
})
.whereIn('flKey', function() {
  this.select('id').from('FL')
  .whereILike("accNum", queryObjectString.flAccNum)
})
.whereIn('typeControlKey', function() {
  this.select('id').from('kindIdc')
  .whereILike("kindShort", queryObjectString.typeControlName)
})
 .leftJoin("radionuclide", "docBpe.radionuclideKey", "radionuclide.id")
 .leftJoin("FL", "docBpe.flKey", "FL.id")
 .leftJoin("kindIdc", "docBpe.typeControlKey", "kindIdc.id")
 .select("docBpe.*", 
 "radionuclide.name as radionuclideName",
 "FL.accNum as flAccNum",
 "kindIdc.kindShort as typeControlShortName")

 .orderBy(sortField, sortDirect)
 //.where(queryObject)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)

  return resultData
}

//Показать результаты БФО подробно
const getOneDocBpe = async(docBpeId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("docBpe")
  .leftJoin("radionuclide", "docBpe.radionuclideKey", "radionuclide.id")
  .leftJoin("FL", "docBpe.flKey", "FL.id")
  .leftJoin("kindIdc", "docBpe.typeControlKey", "kindIdc.id")
  .first("docBpe.*", 
  "radionuclide.name as radionuclideName",
  "FL.accNum as flAccNum",
  "kindIdc.kindShort as typeControlShortName")
  //.first()
  .where({ "docBpe.id": docBpeId })
}

//Создать результаты БФО
const creatDocBpe = async(docKey, flKey, dateExam, typeControlKey, radionuclideKey, material, consist, user) => {
  const newDocBpe = {
    docKey: docKey,
    flKey: flKey,
    dateExam: dateExam,
    typeControlKey: typeControlKey,
    radionuclideKey: radionuclideKey,
    material: material,
    consist: consist,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docBpe").insert([newDocBpe], ["id"]);
   newDocBpe['id'] = result[0].id
   return newDocBpe;
}

//Создать результаты БФО по табельному номеру
const creatDocBpeByAccNum = async(docKey, accNum, dateExam, typeControlKey, radionuclideKey, material, consist, user) => {
  const fl = await knex("FL").first().where("accNum", accNum)
  const newDocBpe = {
    docKey: docKey,
    flKey: fl.id,
    dateExam: dateExam,
    typeControlKey: typeControlKey,
    radionuclideKey: radionuclideKey,
    material: material,
    consist: consist,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docBpe").insert([newDocBpe], ["id"]);
   newDocBpe['id'] = result[0].id
   return newDocBpe;
}
//Создать результаты БФО по снилс
const creatDocBpeBySnils = async(docKey, snils, dateExam, typeControlKey, radionuclideKey, material, consist, user) => {
  const fl = await knex("FL").first().where("snils", snils)
  const newDocBpe = {
    docKey: docKey,
    flKey: fl.id,
    dateExam: dateExam,
    typeControlKey: typeControlKey,
    radionuclideKey: radionuclideKey,
    material: material,
    consist: consist,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docBpe").insert([newDocBpe], ["id"]);
   newDocBpe['id'] = result[0].id
   return newDocBpe;
}

// обновление результаты БФО
 const updateDocBpe = async (docBpeId, docKey, flKey, dateExam, typeControlKey, radionuclideKey, material, consist, user) => {
    let updateObject = {}
    if (typeof docKey !== 'undefined'){
    updateObject['docKey'] = docKey
  }
  if (typeof flKey !== 'undefined'){
    updateObject['flKey'] = flKey
  }
  if (typeof dateExam !== 'undefined'){
    updateObject['dateExam'] = dateExam
  }
  if (typeof typeControlKey !== 'undefined'){
    updateObject['typeControlKey'] = typeControlKey
  }
  if (typeof radionuclideKey !== 'undefined'){
    updateObject['radionuclideKey'] = radionuclideKey
  }
  if (typeof material !== 'undefined'){
    updateObject['material'] = material
  }
  if (typeof consist !== 'undefined'){
    updateObject['consist'] = consist
  }

  updateObject['updatedAt'] = new Date()
  
   
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("docBpe")
    .where({ id: docBpeId })
    .update(updateObject);
 }

 //удаление результаты БФО
 const deleteDocBpe = async (docBpeId) => {
  return knex("docBpe").where({ id: docBpeId }).del()
 }


module.exports.get = getDocBpe;
module.exports.getByParam = getDocBpeParam;
module.exports.getOne = getOneDocBpe;
module.exports.create = creatDocBpe;
module.exports.createByAccNum = creatDocBpeByAccNum;
module.exports.createBySnils = creatDocBpeBySnils;
module.exports.update = updateDocBpe;
module.exports.delete = deleteDocBpe;
