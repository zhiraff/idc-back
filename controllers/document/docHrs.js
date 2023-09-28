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
  let resultData = await knex("docHrs").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить результаты СИЧ, с постраничной пагинацией и параметрами
const getDocHrsParam = async (page, perpage, docKey, flKey, dateExam, typeControl, bodyPartKey, radionuclideKey,  consist, sort) => {
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

let queryObjectString = {}
if (typeof typeControl !== 'undefined'){
  queryObjectString['typeControl'] = '%' + typeControl + '%'
} else {
  queryObjectString['typeControl'] = '%%'
}


let countData = await knex("docHrs")
.where(queryObject)
.andWhereILike("typeControl", queryObjectString.typeControl)
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("docHrs")
 .where(queryObject)
 .andWhereILike("typeControl", queryObjectString.typeControl)
 .select()
 .orderBy(sortField, sortDirect)
 //.where(queryObject)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать результаты СИЧ подробно
const getOneDocHrs = async(docHrsId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("docHrs").first().where({ id: docHrsId })
}

//Создать результаты СИЧ
const creatDocHrs = async(docKey, flKey, dateExam, typeControl, bodyPartKey, radionuclideKey,  consist, user) => {
  const newDocHrs = {
    docKey: docKey,
    flKey: flKey,
    dateExam: dateExam,
    typeControl: typeControl,
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
 const updateDocHrs = async (docHrsId, docKey, flKey, dateExam, typeControl, bodyPartKey, radionuclideKey,  consist, user) => {
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
  if (typeof typeControl !== 'undefined'){
    updateObject['typeControl'] = typeControl
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

  //тест
  /*
 const test = async (name) => {
  console.log(`hello ${name}`)
  return 1+1+1
 }
*/
module.exports.get = getDocHrs;
module.exports.getByParam = getDocHrsParam;
module.exports.getOne = getOneDocHrs;
module.exports.create = creatDocHrs;
module.exports.update = updateDocHrs;
module.exports.delete = deleteDocHrs;
