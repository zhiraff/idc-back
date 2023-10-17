const knex = require("../../knex_init");
//Методы для мониторинга данных по СИЧ
//Получить данные по СИЧ, с постраничной пагинацией

const getHrs = async (page, perpage, sort) => {
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
  let countData = await knex("docHrs")
  .first()
  .count('id as countRow')

  let resultData = await knex("docHrs")
  .leftJoin('FL', 'docHrs.flKey', 'FL.id')
  .leftJoin('radionuclide', 'docHrs.radionuclideKey', 'radionuclide.id')
  .leftJoin('docHeader', 'docHrs.docKey', 'docHeader.id')
  .leftJoin('kindIdc', 'docHrs.typeControlKey', 'kindIdc.id')
  .leftJoin('bodyPart', 'docHrs.bodyPartKey', 'bodyPart.id')
  .select(
  "FL.accNum as accNum", 
  "FL.organization as workOrganization", 
  "FL.secondName as secondName", 
  "FL.firstName as firstName", 
  "FL.thirdName as thirdName", 
  "docHrs.dateExam", 
  // "radionuclide.symbol as radionuclide",
  "docHeader.organization as docOrganization",
  "docHeader.dateDocument as docDate",
  "docHeader.numberDocument as docNumber",
  "docHeader.beginPeriod as beginPeriod",
  "docHeader.endPeriod as endPeriod",
  "kindIdc.kindShort as kindIdc",
  "bodyPart.name as bodyPart",
  "docHrs.id as id",
  "docHrs.consist")
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)

  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить данные по СИЧ только последние результаты, с постраничной пагинацией
const getHrsLast = async (page, perpage, sort) => {
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
    let resultData = []
    let countData = {}
    let needRows = await knex("docHrs")
    .select("docHrs.flKey", "docHrs.radionuclideKey", "docHrs.bodyPartKey")
    .groupBy("docHrs.flKey", "docHrs.radionuclideKey", "docHrs.bodyPartKey")
    .max("docHrs.dateExam as dateExam")
    .limit(prpg)
    .offset((pg-1)*prpg)
    //console.log(needRows)
    for(let i=0; i< needRows.length; i++){
      resultData.push(await knex("docHrs")
      .leftJoin('FL', 'docHrs.flKey', 'FL.id')
      .leftJoin('radionuclide', 'docHrs.radionuclideKey', 'radionuclide.id')
      .leftJoin('docHeader', 'docHrs.docKey', 'docHeader.id')
      .leftJoin('kindIdc', 'docHrs.typeControlKey', 'kindIdc.id')
      .leftJoin('bodyPart', 'docHrs.bodyPartKey', 'bodyPart.id')
      .first(
      "FL.accNum as accNum", 
      "FL.organization as workOrganization", 
      "FL.secondName as secondName", 
      "FL.firstName as firstName", 
      "FL.thirdName as thirdName", 
      "docHrs.dateExam", 
      // "radionuclide.symbol as radionuclide",
      "docHeader.organization as docOrganization",
      "docHeader.dateDocument as docDate",
      "docHeader.numberDocument as docNumber",
      "docHeader.beginPeriod as beginPeriod",
      "docHeader.endPeriod as endPeriod",
      "kindIdc.kindShort as kindIdc",
      "bodyPart.name as bodyPart",
      "docHrs.id as id",
      "docHrs.consist")
      .where(needRows[i]))
    }
    console.log(resultData)
      countData = {
        countRow: resultData.length,
        pages: Math.ceil(resultData.length/prpg),
        currentPage: pg
      }
      resultData.push(countData)
    return resultData
  }

//Получить данные по СИЧ, с постраничной пагинацией и параметрами
const getHrsParam = async (page, perpage, accNum, firstName, secondName, thirdName, 
  workOrganization, dateExam, radionuclide, 
  kindIdc, docOrganization, docDate, docNumber, beginPeriod, endPeriod, 
  bodyPart, consist, sort) => {
  // 1. Поиск по числовым значениям осуществляется через where
  // 2. Поиск по текстовым значением осуществлется через like
  // 3. Для полей, которые не обязательны для заполнения (в миграции не указано notNull() )
  // дополнительно проверяется на null !
  // 4. Поиск по данными из других таблиц осуществляется через whereIn
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
  let queryObjectDoc = {}
  let queryObjectString = {}
  // параметры документа
  if (typeof docDate !== 'undefined'){
    queryObjectDoc['docDate'] = docDate
  }
  if (typeof beginPeriod !== 'undefined'){
    queryObjectDoc['beginPeriod'] = beginPeriod
  }
  if (typeof endPeriod !== 'undefined'){
    queryObjectDoc['endPeriod'] = endPeriod
  }
  if (typeof docOrganization !== 'undefined'){
    queryObjectString['docOrganization'] = '%' + docOrganization + '%'
  } else {
    queryObjectString['docOrganization'] = '%%'
  }
  if (typeof docNumber !== 'undefined'){
    queryObjectString['docNumber'] = '%' + docNumber + '%'
  } else {
    queryObjectString['docNumber'] = '%%'
  }
  

//параметры физ лица
if (typeof accNum !== 'undefined'){
  queryObjectString['accNum'] = '%' + accNum + '%'
} else {
  queryObjectString['accNum'] = '%%'
}
if (typeof workOrganization !== 'undefined'){
  queryObjectString['workOrganization'] = '%' + workOrganization + '%'
} else {
  queryObjectString['workOrganization'] = '%%'
}
if (typeof firstName !== 'undefined'){
  queryObjectString['firstName'] = '%' + firstName + '%'
} else {
  queryObjectString['firstName'] = '%%'
}
if (typeof secondName !== 'undefined'){
  queryObjectString['secondName'] = '%' + secondName + '%'
} else {
  queryObjectString['secondName'] = '%%'
}
if (typeof thirdName !== 'undefined'){
  queryObjectString['thirdName'] = '%' + thirdName + '%'
} else {
  queryObjectString['thirdName'] = '%%'
}

//параметры радионуклида
if (typeof radionuclide !== 'undefined'){
  queryObjectString['radionuclide'] = '%' + radionuclide + '%'
} else {
  queryObjectString['radionuclide'] = '%%'
}

//параметры видов ИДК
if (typeof kindIdc !== 'undefined'){
  queryObjectString['kindIdc'] = '%' + kindIdc + '%'
} else {
  queryObjectString['kindIdc'] = '%%'
}

//параметры частей тела
if (typeof bodyPart !== 'undefined'){
  queryObjectString['bodyPart'] = '%' + bodyPart + '%'
} else {
  queryObjectString['bodyPart'] = '%%'
}

//параметры результатов СИЧ
if (typeof dateExam !== 'undefined'){
  queryObject['dateExam'] = dateExam
}
if (typeof consist !== 'undefined'){
  queryObject['consist'] = consist
}


let countData = await knex("docHrs")
.where(queryObject)
.whereIn('flKey', function() {
  this.select('id').from('FL')
  .whereILike("organization", queryObjectString.workOrganization)
  .andWhereILike("accNum", queryObjectString.accNum)
  .andWhereILike("firstName", queryObjectString.firstName)
  .andWhereILike("secondName", queryObjectString.secondName)
  .andWhereILike("thirdName", queryObjectString.thirdName);
})
.whereIn('radionuclideKey', function() {
  this.select('id').from('radionuclide')
  .whereILike("symbol", queryObjectString.radionuclide)
  //.andWhereILike("accNum", queryObjectString.accNum);
})
.whereIn('docKey', function() {
  this.select('id').from('docHeader')
  .where(queryObjectDoc)
  .andWhereILike("organization", queryObjectString.docOrganization)
  .andWhereILike("numberDocument", queryObjectString.docNumber);
})
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("docHrs")
 .leftJoin('FL', 'docHrs.flKey', 'FL.id')
 .leftJoin('radionuclide', 'docHrs.radionuclideKey', 'radionuclide.id')
 .leftJoin('docHeader', 'docHrs.docKey', 'docHeader.id')
 .leftJoin('kindIdc', 'docHrs.typeControlKey', 'kindIdc.id')
 .leftJoin('bodyPart', 'docHrs.bodyPartKey', 'bodyPart.id')
 .select(
 "FL.accNum as accNum", 
 "FL.organization as workOrganization", 
 "FL.secondName as secondName", 
 "FL.firstName as firstName", 
 "FL.thirdName as thirdName", 
 "docHrs.dateExam", 
 // "radionuclide.symbol as radionuclide",
 "docHeader.organization as docOrganization",
 "docHeader.dateDocument as docDate",
 "docHeader.numberDocument as docNumber",
 "docHeader.beginPeriod as beginPeriod",
 "docHeader.endPeriod as endPeriod",
 "kindIdc.kindShort as kindIdc",
 "bodyPart.name as bodyPart",
 "docHrs.id as id",
 "docHrs.consist")
  .where(queryObject)
  .whereIn('flKey', function() {
    this.select('id').from('FL')
    .whereILike("organization", queryObjectString.workOrganization)
    .andWhereILike("accNum", queryObjectString.accNum)
    .andWhereILike("firstName", queryObjectString.firstName)
    .andWhereILike("secondName", queryObjectString.secondName)
    .andWhereILike("thirdName", queryObjectString.thirdName);
  })
  .whereIn('radionuclideKey', function() {
    this.select('id').from('radionuclide')
    .whereILike("symbol", queryObjectString.radionuclide)
    //.andWhereILike("accNum", queryObjectString.accNum);
  })
  .whereIn('docKey', function() {
    this.select('id').from('docHeader')
    .where(queryObjectDoc)
    .andWhereILike("organization", queryObjectString.docOrganization)
    .andWhereILike("numberDocument", queryObjectString.docNumber);
  })
 .orderBy(sortField, sortDirect)
 //.where(queryObject)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

module.exports.get = getHrs;
module.exports.getByParam = getHrsParam;
module.exports.getLast = getHrsLast;


