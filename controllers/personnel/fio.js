const knex = require("../../knex_init");

//Поулчить все записи о смене фио
const getFio = async (page, perpage, sort) => {
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
  let resultData = await knex("fl_ch_fio").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  let countData = await knex("fl_ch_fio")
  .first()
  .count('id as countRow')
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить персонал, с постраничной пагинацией и параметрами
const getFioParam = async (page, perpage, flKey, firstName, secondName, thirdName, date, comment, sort) => {
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
  if (typeof flKey !== 'undefined'){
    queryObject['flKey'] = flKey
  }
    if (typeof firstName !== 'undefined'){
      queryObjectString['firstName'] = "%"+firstName+"%"
  }else{
    queryObjectString['firstName'] = "%%"
  }
      if (typeof secondName !== 'undefined'){
        queryObjectString['secondName'] = "%"+secondName+"%"
  }else{
    queryObjectString['secondName'] = "%%"
  }
      if (typeof thirdName !== 'undefined'){
        queryObjectString['thirdName'] = "%"+thirdName+"%"
  }else{
    queryObjectString['thirdName'] = "%%"
  }
      if (typeof date !== 'undefined'){
    queryObject['date'] = date
  }
      if (typeof comment !== 'undefined'){
        queryObjectString['comment'] = "%"+comment+"%"
  }else{
    queryObjectString['comment'] = "%%"
  }

  let resultData = await knex("fl_ch_fio").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  //.andWhereILike("firstName", queryObjectString.firstName)
  .andWhere(qb => {
    if (queryObjectString.firstName === "%%"){
     return qb.whereILike("firstName", queryObjectString.firstName).orWhereNull("firstName")
    }else{
     return qb.whereILike("firstName", queryObjectString.firstName)
    }
 })
  //.andWhereILike("secondName", queryObjectString.secondName)
  .andWhere(qb => {
    if (queryObjectString.secondName === "%%"){
     return qb.whereILike("secondName", queryObjectString.secondName).orWhereNull("secondName")
    }else{
     return qb.whereILike("secondName", queryObjectString.secondName)
    }
 })

  //.andWhereILike("thirdName", queryObjectString.thirdName)
  .andWhere(qb => {
    if (queryObjectString.thirdName === "%%"){
     return qb.whereILike("thirdName", queryObjectString.thirdName).orWhereNull("thirdName")
    }else{
     return qb.whereILike("thirdName", queryObjectString.thirdName)
    }
  })
  //.andWhereILike("comment", queryObjectString.comment)
  .andWhere(qb => {
    if (queryObjectString.comment === "%%"){
     return qb.whereILike("comment", queryObjectString.comment).orWhereNull("comment")
    }else{
     return qb.whereILike("comment", queryObjectString.comment)
    }
  })
  .limit(prpg).offset((pg-1)*prpg)

  let countData = await knex("fl_ch_fio")
  .where(queryObject)
  //.andWhereILike("firstName", queryObjectString.firstName)
  .andWhere(qb => {
    if (queryObjectString.firstName === "%%"){
     return qb.whereILike("firstName", queryObjectString.firstName).orWhereNull("firstName")
    }else{
     return qb.whereILike("firstName", queryObjectString.firstName)
    }
 })
  //.andWhereILike("secondName", queryObjectString.secondName)
  .andWhere(qb => {
    if (queryObjectString.secondName === "%%"){
     return qb.whereILike("secondName", queryObjectString.secondName).orWhereNull("secondName")
    }else{
     return qb.whereILike("secondName", queryObjectString.secondName)
    }
 })
  //.andWhereILike("thirdName", queryObjectString.thirdName)
  .andWhere(qb => {
    if (queryObjectString.thirdName === "%%"){
     return qb.whereILike("thirdName", queryObjectString.thirdName).orWhereNull("thirdName")
    }else{
     return qb.whereILike("thirdName", queryObjectString.thirdName)
    }
  })
  //.andWhereILike("comment", queryObjectString.comment)
  .andWhere(qb => {
    if (queryObjectString.comment === "%%"){
     return qb.whereILike("comment", queryObjectString.comment).orWhereNull("comment")
    }else{
     return qb.whereILike("comment", queryObjectString.comment)
    }
  })
  .first()
  .count('id as countRow')
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
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
        createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
        updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
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
  updateObject['updatedAt'] = new Date()
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
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