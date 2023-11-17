const knex = require("../../knex_init");
//Методы работы с результатми СИЧ
//Получить результаты БФО, с постраничной пагинацией
const getDocHrs = async (page, perpage, sort) => {
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
  let countData = await knex("docHrs").first().count('id as countRow')
  let resultData = await knex("docHrs")
  .leftJoin("radionuclide", "docHrs.radionuclideKey", "radionuclide.id")
  .leftJoin("FL", "docHrs.flKey", "FL.id")
  .leftJoin("kindIdc", "docHrs.typeControlKey", "kindIdc.id")
  .leftJoin("bodyPart", "docHrs.bodyPartKey", "bodyPart.id")
  .select("docHrs.*", 
  "radionuclide.name as radionuclideName",
  "FL.accNum as flAccNum",
  "kindIdc.kindShort as typeControlShortName",
  "bodyPart.name as bodyPartName")
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)
  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить результаты СИЧ, с постраничной пагинацией и параметрами
const getDocHrsParam = async (page, perpage, docKey, flKey, dateExam, 
  typeControlKey, bodyPartKey, radionuclideKey,  consist, 
  flAccNum, typeControlName, radionuclideName, bodyPartName, sort) => {
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
  if (typeof bodyPartKey !== 'undefined'){
    queryObject['bodyPartKey'] = bodyPartKey
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

// параметры поиска части тела
if (typeof bodyPartName !== 'undefined'){
  queryObjectString['bodyPartName'] = '%' +  bodyPartName + '%'
}else {
queryObjectString['bodyPartName'] = '%%'
}

let countData = await knex("docHrs")
.where(queryObject)
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
.whereIn('bodyPartKey', function() {
  this.select('id').from('bodyPart')
  .whereILike("name", queryObjectString.bodyPartName)
})
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("docHrs")
 .where(queryObject)
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
.whereIn('bodyPartKey', function() {
  this.select('id').from('bodyPart')
  .whereILike("name", queryObjectString.bodyPartName)
})
 .leftJoin("radionuclide", "docHrs.radionuclideKey", "radionuclide.id")
 .leftJoin("FL", "docHrs.flKey", "FL.id")
 .leftJoin("kindIdc", "docHrs.typeControlKey", "kindIdc.id")
 .leftJoin("bodyPart", "docHrs.bodyPartKey", "bodyPart.id")
 .select("docHrs.*", 
 "radionuclide.name as radionuclideName",
 "FL.accNum as flAccNum",
 "kindIdc.kindShort as typeControlShortName",
 "bodyPart.name as bodyPartName")
 .orderBy(sortField, sortDirect)
 //.where(queryObject)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать результаты СИЧ подробно
const getOneDocHrs = async(docHrsId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("docHrs")
  .leftJoin("radionuclide", "docHrs.radionuclideKey", "radionuclide.id")
  .leftJoin("FL", "docHrs.flKey", "FL.id")
  .leftJoin("kindIdc", "docHrs.typeControlKey", "kindIdc.id")
  .leftJoin("bodyPart", "docHrs.bodyPartKey", "bodyPart.id")
  .first("docHrs.*", 
  "radionuclide.name as radionuclideName",
  "FL.accNum as flAccNum",
  "kindIdc.kindShort as typeControlShortName",
  "bodyPart.name as bodyPartName")
 // .first()
  .where({ "docHrs.id": docHrsId })
}

//Создать результаты СИЧ
const creatDocHrs = async(docKey, flKey, dateExam, typeControlKey, bodyPartKey, radionuclideKey,  consist, user) => {
  const newDocHrs = {
    docKey: docKey,
    flKey: flKey,
    dateExam: dateExam,
    typeControlKey: typeControlKey,
    bodyPartKey: bodyPartKey,
    radionuclideKey: radionuclideKey,
    consist: consist,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docHrs").insert([newDocHrs], ["id"]);
   newDocHrs['id'] = result[0].id
   return newDocHrs;
}

//Создать результаты СИЧ по теабельному номеру
const creatDocHrsByAccNum = async(docKey, accNum, dateExam, typeControlKey, bodyPartKey, radionuclideKey,  consist, user) => {
  const fl = await knex("FL").first().where("accNum", accNum)
  const newDocHrs = {
    docKey: docKey,
    flKey: fl.id,
    dateExam: dateExam,
    typeControlKey: typeControlKey,
    bodyPartKey: bodyPartKey,
    radionuclideKey: radionuclideKey,
    consist: consist,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docHrs").insert([newDocHrs], ["id"]);
   newDocHrs['id'] = result[0].id
   return newDocHrs;
}

//Создать результаты СИЧ по снилс
const creatDocHrsBySnils = async(docKey, snils, dateExam, typeControlKey, bodyPartKey, radionuclideKey,  consist, user) => {
  const fl = await knex("FL").first().where("snils", snils)
  const newDocHrs = {
    docKey: docKey,
    flKey: fl.id,
    dateExam: dateExam,
    typeControlKey: typeControlKey,
    bodyPartKey: bodyPartKey,
    radionuclideKey: radionuclideKey,
    consist: consist,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docHrs").insert([newDocHrs], ["id"]);
   newDocHrs['id'] = result[0].id
   return newDocHrs;
}

// обновление результаты СИЧ
 const updateDocHrs = async (docHrsId, docKey, flKey, dateExam, typeControlKey, bodyPartKey, radionuclideKey,  consist, user) => {
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
  if (typeof bodyPartKey !== 'undefined'){
    updateObject['bodyPartKey'] = bodyPartKey
  }
  if (typeof radionuclideKey !== 'undefined'){
    updateObject['radionuclideKey'] = radionuclideKey
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
   return knex("docHrs")
    .where({ id: docHrsId })
    .update(updateObject);
 }

 //удаление результаты СИЧ
 const deleteDocHrs = async (docHrsId) => {
  return knex("docHrs").where({ id: docHrsId }).del()
 }

module.exports.get = getDocHrs;
module.exports.getByParam = getDocHrsParam;
module.exports.getOne = getOneDocHrs;
module.exports.create = creatDocHrs;
module.exports.createByAccNum = creatDocHrsByAccNum;
module.exports.createBySnils = creatDocHrsBySnils;
module.exports.update = updateDocHrs;
module.exports.delete = deleteDocHrs;
