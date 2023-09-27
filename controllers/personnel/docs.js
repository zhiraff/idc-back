const knex = require("../../knex_init");
//Поулчить весь персонал (и на контр и не на контр)
const getDocs = async (page, perpage, sort) => {
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
  let resultData = await knex("fl_docs").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  let countData = await knex("fl_docs")
  .first()
  .count('id as countRow')
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
 
}

//Получить персонал, с постраничной пагинацией и параметрами
const getDocsParam = async (page, perpage, flKey, name, serial, number, dateIssue, whoIssue, podrIssue, active, sort) => {
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
    if (typeof name !== 'undefined'){
      queryObjectString['name'] = "%"+name+"%"
  }else{
    queryObjectString['name'] = "%%"
  }
      if (typeof serial !== 'undefined'){
        queryObjectString['serial'] = "%"+serial+"%"
  }else{
    queryObjectString['serial'] = "%%"
  }
      if (typeof number !== 'undefined'){
        queryObjectString['number'] = "%"+number+"%"
  }else{
    queryObjectString['number'] = "%%"
  }
      if (typeof dateIssue !== 'undefined'){
    queryObject['dateIssue'] = dateIssue
  }
      if (typeof whoIssue !== 'undefined'){
        queryObjectString['whoIssue'] = "%"+whoIssue+"%"
  }else{
    queryObjectString['whoIssue'] = "%%"
  }
      if (typeof podrIssue !== 'undefined'){
        queryObjectString['podrIssue'] = "%"+podrIssue+"%"
  }else{
    queryObjectString['podrIssue'] = "%%"
  }
      if (typeof active !== 'undefined'){
    queryObject['active'] = active
  }

  let resultData = await knex("fl_docs").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .andWhereILike("name", queryObjectString.name)
  .andWhereILike("serial", queryObjectString.serial)
  .andWhereILike("number", queryObjectString.number)
  .andWhereILike("whoIssue", queryObjectString.whoIssue)
  .andWhereILike("podrIssue", queryObjectString.podrIssue)
  .limit(prpg).offset((pg-1)*prpg)

  let countData = await knex("fl_docs")
  .where(queryObject)
  .andWhereILike("name", queryObjectString.name)
  .andWhereILike("serial", queryObjectString.serial)
  .andWhereILike("number", queryObjectString.number)
  .andWhereILike("whoIssue", queryObjectString.whoIssue)
  .andWhereILike("podrIssue", queryObjectString.podrIssue)
  .first()
  .count('id as countRow')
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Показать персонал подробно
const getOneDocs = async(docsId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("fl_docs").first().where({ id: docsId })
}

const createDocs = async (flKey, name, serial, number, dateIssue, whoIssue, podrIssue, active, user) => {
    createObject = {
        flKey: flKey,
        name: name,
        number: number,
        serial: serial,
        dateIssue: dateIssue,
        whoIssue: whoIssue,
        podrIssue: podrIssue,

        createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
        updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    }
    if (typeof active !== 'undefined'){
        createObject['active'] = active
    }
    
    const result = await knex("fl_docs").insert([createObject], ["id"]);
    createObject['id'] = result[0].id
    return createObject;
}

// обновление записи документы у физ.лица
 const updateDocs = async (docsId, name, serial, number, dateIssue, whoIssue, podrIssue, active, user) => {
    let updateObject = {}
    if (typeof name !== 'undefined'){
    updateObject['name'] = name
  }
  if (typeof serial !== 'undefined'){
    updateObject['serial'] = serial
  }
  if (typeof number !== 'undefined'){
    updateObject['number'] = number
  }
  if (typeof dateIssue !== 'undefined'){
    updateObject['dateIssue'] = dateIssue
  }
  if (typeof whoIssue !== 'undefined'){
    updateObject['whoIssue'] = whoIssue
  }
    if (typeof podrIssue !== 'undefined'){
    updateObject['podrIssue'] = podrIssue
  }
    if (typeof active !== 'undefined'){
    updateObject['active'] = active
  }
  updateObject['updatedAt'] = new Date()
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("fl_docs")
    .where({ id: docsId })
    .update(updateObject);
 }

 //удаление записи документы у физ.лица
 const deleteDocs = async (docsId) => {
  return knex("fl_docs").where({ id: docsId }).del()
 }

module.exports.get = getDocs;
module.exports.getByParam = getDocsParam;
module.exports.getOne = getOneDocs;
module.exports.create = createDocs;
module.exports.update = updateDocs;
module.exports.delete = deleteDocs;