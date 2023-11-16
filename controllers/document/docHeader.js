const knex = require("../../knex_init");
const { options } = require("../../date_init");
//Методы работы с заголовками документов
//Получить части тела, с постраничной пагинацией
const getDocHeader = async (page, perpage, startDate, endDate, sort) => {
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
  let sortField = 'id'
  let sortDirect = 'asc'
  let queryObject = {}
  if (typeof sort !== 'undefined'){
    if (sort.startsWith('-')){
      sortField = sort.slice(1)
      sortDirect = 'desc'
    }else{
      sortField = sort
    }
  }
  
  if (typeof startDate !== 'undefined'){
    queryObject['startDate'] = new Date(startDate)
  } else {
    queryObject['startDate'] = new Date(90, 1)
  }
  if (typeof endDate !== 'undefined'){
    queryObject['endDate'] = new Date(endDate)
  } else {
    queryObject['endDate'] = new Date(8640000000000000)
  }
 // console.log(queryObject)
  let countData = await knex("docHeader")
  .whereBetween('dateDocument', [queryObject.startDate, queryObject.endDate])
  .first()
  .count('id as countRow')
  let resultData = await knex("docHeader")
  .whereBetween('dateDocument', [queryObject.startDate, queryObject.endDate])
  .select()
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить Заголовки документов, с постраничной пагинацией и параметрами
const getDocHeaderParam = async (page, perpage, organization, typeDocument, typeExam, dateDocument, numberDocument, beginPeriod, endPeriod, startDate, endDate, sort) => {
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
  let queryObjectRangeDate = {}
  if (typeof dateDocument !== 'undefined'){
    queryObject['dateDocument'] = dateDocument
  }
    if (typeof beginPeriod !== 'undefined'){
    queryObject['beginPeriod'] = beginPeriod
  }
  if (typeof endPeriod !== 'undefined'){
    queryObject['endPeriod'] = endPeriod
  }

let queryObjectString = {}
if (typeof organization !== 'undefined'){
  queryObjectString['organization'] = '%' + organization + '%'
} else {
  queryObjectString['organization'] = '%%'
}
  if (typeof typeDocument !== 'undefined'){
    queryObjectString['typeDocument'] = '%' +  typeDocument + '%'
}else {
  queryObjectString['typeDocument'] = '%%'
}

if (typeof typeExam !== 'undefined'){
    queryObjectString['typeExam'] = '%' +  typeExam + '%'
}else {
  queryObjectString['typeExam'] = '%%'
}
if (typeof numberDocument !== 'undefined'){
    queryObjectString['numberDocument'] = '%' +  numberDocument + '%'
}else {
  queryObjectString['numberDocument'] = '%%'
}
if (typeof startDate !== 'undefined'){
  queryObjectRangeDate['startDate'] = new Date(startDate)
} else {
    queryObjectRangeDate['startDate'] = new Date(90, 1)
  }
if (typeof endDate !== 'undefined'){
  queryObjectRangeDate['endDate'] = new Date(endDate)
} else {
  queryObjectRangeDate['endDate'] = new Date(8640000000000000)
  }
 // console.log(queryObjectRangeDate)
let countData = await knex("docHeader")
.where(queryObject)
.whereBetween('dateDocument', [queryObjectRangeDate.startDate, queryObjectRangeDate.endDate])
.andWhereILike("organization", queryObjectString.organization)
.andWhereILike("typeDocument", queryObjectString.typeDocument)
.andWhereILike("typeExam", queryObjectString.typeExam)
.andWhereILike("numberDocument", queryObjectString.numberDocument)
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("docHeader")
 .where(queryObject)
 .whereBetween('dateDocument', [queryObjectRangeDate.startDate, queryObjectRangeDate.endDate])
 .andWhereILike("organization", queryObjectString.organization)
 .andWhereILike("typeDocument", queryObjectString.typeDocument)
 .andWhereILike("typeExam", queryObjectString.typeExam)
 .andWhereILike("numberDocument", queryObjectString.numberDocument)
 .select()
 .orderBy(sortField, sortDirect)
 //.where(queryObject)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать заголовок документа подробно
const getOneDocHeader = async(docHeaderId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("docHeader").first().where({ id: docHeaderId })
}

//Создать Заголовок документа
const creatDocHeader = async(organization, typeDocument, typeExam, dateDocument, numberDocument, beginPeriod, endPeriod, user) => {
  const newDocHeader = {
    organization: organization,
    typeDocument: typeDocument,
    typeExam: typeExam,
    dateDocument: dateDocument,
    numberDocument: numberDocument,
  //  beginPeriod: beginPeriod,
  //  endPeriod: endPeriod,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
  if (typeof beginPeriod !== 'undefined' && beginPeriod !== ''){
    newDocHeader['beginPeriod'] = beginPeriod
  }
  if (typeof endPeriod !== 'undefined' && endPeriod !== ''){
    newDocHeader['endPeriod'] = endPeriod
  }
   const result = await knex("docHeader").insert([newDocHeader], ["id"]);
   newDocHeader['id'] = result[0].id
   return newDocHeader;
}

// обновление заголовка
 const updateDocHeader = async (docHeaderId, organization, typeDocument, typeExam, dateDocument, numberDocument, beginPeriod, endPeriod, user) => {
    let updateObject = {}
    if (typeof organization !== 'undefined'){
    updateObject['organization'] = organization
  }

  if (typeof typeDocument !== 'undefined'){
    updateObject['typeDocument'] = typeDocument
  }

  if (typeof typeExam !== 'undefined'){
    updateObject['typeExam'] = typeExam
  }

  if (typeof dateDocument !== 'undefined'){
    updateObject['dateDocument'] = dateDocument
  }

  if (typeof numberDocument !== 'undefined'){
    updateObject['numberDocument'] = numberDocument
  }

  if (typeof beginPeriod !== 'undefined'){
    updateObject['beginPeriod'] = beginPeriod
  }
  if (typeof endPeriod !== 'undefined'){
    updateObject['endPeriod'] = endPeriod
  }

  updateObject['updatedAt'] = new Date()
  
   
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("docHeader")
    .where({ id: docHeaderId })
    .update(updateObject);
 }

 //удаление части тела
 const deleteDocHeader = async (docHeaderId) => {
  return knex("docHeader").where({ id: docHeaderId }).del()
 }

  //тест
  /*
 const test = async (name) => {
  console.log(`hello ${name}`)
  return 1+1+1
 }
*/
module.exports.get = getDocHeader;
module.exports.getByParam = getDocHeaderParam;
module.exports.getOne = getOneDocHeader;
module.exports.create = creatDocHeader;
module.exports.update = updateDocHeader;
module.exports.delete = deleteDocHeader;
