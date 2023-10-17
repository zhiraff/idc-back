const knex = require("../../knex_init");
//Методы для мониторинга данных по БФО
//Получить данные по БФО, с постраничной пагинацией

const getBpe = async (page, perpage, sort) => {
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
  let countData = await knex("docBpe")
  .first()
  .count('id as countRow')

  let resultData = await knex("docBpe")
  .leftJoin('FL', 'docBpe.flKey', 'FL.id')
  .leftJoin('radionuclide', 'docBpe.radionuclideKey', 'radionuclide.id')
  .leftJoin('docHeader', 'docBpe.docKey', 'docHeader.id')
  .select(
    "FL.accNum as accNum", 
  "FL.organization as workOrganization", 
  "docBpe.dateExam", 
  "radionuclide.symbol as radionuclide",
  "docHeader.organization as docOrganization",
  "docHeader.dateDocument as docDate",
  "docHeader.numberDocument as docNumber",
  "docHeader.beginPeriod as beginPeriod",
  "docHeader.endPeriod as endPeriod",
  "docBpe.material as material",
  "docBpe.id as id",
  "docBpe.consist")
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)

  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить данные по БФО только последние результаты, с постраничной пагинацией
const getBpeLast = async (page, perpage, sort) => {
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
    let needRows = await knex("docBpe")
    .select("docBpe.flKey", "docBpe.radionuclideKey", "docBpe.material")
    .groupBy("docBpe.flKey", "docBpe.radionuclideKey", "docBpe.material")
    .max("docBpe.dateExam as dateExam")
    .limit(prpg)
    .offset((pg-1)*prpg)
    //console.log(needRows)
    for(let i=0; i< needRows.length; i++){
      resultData.push(await knex("docBpe")
      .leftJoin('FL', 'docBpe.flKey', 'FL.id')
      .leftJoin('radionuclide', 'docBpe.radionuclideKey', 'radionuclide.id')
      .leftJoin('docHeader', 'docBpe.docKey', 'docHeader.id')
      .first("FL.accNum as accNum", 
      "FL.organization as workOrganization", 
      "docBpe.dateExam", 
      "radionuclide.symbol as radionuclide",
      "docHeader.organization as docOrganization",
      "docHeader.dateDocument as docDate",
      "docHeader.numberDocument as docNumber",
      "docHeader.beginPeriod as beginPeriod",
      "docHeader.endPeriod as endPeriod",
      "docBpe.material as material",
      "docBpe.id as id",
      "docBpe.consist")
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

//Получить данные по БФО, с постраничной пагинацией и параметрами
const getBpeParam = async (page, perpage, accNum, workOrganization, dateExam, radionuclide, 
  docOrganization, docDate, docNumber, beginPeriod, endPeriod, material, consist, sort) => {
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
//параметры радионуклида
if (typeof radionuclide !== 'undefined'){
  queryObjectString['radionuclide'] = '%' + radionuclide + '%'
} else {
  queryObjectString['radionuclide'] = '%%'
}

//параметры результатов БФО
if (typeof dateExam !== 'undefined'){
  queryObject['dateExam'] = dateExam
}
if (typeof consist !== 'undefined'){
  queryObject['consist'] = consist
}

if (typeof material !== 'undefined'){
  queryObjectString['material'] = '%' + material + '%'
} else {
  queryObjectString['material'] = '%%'
}

let countData = await knex("docBpe")
.where(queryObject)
.whereIn('flKey', function() {
  this.select('id').from('FL')
  .whereILike("organization", queryObjectString.workOrganization)
  .andWhereILike("accNum", queryObjectString.accNum);
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
.andWhereILike("material", queryObjectString.material)
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("docBpe")
 .leftJoin('FL', 'docBpe.flKey', 'FL.id')
  .leftJoin('radionuclide', 'docBpe.radionuclideKey', 'radionuclide.id')
  .leftJoin('docHeader', 'docBpe.docKey', 'docHeader.id')
  .select(
    "FL.accNum as accNum", 
  "FL.organization as workOrganization", 
  "docBpe.dateExam", 
  "radionuclide.symbol as radionuclide",
  "docHeader.organization as docOrganization",
  "docHeader.dateDocument as docDate",
  "docHeader.numberDocument as docNumber",
  "docHeader.beginPeriod as beginPeriod",
  "docHeader.endPeriod as endPeriod",
  "docBpe.material as material",
  "docBpe.id as id")
 .where(queryObject)
.whereIn('flKey', function() {
  this.select('id').from('FL')
  .whereILike("organization", queryObjectString.workOrganization)
  .andWhereILike("accNum", queryObjectString.accNum);
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
.andWhereILike("material", queryObjectString.material)
 .orderBy(sortField, sortDirect)
 //.where(queryObject)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

module.exports.get = getBpe;
module.exports.getByParam = getBpeParam;
module.exports.getLast = getBpeLast;


