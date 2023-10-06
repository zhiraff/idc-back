const knex = require("../../knex_init");
//Методы работы с правами доступа
//Получить права доступа, с постраничной пагинацией
const getPermission = async (page, perpage, sort) => {
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
  let countData = await knex("permission").first().count('id as countRow')
  let resultData = await knex("permission").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  //console.log(`count: ${count}`)
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить права доступа, с постраничной пагинацией и параметрами
const getPermissionParam = async (page, perpage, name, codeName, tableName, sort) => {
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

let queryObjectString = {}
  if (typeof name !== 'undefined'){
    queryObjectString['name'] = '%' +  name + '%'
}else {
  queryObjectString['name'] = '%%'
}
if (typeof codeName !== 'undefined'){
    queryObjectString['codeName'] = '%' +  codeName + '%'
}else {
  queryObjectString['codeName'] = '%%'
}
if (typeof tableName !== 'undefined'){
    queryObjectString['tableName'] = '%' +  tableName + '%'
}else {
  queryObjectString['tableName'] = '%%'
}

let countData = await knex("permission")
.whereILike("name", queryObjectString.name)
.andWhereILike("codeName", queryObjectString.codeName)
.andWhereILike("tableName", queryObjectString.tableName)
.first()
.count('id as countRow')

countData['pages'] = Math.ceil(countData.countRow/prpg)
countData['currentPage'] = pg

 let resultData = await knex("permission")
 .whereILike("name", queryObjectString.name)
 .andWhereILike("codeName", queryObjectString.codeName)
 .andWhereILike("tableName", queryObjectString.tableName)
 .select()
 .orderBy(sortField, sortDirect)
 .limit(prpg).offset((pg-1)*prpg)
  resultData.push(countData)
  return resultData
}

//Показать право доступа подробно
const getOnePermission = async(permissionId) => {
  return knex("permission").first().where({ id: permissionId })
}

//Создать право доступа
const creatPermission = async(name, codeName, tableName, user) => {
  const newPermission = {
    codeName: codeName,
    name: name,
    tableName: tableName,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("permission").insert([newPermission], ["id"]);
   newPermission['id'] = result[0].id
   return newPermission;
}

// обновление право доступа
 const updatePermission = async (permissionId, name, codeName, tableName, user) => {
    let updateObject = {}
    if (typeof codeName !== 'undefined'){
    updateObject['codeName'] = codeName
  }
  if (typeof name !== 'undefined'){
    updateObject['name'] = name
  }
  if (typeof natableNameme !== 'undefined'){
    updateObject['tableName'] = tableName
  }

  updateObject['updatedAt'] = new Date()
  
   
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("permission")
    .where({ id: permissionId })
    .update(updateObject);
 }

 //удаление право доступа
 const deletePermission = async (permissionId) => {
  return knex("permission").where({ id: permissionId }).del()
 }

module.exports.get = getPermission;
module.exports.getByParam = getPermissionParam;
module.exports.getOne = getOnePermission;
module.exports.create = creatPermission;
module.exports.update = updatePermission;
module.exports.delete = deletePermission;
