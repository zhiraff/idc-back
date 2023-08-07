const knex = require("../../knex_init");

//Поулчить все записи о смене фио
const getFio = (page, perpage, sort) => {
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
  return knex("fl_ch_fio").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
}

//Получить персонал, с постраничной пагинацией и параметрами
const getFioParam = async (page, perpage, flKey, firstName, secondName, thirdName, date, comment, sort) => {
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
  if (typeof flKey !== 'undefined'){
    queryObject['flKey'] = flKey
  }
    if (typeof firstName !== 'undefined'){
    queryObject['firstName'] = firstName
  }
      if (typeof secondName !== 'undefined'){
    queryObject['secondName'] = secondName
  }
      if (typeof thirdName !== 'undefined'){
    queryObject['thirdName'] = thirdName
  }
      if (typeof date !== 'undefined'){
    queryObject['date'] = date
  }
      if (typeof comment !== 'undefined'){
    queryObject['comment'] = comment
  }

  return knex("fl_ch_fio").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .limit(prpg).offset((pg-1)*prpg)
}

//Показать персонал подробно
const getOneFio = async(fioId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("fl_ch_fio").first().where({ id: fioId })
}

const createFio = async (flKey, firstName, secondName, thirdName, date, comment, user) => {
    createObject = {
        flKey: flKey,
        date: date,
        createdBy: typeof user !== 'undefined' ? user : "unknown",
        updatedBy: typeof user !== 'undefined' ? user : "unknown",
    }
    if (typeof firstName !== 'undefined'){
        createObject['firstName'] = firstName
    }
    if (typeof secondName !== 'undefined'){
        createObject['secondName'] = secondName
    }
    if (typeof thirdName !== 'undefined'){
        createObject['thirdName'] = thirdName
    }
    if (typeof comment !== 'undefined'){
        createObject['comment'] = comment
    }
    
    const result = await knex("fl_ch_fio").insert([createObject], ["id"]);
    createObject['id'] = result[0].id
    return createObject;
}


// обновление записи об изменении фио физ.лица
 const updateFio = async (fioId, firstName, secondName, thirdName, date, comment, user) => {
    let updateObject = {}
    if (typeof firstName !== 'undefined'){
    updateObject['firstName'] = firstName
  }
  if (typeof secondName !== 'undefined'){
    updateObject['secondName'] = secondName
  }
  if (typeof thirdName !== 'undefined'){
    updateObject['thirdName'] = thirdName
  }
  if (typeof date !== 'undefined'){
    updateObject['date'] = date
  }
  if (typeof comment !== 'undefined'){
    updateObject['comment'] = comment
  }
   
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("fl_ch_fio")
    .where({ id: fioId })
    .update(updateObject);
 }

 //удаление записи 
 const deleteFio = async (fioId) => {
  return knex("fl_ch_fio").where({ id: fioId }).del()
 }

module.exports.get = getFio;
module.exports.getByParam = getFioParam;
module.exports.getOne = getOneFio;
module.exports.create = createFio;
module.exports.update = updateFio;
module.exports.delete = deleteFio;