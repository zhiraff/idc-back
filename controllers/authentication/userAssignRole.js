const knex = require("../../knex_init");
//Методы работы с назначением ролей пользователям
//Получить назначение ролей для пользователей, с постраничной пагинацией
const getUserAssignRole = async (page, perpage, sort) => {
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
  let countData = await knex("userAssignRole").first().count('id as countRow')
  let resultData = await knex("userAssignRole")
  .leftJoin("roles", "userAssignRole.roleKey", "roles.id")
  .leftJoin("users", "userAssignRole.userKey", "users.id")
  .select("roles.name as roleName",
   "roles.name_short as roleCode",
   "users.username as username",
   "userAssignRole.*")
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)
  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить назначение ролей для пользователей, с постраничной пагинацией и параметрами
const getUserAssignRoleParam = async (page, perpage, userKey, roleKey, sort) => {
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
  if (typeof userKey !== 'undefined'){
    queryObject['userKey'] = userKey
  }
    if (typeof roleKey !== 'undefined'){
    queryObject['roleKey'] = roleKey
  }

let countData = await knex("userAssignRole")
.where(queryObject)
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("userAssignRole")
 .leftJoin("roles", "userAssignRole.roleKey", "roles.id")
  .leftJoin("users", "userAssignRole.userKey", "users.id")
  .select("roles.name as roleName",
   "roles.name_short as roleCode",
   "users.username as username",
   "userAssignRole.*")
 .where(queryObject)
 //.select()
 .orderBy(sortField, sortDirect)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать назначение роли для пользователя подробно
const getOneUserAssignRole = async(userAssignRoleId) => {
  return knex("userAssignRole")
  .leftJoin("roles", "userAssignRole.roleKey", "roles.id")
  .leftJoin("users", "userAssignRole.userKey", "users.id")
  .first("roles.name as roleName",
   "roles.name_short as roleCode",
   "users.username as username",
   "userAssignRole.*")
  //.first()
  .where({ "userAssignRole.id": userAssignRoleId })
}

//Создать ( назначить ) роль для пользователя
const creatUserAssignRole = async(userKey, roleKey, user) => {
  const newUserAssignRole = {
    userKey: userKey,
    roleKey: roleKey,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("userAssignRole").insert([newUserAssignRole], ["id"]);
   newUserAssignRole['id'] = result[0].id
   return newUserAssignRole;
}

// обновление назначеной роли для пользователя
 const updateUserAssignRole = async (userAssignRoleId, userKey, roleKey, user) => {
    let updateObject = {}
    if (typeof userKey !== 'undefined'){
    updateObject['userKey'] = userKey
  }
  if (typeof roleKey !== 'undefined'){
    updateObject['roleKey'] = roleKey
  }

  updateObject['updatedAt'] = new Date()
  
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("userAssignRole")
    .where({ id: userAssignRoleId })
    .update(updateObject);
 }

 //удаление назначеной роли для пользователя
 const deleteUserAssignRole = async (userAssignRoleId) => {
  return knex("userAssignRole").where({ id: userAssignRoleId }).del()
 }

module.exports.get = getUserAssignRole;
module.exports.getByParam = getUserAssignRoleParam;
module.exports.getOne = getOneUserAssignRole;
module.exports.create = creatUserAssignRole;
module.exports.update = updateUserAssignRole;
module.exports.delete = deleteUserAssignRole;