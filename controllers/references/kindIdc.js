const knex = require("../../knex_init");

//Методы работы с видами ИДК
//Получить виды ИДК, с постраничной пагинацией
const getKindidc = async (page, perpage, sort) => {
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
  let resultData = await knex("kindIdc")
  .select()
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)

  let countData = await knex("kindIdc")
  .first()
  .count('id as countRow')

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)

  return resultData
}

//Получить виды ИДК, с постраничной пагинацией и параметрами
const getKindidcParam = async (page, perpage, type, kind, kindShort, sort) => {
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
  let queryObjectString = {}
  if (typeof type !== 'undefined'){
    queryObjectString['type'] = '%'+type+'%'
  } else {
    queryObjectString['type'] = '%%'
  }
    if (typeof kind !== 'undefined'){
      queryObjectString['kind'] = '%'+kind+'%'
  } else {
    queryObjectString['kind'] = '%%'
  }
      if (typeof kindShort !== 'undefined'){
        queryObjectString['kindShort'] = '%'+kindShort+'%'
  } else {
    queryObjectString['kindShort'] = '%%'

  }
 //console.log(`sotrfield: ${sortField} \n sortdirect: ${sortDirect} \n sort: ${sort}`)
  let resultData = await knex("kindIdc")
  .select()
  .whereILike('type', queryObjectString.type)
  .andWhereILike('kind', queryObjectString.kind)
  .andWhereILike('kindShort', queryObjectString.kindShort)
  .orderBy(sortField, sortDirect)
  .limit(prpg).offset((pg-1)*prpg)

  let countData = await knex("kindIdc")
  .whereILike('type', queryObjectString.type)
  .andWhereILike('kind', queryObjectString.kind)
  .andWhereILike('kindShort', queryObjectString.kindShort)
  .first()
  .count('id as countRow')

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Показать виды ИДК подробно
const getOneKindidc = async(kindidcId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("kindIdc").first().where({ id: kindidcId })
}

//Создать виды ИДК
const creatKindidc = async(type, kind, kindShort) => {
  const newKindidc = {
    type: type,
    kind: kind,
    kindShort: kindShort,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("kindIdc").insert([newKindidc], ["id"]);
   newKindidc['id'] = result[0].id
  return newKindidc;
}

// обновление виды ИДК
 const updateKindidc = async (kindidcId, type, kind, kindShort, user) => {
    let updateObject = {}
    if (typeof type !== 'undefined'){
    updateObject['type'] = type
  }
  if (typeof kind !== 'undefined'){
    updateObject['kind'] = kind
  }
    if (typeof kindShort !== 'undefined'){
    updateObject['kindShort'] = kindShort
  }
  updateObject['updatedAt'] = new Date()
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("kindIdc")
    .where({ id: kindidcId })
    .update(updateObject);
 }

 //удаление виды ИДК
 const deleteKindidc = async (kindidcId) => {
  return knex("kindIdc").where({ id: kindidcId }).del()
 }

module.exports.get = getKindidc;
module.exports.getByParam = getKindidcParam;
module.exports.getOne = getOneKindidc;
module.exports.create = creatKindidc;
module.exports.update = updateKindidc;
module.exports.delete = deleteKindidc;