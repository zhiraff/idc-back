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
  return knex("kindIdc").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
}

//Получить виды ИДК, с постраничной пагинацией и параметрами
const getKindidcParam = async (type, kind, kindShort, sort) => {
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
  if (typeof type !== 'undefined'){
    queryObject['type'] = type
  }
    if (typeof kind !== 'undefined'){
    queryObject['kind'] = kind
  }
      if (typeof kindShort !== 'undefined'){
    queryObject['kindShort'] = kindShort
  }

  return knex("kindIdc").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .limit(prpg).offset((pg-1)*prpg)
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
    createdBy: typeof user !== 'undefined' ? user : "unknown",
    updatedBy: typeof user !== 'undefined' ? user : "unknown",
  };
  await knex("kindIdc").insert([newKindidc]);
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
   
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
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