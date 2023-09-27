const knex = require("../../knex_init");

//Методы работы с контрольными значениями
//Получить контрольных значений, с постраничной пагинацией
const getValue = async (page, perpage, sort) => {
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

  let resultData = await knex("limitValue")
  .select()
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)

  let countData = await knex("limitValue")
  .first()
  .count('id as countRow')

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)

  return resultData
}

//Получить контрольные значения, с постраничной пагинацией и параметрами
const getValueParam = async (page, perpage, radionuclide_id, indicator, value, gister, sort) => {
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
  if (typeof radionuclide_id !== 'undefined'){
    queryObject['radionuclide_id'] = radionuclide_id
  }
    if (typeof indicator !== 'undefined'){
      queryObjectString['indicator'] = "%"+indicator+"%"
  }else{
    queryObjectString['indicator'] = "%%"
  }
    if (typeof value !== 'undefined'){
    queryObject['value'] = value
  }
    if (typeof gister !== 'undefined'){
    queryObject['gister'] = gister
  }

  let resultData = await knex("limitValue")
  .select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .andWhereILike('indicator', queryObjectString.indicator)
  .limit(prpg).offset((pg-1)*prpg)

  let countData = await knex("limitValue")
  .where(queryObject)
  .andWhereILike('indicator', queryObjectString.indicator)
  .first()
  .count('id as countRow')

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  
  return resultData
}

//Показать предельное значение подробно
const getOneValue = async(valueId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("limitValue").first().where({ id: valueId })
}

//Создать предельное значение
const creatValue = async(radionuclide_id, indicator, value, gister, user) => {
  const newValue = {
    radionuclide_id: Number(radionuclide_id),
    value: Number(value),
    indicator: typeof indicator !== 'undefined' ? indicator : "",
    gister: typeof gister !== 'undefined' ? Number(gister) : 0,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("limitValue").insert([newValue], ["id"]);
   newValue['id'] = result[0].id
  return newValue;
}

// обновление контрольного значения
 const updateValue = async (valueId, radionuclide_id, indicator, value, gister, user) => {
    let updateObject = {}
    if (typeof radionuclide_id !== 'undefined'){
    updateObject['radionuclide_id'] = radionuclide_id
  }
  if (typeof indicator !== 'undefined'){
    updateObject['indicator'] = indicator
  }
    if (typeof value !== 'undefined'){
    updateObject['value'] = value
  }
    if (typeof gister !== 'undefined'){
    updateObject['gister'] = gister
  }
  updateObject['updatedAt'] = new Date()
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("limitValue")
    .where({ id: valueId })
    .update(updateObject);
 }

 //удаление значения
 const deleteValue = async (valueId) => {
  return knex("limitValue").where({ id: valueId }).del()
 }

module.exports.get = getValue;
module.exports.getByParam = getValueParam;
module.exports.getOne = getOneValue;
module.exports.create = creatValue;
module.exports.update = updateValue;
module.exports.delete = deleteValue;