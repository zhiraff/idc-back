const knex = require("../../knex_init");
//Методы работы с назначением прав ролям
//Получить назначение прав для ролей, с постраничной пагинацией
const getRoleAssignPermission = async (page, perpage, sort) => {
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
  let countData = await knex("roleAssignPermission").first().count('id as countRow')
  let resultData = await knex("roleAssignPermission").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить назначение прав для ролей, с постраничной пагинацией и параметрами
const getRoleAssignPermissionParam = async (page, perpage, roleKey, permKey, sort) => {
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
  if (typeof roleKey !== 'undefined'){
    queryObject['roleKey'] = roleKey
  }
    if (typeof permKey !== 'undefined'){
    queryObject['permKey'] = permKey
  }

let countData = await knex("roleAssignPermission")
.where(queryObject)
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("roleAssignPermission")
 .where(queryObject)
 .select()
 .orderBy(sortField, sortDirect)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать назначение права для ролей подробно
const getOneRoleAssignPermission = async(RoleAssignPermissionId) => {
  return knex("roleAssignPermission").first().where({ id: RoleAssignPermissionId })
}

//Создать ( назначить ) право для роли
const creatRoleAssignPermission = async(roleKey, permKey, user) => {
  const newRoleAssignPermission = {
    roleKey: roleKey,
    permKey: permKey,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("roleAssignPermission").insert([newRoleAssignPermission], ["id"]);
   newRoleAssignPermission['id'] = result[0].id
   return newRoleAssignPermission;
}

// обновление назначеного права для роли
 const updateRoleAssignPermission = async (RoleAssignPermissionId, roleKey, permKey, user) => {
    let updateObject = {}
    if (typeof roleKey !== 'undefined'){
    updateObject['roleKey'] = roleKey
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
   return knex("roleAssignPermission")
    .where({ id: RoleAssignPermissionId })
    .update(updateObject);
 }

 //удаление назначеного права для роли
 const deleteRoleAssignPermission = async (RoleAssignPermissionId) => {
  return knex("roleAssignPermission").where({ id: RoleAssignPermissionId }).del()
 }

module.exports.get = getRoleAssignPermission;
module.exports.getByParam = getRoleAssignPermissionParam;
module.exports.getOne = getOneRoleAssignPermission;
module.exports.create = creatRoleAssignPermission;
module.exports.update = updateRoleAssignPermission;
module.exports.delete = deleteRoleAssignPermission;
