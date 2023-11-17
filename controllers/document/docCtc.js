const knex = require("../../knex_init");
//Методы работы с результатми Хелатотерапии
//Получить результаты Хелатотерапии, с постраничной пагинацией
const getDocCtc = async (page, perpage, sort) => {
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
  let countData = await knex("docCtc").first().count('id as countRow')
  let resultData = await knex("docCtc")
  .leftJoin("radionuclide", "docCtc.radionuclideKey", "radionuclide.id")
  .leftJoin("FL", "docCtc.flKey", "FL.id")
  .leftJoin("kindIdc", "docCtc.typeControlKey", "kindIdc.id")
  .select("docCtc.*", 
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

//Получить результаты Хелатотерапии, с постраничной пагинацией и параметрами
const getDocCtcParam = async (page, perpage, docKey, flKey, dateExam, 
  typeControlKey, dateInput, radionuclideKey, material, consist, 
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
  if (typeof dateInput !== 'undefined'){
    queryObject['dateInput'] = dateInput
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

let countData = await knex("docCtc")
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

 let resultData = await knex("docCtc")
 .where(queryObject)
 .andWhereILike("material", queryObjectString.material)
 .whereIn('radionuclideKey', function() {
  this.select('id').from('radionuclide')
  .whereILike("name", queryObjectString.radionuclideName)
})
.whereIn('flKey', function() {
  this.select('id').from('radionuclide')
  .whereILike("accNum", queryObjectString.flAccNum)
})
.whereIn('typeControlKey', function() {
  this.select('id').from('kindIdc')
  .whereILike("kindShort", queryObjectString.typeControlName)
})
 .leftJoin("radionuclide", "docCtc.radionuclideKey", "radionuclide.id")
 .leftJoin("FL", "docCtc.flKey", "FL.id")
 .leftJoin("kindIdc", "docCtc.typeControlKey", "kindIdc.id")
 .select("docCtc.*", 
 "radionuclide.name as radionuclideName",
 "FL.accNum as flAccNum",
 "kindIdc.kindShort as typeControlShortName")
 .orderBy(sortField, sortDirect)
 //.where(queryObject)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать результаты Хелатотерапии подробно
const getOneDocCtc = async(docCtcId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("docCtc")
  .leftJoin("radionuclide", "docCtc.radionuclideKey", "radionuclide.id")
  .leftJoin("FL", "docCtc.flKey", "FL.id")
  .leftJoin("kindIdc", "docCtc.typeControlKey", "kindIdc.id")
  .first("docCtc.*", 
  "radionuclide.name as radionuclideName",
  "FL.accNum as flAccNum",
  "kindIdc.kindShort as typeControlShortName")
  .where({ "docCtc.id": docCtcId })
}

//Создать результаты Хелатотерапии
const creatDocCtc = async(docKey, flKey, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist, user) => {
  const newDocCtc = {
    docKey: docKey,
    flKey: flKey,
    dateExam: dateExam,
    typeControlKey: typeControlKey,
    dateInput: dateInput,
    radionuclideKey: radionuclideKey,
    material: material,
    consist: consist,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docCtc").insert([newDocCtc], ["id"]);
   newDocCtc['id'] = result[0].id
   return newDocCtc;
}

//Создать результаты Хелатотерапии по accNum
const creatDocCtcByAccNum = async(docKey, accNum, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist, user) => {
  const fl = await knex("FL").first().where("accNum", accNum)
  const newDocCtc = {
    docKey: docKey,
    flKey: fl.id,
    dateExam: dateExam,
    typeControlKey: typeControlKey,
    dateInput: dateInput,
    radionuclideKey: radionuclideKey,
    material: material,
    consist: consist,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docCtc").insert([newDocCtc], ["id"]);
   newDocCtc['id'] = result[0].id
   return newDocCtc;
}

//Создать результаты Хелатотерапии по снилс
const creatDocCtcBySnils = async(docKey, snils, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist, user) => {
  const fl = await knex("FL").first().where("snils", snils)
  const newDocCtc = {
    docKey: docKey,
    flKey: fl.id,
    dateExam: dateExam,
    typeControlKey: typeControlKey,
    dateInput: dateInput,
    radionuclideKey: radionuclideKey,
    material: material,
    consist: consist,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docCtc").insert([newDocCtc], ["id"]);
   newDocCtc['id'] = result[0].id
   return newDocCtc;
}

// обновление результаты Хелатотерапии
 const updateDocCtc = async (docCtcId, docKey, flKey, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist, user) => {
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
  if (typeof dateInput !== 'undefined'){
    updateObject['dateInput'] = dateInput
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
   return knex("docCtc")
    .where({ id: docCtcId })
    .update(updateObject);
 }

 //удаление результаты Хелатотерапии
 const deleteDocCtc = async (docCtcId) => {
  return knex("docCtc").where({ id: docCtcId }).del()
 }

  //тест
  /*
 const test = async (name) => {
  console.log(`hello ${name}`)
  return 1+1+1
 }
*/
module.exports.get = getDocCtc;
module.exports.getByParam = getDocCtcParam;
module.exports.getOne = getOneDocCtc;
module.exports.create = creatDocCtc;
module.exports.createByAccNum = creatDocCtcByAccNum;
module.exports.createBySnils = creatDocCtcBySnils;
module.exports.update = updateDocCtc;
module.exports.delete = deleteDocCtc;
