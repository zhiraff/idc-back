const knex = require("../../knex_init");
//Методы работы с ОЭД
//Получить ОЭД, с постраничной пагинацией
const getDocErd = async (page, perpage, sort) => {
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
  let countData = await knex("docErd").first().count('id as countRow')
  let resultData = await knex("docErd")
  .leftJoin("FL", "docErd.flKey", "FL.id")
  .select("docErd.*", 
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

//Получить ОЭД, с постраничной пагинацией и параметрами
const getDocErdParam = async (page, perpage, docKey, flKey, dateIncome, beginPeriod, endPeriod, dose, flAccNum, sort) => {
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
  let queryObjectString = {}
  if (typeof docKey !== 'undefined'){
    queryObject['docKey'] = docKey
  }
    if (typeof flKey !== 'undefined'){
    queryObject['flKey'] = flKey
  }
  if (typeof beginPeriod !== 'undefined'){
    queryObject['beginPeriod'] = beginPeriod
  }
  if (typeof endPeriod !== 'undefined'){
    queryObject['endPeriod'] = endPeriod
  }
  if (typeof dose !== 'undefined'){
    queryObject['dose'] = dose
  }
  if (typeof dateIncome !== 'undefined'){
    queryObject['dateIncome'] = dateIncome
  }

// параметры поиска физического лица
if (typeof flAccNum !== 'undefined'){
  queryObjectString['flAccNum'] = '%' +  flAccNum + '%'
}else {
queryObjectString['flAccNum'] = '%%'
}


let countData = await knex("docErd")
.where(queryObject)
.whereIn('flKey', function() {
  this.select('id').from('FL')
  .whereILike("accNum", queryObjectString.flAccNum)
})
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("docErd")
 .where(queryObject)
 .whereIn('flKey', function() {
  this.select('id').from('FL')
  .whereILike("accNum", queryObjectString.flAccNum)
})
 .leftJoin("FL", "docErd.flKey", "FL.id")
  .select("docErd.*", 
  "FL.accNum as flAccNum")
 .orderBy(sortField, sortDirect)
 //.where(queryObject)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать ОЭД подробно
const getOneDocErd = async(docErdId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("docErd")
  .leftJoin("FL", "docErd.flKey", "FL.id")
  .first("docErd.*", 
  "FL.accNum as flAccNum")
  //.first()
  .where({ "docErd.id": docErdId })
}

//Создать ОЭД
const creatDocErd = async(docKey, flKey, dateIncome, beginPeriod, endPeriod, dose, user) => {
  const newDocErd = {
    docKey: docKey,
    flKey: flKey,
    dateIncome: dateIncome,
    beginPeriod: beginPeriod,
    endPeriod: endPeriod,
    dose: dose,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docErd").insert([newDocErd], ["id"]);
   newDocErd['id'] = result[0].id
   return newDocErd;
}
//Создать ОЭД по табельному номеру
const creatDocErdByAccNum = async(docKey, accNum, dateIncome, beginPeriod, endPeriod, dose, user) => {
  const fl = await knex("FL").first().where("accNum", accNum)
  const newDocErd = {
    docKey: docKey,
    flKey: fl.id,
    dateIncome: dateIncome,
    beginPeriod: beginPeriod,
    endPeriod: endPeriod,
    dose: dose,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docErd").insert([newDocErd], ["id"]);
   newDocErd['id'] = result[0].id
   return newDocErd;
}

//Создать ОЭД по снилс
const creatDocErdBySnils = async(docKey, snils, dateIncome, beginPeriod, endPeriod, dose, user) => {
  const fl = await knex("FL").first().where("snils", snils)
  const newDocErd = {
    docKey: docKey,
    flKey: fl.id,
    dateIncome: dateIncome,
    beginPeriod: beginPeriod,
    endPeriod: endPeriod,
    dose: dose,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("docErd").insert([newDocErd], ["id"]);
   newDocErd['id'] = result[0].id
   return newDocErd;
}

// обновление ОЭД
 const updateDocErd = async (docErdId, docKey, flKey, dateIncome, beginPeriod, endPeriod, dose, user) => {
    let updateObject = {}
    if (typeof docKey !== 'undefined'){
    updateObject['docKey'] = docKey
  }
  if (typeof flKey !== 'undefined'){
    updateObject['flKey'] = flKey
  }
  if (typeof beginPeriod !== 'undefined'){
    updateObject['beginPeriod'] = beginPeriod
  }
  if (typeof endPeriod !== 'undefined'){
    updateObject['endPeriod'] = endPeriod
  }
  if (typeof dose !== 'undefined'){
    updateObject['dose'] = dose
  }
  if (typeof dateIncome !== 'undefined'){
    updateObject['dateIncome'] = dateIncome
  }

  updateObject['updatedAt'] = new Date()
  
   
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("docErd")
    .where({ id: docErdId })
    .update(updateObject);
 }

 //удаление ОЭД
 const deleteDocErd = async (docErdId) => {
  return knex("docErd").where({ id: docErdId }).del()
 }

  //тест
  /*
 const test = async (name) => {
  console.log(`hello ${name}`)
  return 1+1+1
 }
*/
module.exports.get = getDocErd;
module.exports.getByParam = getDocErdParam;
module.exports.getOne = getOneDocErd;
module.exports.create = creatDocErd;
module.exports.createByAccNum = creatDocErdByAccNum;
module.exports.createBySnils = creatDocErdBySnils;
module.exports.update = updateDocErd;
module.exports.delete = deleteDocErd;
