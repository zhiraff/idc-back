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
  let resultData = await knex("docCtc").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить результаты Хелатотерапии, с постраничной пагинацией и параметрами
const getDocCtcParam = async (page, perpage, docKey, flKey, dateExam, typeControl, dateInput, radionuclideKey, material, consist, sort) => {
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

let queryObjectString = {}
if (typeof typeControl !== 'undefined'){
  queryObjectString['typeControl'] = '%' + typeControl + '%'
} else {
  queryObjectString['typeControl'] = '%%'
}
  if (typeof material !== 'undefined'){
    queryObjectString['material'] = '%' +  material + '%'
}else {
  queryObjectString['material'] = '%%'
}

let countData = await knex("docCtc")
.where(queryObject)
.andWhereILike("typeControl", queryObjectString.typeControl)
.andWhereILike("material", queryObjectString.material)
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("docCtc")
 .where(queryObject)
 .andWhereILike("typeControl", queryObjectString.typeControl)
 .andWhereILike("material", queryObjectString.material)
 .select()
 .orderBy(sortField, sortDirect)
 //.where(queryObject)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать результаты Хелатотерапии подробно
const getOneDocCtc = async(docCtcId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("docCtc").first().where({ id: docCtcId })
}

//Создать результаты Хелатотерапии
const creatDocCtc = async(docKey, flKey, dateExam, typeControl, dateInput, radionuclideKey, material, consist, user) => {
  const newDocCtc = {
    docKey: docKey,
    flKey: flKey,
    dateExam: dateExam,
    typeControl: typeControl,
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
 const updateDocCtc = async (docCtcId, docKey, flKey, dateExam, typeControl, dateInput, radionuclideKey, material, consist, user) => {
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
module.exports.update = updateDocCtc;
module.exports.delete = deleteDocCtc;
