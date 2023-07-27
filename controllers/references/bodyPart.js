const knex = require("../../knex_init");
//Методы работы с частями тела
//Получить части тела, с постраничной пагинацией
const getBodypart = async (page, perpage, sort) => {
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
  return knex("bodyPart").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
}

//Получить части тела, с постраничной пагинацией и параметрами
const getBodypartParam = async (page, perpage, type, name, sort) => {
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
    if (typeof name !== 'undefined'){
    queryObject['name'] = name
  }

  return knex("bodyPart").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .limit(prpg).offset((pg-1)*prpg)
}

//Показать часть тела подробно
const getOneBodypart = async(bodypartId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("bodyPart").first().where({ id: bodypartId })
}

//Создать часть тела
const creatBodypart = async(type, name, user) => {
  const newBodypart = {
    type: type,
    name: name,
    createdBy: typeof user !== 'undefined' ? user : "unknown",
    updatedBy: typeof user !== 'undefined' ? user : "unknown",
  };
  await knex("bodyPart").insert([newBodypart]);
  return newBodypart;
}

// обновление части тела
 const updateBodypart = async (bodypartId, type, name, user) => {
    let updateObject = {}
    if (typeof type !== 'undefined'){
    updateObject['type'] = type
  }
  if (typeof name !== 'undefined'){
    updateObject['name'] = name
  }
   
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("bodyPart")
    .where({ id: bodypartId })
    .update(updateObject);
 }

 //удаление части тела
 const deleteBodypart = async (bodypartId) => {
  return knex("bodyPart").where({ id: bodypartId }).del()
 }

  //тест
  /*
 const test = async (name) => {
  console.log(`hello ${name}`)
  return 1+1+1
 }
*/
module.exports.get = getBodypart;
module.exports.getByParam = getBodypartParam;
module.exports.getOne = getOneBodypart;
module.exports.create = creatBodypart;
module.exports.update = updateBodypart;
module.exports.delete = deleteBodypart;
