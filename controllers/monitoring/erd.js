const knex = require("../../knex_init");
//Методы для мониторинга данных по ОЭД
//Получить данные по ОЭД, с постраничной пагинацией

const getErd = async (page, perpage, sort) => {
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
  
  let detailData = []
  let countData = {}

  let needRows = await knex("docErd")
    .select("docErd.flKey", "docErd.docKey")
    .groupBy("docErd.flKey", "docErd.docKey")
    //.max("docErd.dateExam as dateExam")
    .limit(prpg)
    .offset((pg-1)*prpg)
    //console.log(needRows)

    for(let i=0; i< needRows.length; i++){
        
      detailData = await knex("docErd")
      .leftJoin('FL', 'docErd.flKey', 'FL.id')
      .leftJoin('docHeader', 'docErd.docKey', 'docHeader.id')
      .select(
      "FL.accNum as accNum", 
      "FL.organization as workOrganization", 
      "docHeader.organization as docOrganization",
      "docHeader.dateDocument as docDate",
      "docHeader.numberDocument as docNumber",
      "docErd.id as id",
      "docErd.dateIncome", 
      "docErd.beginPeriod", 
      "docErd.endPeriod",
      "docErd.dose")
      .where(needRows[i])
      .orderBy([
        {column: "beginPeriod", order: "asc"},
        {column: "endPeriod", order: "asc"}
      ])
      
    let k = 0;
    let resultObject = {}
    for(let j=0; j < detailData.length; j++){
        let period = detailData[j].endPeriod.getFullYear() - detailData[j].beginPeriod.getFullYear()
        resultObject["accNum"] = detailData[j]["accNum"]
        resultObject["workOrganization"] = detailData[j]["workOrganization"]
        resultObject["docOrganization"] = detailData[j]["docOrganization"]
        resultObject["docDate"] = detailData[j]["docDate"]
        resultObject["docNumber"] = detailData[j]["docNumber"]
        if (period === 1) {
          k++;
          resultObject[`erd${k}`] = detailData[j]["dose"]
        }else{
          resultObject[`erd${period}`] = detailData[j]["dose"]
        }
    }


    resultData.push(resultObject)
    
     // detailData.push(await knex("docErd")
      //)
    }
    
    //console.log(detailData)
    //console.log(resultObject)
    countData = {
      countRow: resultData.length,
      pages: Math.ceil(resultData.length/prpg),
      currentPage: pg
    }
    resultData.push(countData)
  return resultData
}

//Получить данные по ОЭД только последние результаты, с постраничной пагинацией
const getErdLast = async (page, perpage, sort) => {
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
  
  let detailData = []
  let countData = {}

  let needRows = await knex("docErd")
    .select("docErd.flKey")
    .groupBy("docErd.flKey")
    .max("docErd.dateIncome as dateIncome")
    .limit(prpg)
    .offset((pg-1)*prpg)
    console.log(needRows)

    for(let i=0; i< needRows.length; i++){
      detailData = await knex("docErd")
      .leftJoin('FL', 'docErd.flKey', 'FL.id')
      .leftJoin('docHeader', 'docErd.docKey', 'docHeader.id')
      .select(
      "FL.accNum as accNum", 
      "FL.organization as workOrganization", 
      "docHeader.organization as docOrganization",
      "docHeader.dateDocument as docDate",
      "docHeader.numberDocument as docNumber",
      "docErd.id as id",
      "docErd.dateIncome", 
      "docErd.beginPeriod", 
      "docErd.endPeriod",
      "docErd.dose")
      .where(needRows[i])
      
      .orderBy([
        {column: "beginPeriod", order: "asc"},
        {column: "endPeriod", order: "asc"}
      ])
      
    let k = 0;
    let resultObject = {}
    for(let j=0; j < detailData.length; j++){
        let period = detailData[j].endPeriod.getFullYear() - detailData[j].beginPeriod.getFullYear()
        resultObject["accNum"] = detailData[j]["accNum"]
        resultObject["workOrganization"] = detailData[j]["workOrganization"]
        resultObject["docOrganization"] = detailData[j]["docOrganization"]
        resultObject["docDate"] = detailData[j]["docDate"]
        resultObject["docNumber"] = detailData[j]["docNumber"]
        if (period === 1) {
          k++;
          resultObject[`erd${k}`] = detailData[j]["dose"]
        }else{
          resultObject[`erd${period}`] = detailData[j]["dose"]
        }
    }

    resultData.push(resultObject)
    }

    countData = {
      countRow: resultData.length,
      pages: Math.ceil(resultData.length/prpg),
      currentPage: pg
    }
    resultData.push(countData)
  return resultData
  }

//Получить данные по ОЭД, с постраничной пагинацией и параметрами
const getErdParam = async (page, perpage, accNum, workOrganization, dateIncome, erd,
   docOrganization, docDate, docNumber, sort) => {
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

/*
//параметры радионуклида
if (typeof radionuclide !== 'undefined'){
  queryObjectString['radionuclide'] = '%' + radionuclide + '%'
} else {
  queryObjectString['radionuclide'] = '%%'
}
*/
//параметры ОЭД
if (typeof dateIncome !== 'undefined'){
  queryObject['dateIncome'] = dateIncome
}
if (typeof erd !== 'undefined'){
  queryObject['dose'] = erd
}

  let resultData = []
  let detailData = []
  let countData = {}

  let needRows = await knex("docErd")
    .select("docErd.flKey", "docErd.docKey")
    .groupBy("docErd.flKey", "docErd.docKey")
    //.max("docErd.dateExam as dateExam")
    .andWhere(queryObject)
    .whereIn('docKey', function() {
      this.select('id').from('docHeader')
      .where(queryObjectDoc)
      .andWhereILike("organization", queryObjectString.docOrganization)
      .andWhereILike("numberDocument", queryObjectString.docNumber);
    })
    .whereIn('flKey', function() {
      this.select('id').from('FL')
      .whereILike("organization", queryObjectString.workOrganization)
      .andWhereILike("accNum", queryObjectString.accNum);
    })
    .limit(prpg)
    .offset((pg-1)*prpg)
    //console.log(needRows)

    for(let i=0; i< needRows.length; i++){
        
      detailData = await knex("docErd")
      .leftJoin('FL', 'docErd.flKey', 'FL.id')
      .leftJoin('docHeader', 'docErd.docKey', 'docHeader.id')
      .select(
      "FL.accNum as accNum", 
      "FL.organization as workOrganization", 
      "docHeader.organization as docOrganization",
      "docHeader.dateDocument as docDate",
      "docHeader.numberDocument as docNumber",
      "docErd.id as id",
      "docErd.dateIncome", 
      "docErd.beginPeriod", 
      "docErd.endPeriod",
      "docErd.dose")
      .where(needRows[i])
      //.andWhere(queryObject)

      .orderBy([
        {column: "beginPeriod", order: "asc"},
        {column: "endPeriod", order: "asc"}
      ])
      
    let k = 0;
    let resultObject = {}
    for(let j=0; j < detailData.length; j++){
        let period = detailData[j].endPeriod.getFullYear() - detailData[j].beginPeriod.getFullYear()
        resultObject["accNum"] = detailData[j]["accNum"]
        resultObject["workOrganization"] = detailData[j]["workOrganization"]
        resultObject["docOrganization"] = detailData[j]["docOrganization"]
        resultObject["docDate"] = detailData[j]["docDate"]
        resultObject["docNumber"] = detailData[j]["docNumber"]
        if (period === 1) {
          k++;
          resultObject[`erd${k}`] = detailData[j]["dose"]
        }else{
          resultObject[`erd${period}`] = detailData[j]["dose"]
        }
    }

    resultData.push(resultObject)
    
     // detailData.push(await knex("docErd")
      //)
    }
    countData = {
      countRow: resultData.length,
      pages: Math.ceil(resultData.length/prpg),
      currentPage: pg
    }
    resultData.push(countData)

    return resultData
}

module.exports.get = getErd;
module.exports.getByParam = getErdParam;
module.exports.getLast = getErdLast;
