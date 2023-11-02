const knex = require("../../knex_init");
//Методы работы с назначением прав пользователям
//Получить назначение прав для пользователей, с постраничной пагинацией
const getUserAssignPermission = async (page, perpage, sort) => {
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
  let countData = await knex("userAssignPermission").first().count('id as countRow')
  let resultData = await knex("userAssignPermission")
  .leftJoin("permission", "userAssignPermission.permKey", "permission.id")
  .leftJoin("users", "userAssignPermission.userKey", "users.id")
  .select("permission.name as permName",
   "permission.codeName as permCode",
   "users.username as username",
   "userAssignPermission.*")
  //.select()
  .orderBy(sortField, sortDirect)
  .limit(prpg)
  .offset((pg-1)*prpg)
  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить назначение прав для пользователей, с постраничной пагинацией и параметрами
const getUserAssignPermissionParam = async (page, perpage, userKey, permKey, sort) => {
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
    if (typeof permKey !== 'undefined'){
    queryObject['permKey'] = permKey
  }

let countData = await knex("userAssignPermission")
.where(queryObject)
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("userAssignPermission")
 .leftJoin("permission", "userAssignPermission.permKey", "permission.id")
  .leftJoin("users", "userAssignPermission.userKey", "users.id")
  .select("permission.name as permName",
   "permission.codeName as permCode",
   "users.username as username",
   "userAssignPermission.*")
 .where(queryObject)
 //.select()
 .orderBy(sortField, sortDirect)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать назначение права для пользователя подробно
const getOneUserAssignPermission = async(userAssignPermissionId) => {
  return knex("userAssignPermission")
  .leftJoin("permission", "userAssignPermission.permKey", "permission.id")
  .leftJoin("users", "userAssignPermission.userKey", "users.id")
  .first("permission.name as permName",
   "permission.codeName as permCode",
   "users.username as username",
   "userAssignPermission.*")
  //.first()
  .where({ "userAssignPermission.id": userAssignPermissionId })
}

//Создать ( назначить ) право для пользователя
const creatUserAssignPermission = async(userKey, permKey, user) => {
  const newUserAssignPermission = {
    userKey: userKey,
    permKey: permKey,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("userAssignPermission").insert([newUserAssignPermission], ["id"]);
   newUserAssignPermission['id'] = result[0].id
   return newUserAssignPermission;
}

// обновление назначеного права для пользователя
 const updateUserAssignPermission = async (userAssignPermissionId, userKey, permKey, user) => {
    let updateObject = {}
    if (typeof userKey !== 'undefined'){
    updateObject['userKey'] = userKey
  }
  if (typeof permKey !== 'undefined'){
    updateObject['permKey'] = permKey
  }

  updateObject['updatedAt'] = new Date()
  
   
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("userAssignPermission")
    .where({ id: userAssignPermissionId })
    .update(updateObject);
 }

 //удаление назначеного права для пользователя
 const deleteUserAssignPermission = async (userAssignPermissionId) => {
  return knex("userAssignPermission").where({ id: userAssignPermissionId }).del()
 }

module.exports.get = getUserAssignPermission;
module.exports.getByParam = getUserAssignPermissionParam;
module.exports.getOne = getOneUserAssignPermission;
module.exports.create = creatUserAssignPermission;
module.exports.update = updateUserAssignPermission;
module.exports.delete = deleteUserAssignPermission;