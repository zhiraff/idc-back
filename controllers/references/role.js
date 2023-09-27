const knex = require("../../knex_init");
//Методы работы с ролями
//Получить роли, с постраничной пагинацией
const getRole = async (page, perpage, sort) => {
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
  let countData = await knex("roles").first().count('id as countRow')
  let resultData = await knex("roles").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить роли, с постраничной пагинацией и параметрами
const getRoleParam = async (page, perpage, name, name_plural, name_short, sort) => {
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
  if (typeof name !== 'undefined'){
    queryObjectString['name'] = '%' +  name + '%'
}else {
  queryObjectString['name'] = '%%'
}
if (typeof name_plural !== 'undefined'){
    queryObjectString['name_plural'] = '%' +  name_plural + '%'
}else {
  queryObjectString['name_plural'] = '%%'
}
if (typeof name_short !== 'undefined'){
    queryObjectString['name_short'] = '%' +  name_short + '%'
}else {
  queryObjectString['name_short'] = '%%'
}

let countData = await knex("roles")
.whereILike("name", queryObjectString.name)
.andWhereILike("name_plural", queryObjectString.name_plural)
.andWhereILike("name_short", queryObjectString.name_short)
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("roles")
 .whereILike("name", queryObjectString.name)
 .andWhereILike("name_plural", queryObjectString.name_plural)
 .andWhereILike("name_short", queryObjectString.name_short)
 .select()
 .orderBy(sortField, sortDirect)
 //.where(queryObject)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать роль подробно
const getOneRole = async(roleId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("roles").first().where({ id: roleId })
}

//Создать роль
const creatRole = async(name, name_plural, name_short, user) => {
  const newRole = {
    name: name,
    name_plural: name_plural,
    name_short: name_short,
    //createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    //updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("roles").insert([newRole], ["id"]);
   newRole['id'] = result[0].id
   return newRole;
}

// обновление роли
 const updateRole = async (roleId, name, name_plural, name_short, user) => {
    let updateObject = {}

  if (typeof name !== 'undefined'){
    updateObject['name'] = name
  }
  if (typeof name_plural !== 'undefined'){
    updateObject['name_plural'] = name_plural
  }
  if (typeof name_short !== 'undefined'){
    updateObject['name_short'] = name_short
  }
  updateObject['updatedAt'] = new Date()
   /*
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
  */
   return knex("roles")
    .where({ id: roleId })
    .update(updateObject);
 }

 //удаление роли
 const deleteRole = async (roleId) => {
  return knex("roles").where({ id: roleId }).del()
 }


module.exports.get = getRole;
module.exports.getByParam = getRoleParam;
module.exports.getOne = getOneRole;
module.exports.create = creatRole;
module.exports.update = updateRole;
module.exports.delete = deleteRole;
