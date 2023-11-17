const knex = require("../../knex_init");
//Методы работы с поступлениями радионуклидов
//Получить поступления радионуклидов, с постраничной пагинацией
const getDocIncome = async (page, perpage, sort) => {
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
  let countData = await knex("docIncome").first().count('id as countRow')
  let resultData = await knex("docIncome")
  .leftJoin("radionuclide", "docIncome.radionuclideKey", "radionuclide.id")
  .leftJoin("FL", "docIncome.flKey", "FL.id")
  .select("docIncome.*", 
  "radionuclide.name as radionuclideName",
  "FL.accNum as flAccNum")
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)
  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить поступления радионуклидов, с постраничной пагинацией и параметрами
const getDocIncomeParam = async (page, perpage, docKey, flKey, radionuclideKey, dateIncome, value, 
  radionuclideName, flAccNum, sort) => {
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
  if (typeof dateIncome !== 'undefined'){
    queryObject['dateIncome'] = dateIncome
  }
   if (typeof radionuclideKey !== 'undefined'){
    queryObject['radionuclideKey'] = radionuclideKey
  }
  if (typeof value !== 'undefined'){
    queryObject['value'] = value
  }

  let queryObjectString = {}

// параметры поиска физического лица
if (typeof flAccNum !== 'undefined'){
  queryObjectString['flAccNum'] = '%' +  flAccNum + '%'
}else {
queryObjectString['flAccNum'] = '%%'
}

// параметры поиска радионуклида
if (typeof radionuclideName !== 'undefined'){
  queryObjectString['radionuclideName'] = '%' +  radionuclideName + '%'
}else {
queryObjectString['radionuclideName'] = '%%'
}

let countData = await knex("docIncome")
.where(queryObject)
.whereIn('radionuclideKey', function() {
  this.select('id').from('radionuclide')
  .whereILike("name", queryObjectString.radionuclideName)
})
.whereIn('flKey', function() {
  this.select('id').from('FL')
  .whereILike("accNum", queryObjectString.flAccNum)
})
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("docIncome")
 .where(queryObject)
 .whereIn('radionuclideKey', function() {
  this.select('id').from('radionuclide')
  .whereILike("name", queryObjectString.radionuclideName)
})
.whereIn('flKey', function() {
  this.select('id').from('FL')
  .whereILike("accNum", queryObjectString.flAccNum)
})
 .leftJoin("radionuclide", "docIncome.radionuclideKey", "radionuclide.id")
 .leftJoin("FL", "docIncome.flKey", "FL.id")
 .select("docIncome.*", 
 "radionuclide.name as radionuclideName",
 "FL.accNum as flAccNum")
 .orderBy(sortField, sortDirect)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)

  return resultData
}

//Показать поступление радионуклида
const getOneDocIncome = async(docIncomeId) => {
  return knex("docIncome")
  .leftJoin("radionuclide", "docIncome.radionuclideKey", "radionuclide.id")
  .leftJoin("FL", "docIncome.flKey", "FL.id")
  .first("docIncome.*", 
  "radionuclide.name as radionuclideName",
  "FL.accNum as flAccNum")
 // .first()
  .where({ "docIncome.id": docIncomeId })
}

//Создать поступление радионуклида
const creatDocIncome = async(docKey, flKey, radionuclideKey, dateIncome, value, user) => {
  const newDocIncome = {
    docKey: docKey,
    flKey: flKey,
    radionuclideKey: radionuclideKey,
    dateIncome: dateIncome,
    value: value,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docIncome").insert([newDocIncome], ["id"]);
   newDocIncome['id'] = result[0].id
   return newDocIncome;
}

//Создать поступление радионуклида по табельному номеру
const creatDocIncomeByAccNum = async(docKey, accNum, radionuclideKey, dateIncome, value, user) => {
  const fl = await knex("FL").first().where("accNum", accNum)
  const newDocIncome = {
    docKey: docKey,
    flKey: fl.id,
    radionuclideKey: radionuclideKey,
    dateIncome: dateIncome,
    value: value,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docIncome").insert([newDocIncome], ["id"]);
   newDocIncome['id'] = result[0].id
   return newDocIncome;
}

//Создать поступление радионуклида по снилс
const creatDocIncomeBySnils = async(docKey, snils, radionuclideKey, dateIncome, value, user) => {
  const fl = await knex("FL").first().where("snils", snils)
  const newDocIncome = {
    docKey: docKey,
    flKey: fl.id,
    radionuclideKey: radionuclideKey,
    dateIncome: dateIncome,
    value: value,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docIncome").insert([newDocIncome], ["id"]);
   newDocIncome['id'] = result[0].id
   return newDocIncome;
}
// обновление поступления радионуклида
 const updateDocIncome = async (docIncomeId, docKey, flKey, radionuclideKey, dateIncome, value, user) => {
    let updateObject = {}
    if (typeof docKey !== 'undefined'){
    updateObject['docKey'] = docKey
  }
  if (typeof flKey !== 'undefined'){
    updateObject['flKey'] = flKey
  }
  if (typeof radionuclideKey !== 'undefined'){
    updateObject['radionuclideKey'] = radionuclideKey
  }
  if (typeof dateIncome !== 'undefined'){
    updateObject['dateIncome'] = dateIncome
  }
  if (typeof value !== 'undefined'){
    updateObject['value'] = value
  }

  updateObject['updatedAt'] = new Date()
  
   
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("docIncome")
    .where({ id: docIncomeId })
    .update(updateObject);
 }

 //удаление поступления радионуклида
 const deleteDocIncome = async (docIncomeId) => {
  return knex("docIncome").where({ id: docIncomeId }).del()
 }

module.exports.get = getDocIncome;
module.exports.getByParam = getDocIncomeParam;
module.exports.getOne = getOneDocIncome;
module.exports.create = creatDocIncome;
module.exports.createByAccNum = creatDocIncomeByAccNum;
module.exports.createBySnils = creatDocIncomeBySnils;
module.exports.update = updateDocIncome;
module.exports.delete = deleteDocIncome;
