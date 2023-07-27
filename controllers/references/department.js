//require("dotenv").config();
const knex = require("../../knex_init");

//Методы работы с подразделениями
//Получить подразделения, с постраничной пагинацией
const getDepartment = async (page, perpage, sort) => {
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
  return knex("department").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
}

//Получить подразделения, с постраничной пагинацией и параметрами
const getDepartmentParam = async (page, perpage, parent_id, begin, end, code, name, department_item_id, full_name, address, sort) => {
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
  let queryObject = {}
  if (typeof parent_id !== 'undefined'){
    queryObject['parent_id'] = parent_id
  }
    if (typeof begin !== 'undefined'){
    queryObject['begin'] = begin
  }
      if (typeof end !== 'undefined'){
    queryObject['end'] = end
  }
        if (typeof code !== 'undefined'){
    queryObject['code'] = code
  }
        if (typeof name !== 'undefined'){
    queryObject['name'] = name
  }
        if (typeof department_item_id !== 'undefined'){
    queryObject['department_item_id'] = department_item_id
  }
        if (typeof full_name !== 'undefined'){
    queryObject['full_name'] = full_name
  }
        if (typeof address !== 'undefined'){
    queryObject['address'] = address
  }

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
  //console.log(queryObject)

  return knex("department").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  //.andWhereILike('code', '%%')
  .limit(prpg).offset((pg-1)*prpg)
}

//Показать подразделения подробно
const getOneDepartment = async(departmentId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("department").first().where({ id: departmentId })
}

//Создать подразделения
const creatDepartment = async(parent_id, begin, end, code, name, department_item_id, full_name, address, user) => {
  let newDepartment = {
    begin: begin,
    code: code,
    name: name,
    createdBy: typeof user !== 'undefined' ? user : "unknown",
    updatedBy: typeof user !== 'undefined' ? user : "unknown",
  };
    if (typeof parent_id !== 'undefined'){
    newDepartment['parent_id'] = parent_id
  }
      if (typeof end !== 'undefined'){
    newDepartment['end'] = end
  }
      if (typeof department_item_id !== 'undefined'){
    newDepartment['department_item_id'] = department_item_id
  }
      if (typeof full_name !== 'undefined'){
    newDepartment['full_name'] = full_name
  }
      if (typeof address !== 'undefined'){
    newDepartment['address'] = address
  }
  await knex("department").insert([newDepartment]);
  return newDepartment;
}

// обновление подразделения
 const updateDepartment = async (departmentId, parent_id, begin, end, code, name, department_item_id, full_name, address, user) => {
    let updateObject = {}
    if (typeof parent_id !== 'undefined'){
    updateObject['parent_id'] = parent_id
  }
  if (typeof begin !== 'undefined'){
    updateObject['begin'] = begin
  }
    if (typeof end !== 'undefined'){
    updateObject['end'] = end
  }
      if (typeof code !== 'undefined'){
    updateObject['code'] = code
  }
      if (typeof name !== 'undefined'){
    updateObject['name'] = name
  }
      if (typeof department_item_id !== 'undefined'){
    updateObject['department_item_id'] = department_item_id
  }
      if (typeof full_name !== 'undefined'){
    updateObject['full_name'] = full_name
  }
      if (typeof address !== 'undefined'){
    updateObject['address'] = address
  }
   
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
  //console.log(user)
   return knex("department")
    .where({ id: departmentId })
    .update(updateObject);
 }

 //удаление подразделения
 const deleteDepartment = async (departmentId) => {
  return knex("department").where({ id: departmentId }).del()
 }

 module.exports.get = getDepartment;
module.exports.getByParam = getDepartmentParam;
module.exports.getOne = getOneDepartment;
module.exports.create = creatDepartment;
module.exports.update = updateDepartment;
module.exports.delete = deleteDepartment;