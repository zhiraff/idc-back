//require("dotenv").config();
const knex = require("../../knex_init");
//const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
const { options } = require("../../date_init");
const separ = ' / ' //  Разделитель в строке предков

//Ф-я возвращает строку с названиями родителей
const getAllNamesOfParents = async (id) => {
  let ret = ""
  const item = await knex("department").first().where({'id': id})

  if (typeof item.parent_id === "undefined" || item.parent_id === null){
    //Базовый случай
    return item.name
  }

  const par = await knex("department").first().where({'id': item.parent_id})
  ret = item.name + separ + await getAllNamesOfParents(par.id)
  return ret
} 

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
  let resultData = await knex("department").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  
  for (let i = 0;i < resultData.length; i++){
    resultData[i].begin = resultData[i].begin.toLocaleDateString('ru-RU', options);
    if (resultData[i].end !== null){
      resultData[i].end = resultData[i].end.toLocaleDateString('ru-RU', options);
    }
  }
  let countData = await knex("department")
  .first()
  .count('id as countRow')

  for (let i = 0; i < resultData.length; i++){
      let parentsString = await getAllNamesOfParents(resultData[i].id)
      let parentsArray = parentsString.split(separ)
      parentsArray.pop()  //  Удалим ГХК
      parentsArray.pop()  // Удалим ГХК (ШТАТ)
      parentsArray.reverse()  // развернули
      parentsArray.pop()  // Удалим сам этот объект
      resultData[i]["parent_tree"] = parentsArray.join(separ)
  }

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить подразделения, с постраничной пагинацией и параметрами
const getDepartmentParam = async (page, perpage, parent_id, begin, end, code, name, department_item_id, full_name, address, sort) => {
  // 1. Поиск по числовым значениям осуществляется через where
  // 2. Поиск по текстовым значением осуществлется через like
  // 3. Для полей, которые не обязательны для заполнения (в миграции не указано notNull() )
  // дополнительно проверяется на null !
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
  let queryObject = {}
  let queryObjectString = {}
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
          queryObjectString['code'] = '%'+code+'%'
  } else {
    queryObjectString['code'] = '%%'
  }
        if (typeof name !== 'undefined'){
    queryObjectString['name'] = '%'+name+'%'
  } else {
    queryObjectString['name'] = '%%'
  }
        if (typeof department_item_id !== 'undefined'){
    
    queryObjectString['department_item_id'] = '%'+department_item_id+'%'
  } else {
    queryObjectString['department_item_id'] = '%%'
  }
        if (typeof full_name !== 'undefined'){
    queryObjectString['full_name'] = '%'+full_name+'%'
  } else {
    queryObjectString['full_name'] = '%%'
  }
        if (typeof address !== 'undefined'){
    queryObjectString['address'] = '%'+address+'%'
  } else {
    queryObjectString['address'] = '%%'
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
  let resultData = await knex("department")
  .select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .andWhereILike('code', queryObjectString.code)
  .andWhereILike('name', queryObjectString.name)
  //.andWhereILike('department_item_id', queryObjectString.department_item_id)
  .andWhere(qb => {
    if (queryObjectString.department_item_id === "%%"){
     return qb.whereILike("department_item_id", queryObjectString.department_item_id).orWhereNull("department_item_id")
    }else{
     return qb.whereILike("department_item_id", queryObjectString.department_item_id)
    }
  })
  //.andWhereILike('full_name', queryObjectString.full_name)
  .andWhere(qb => {
    if (queryObjectString.full_name === "%%"){
     return qb.whereILike("full_name", queryObjectString.full_name).orWhereNull("full_name")
    }else{
     return qb.whereILike("full_name", queryObjectString.full_name)
    }
  })
  //.andWhereILike('address', queryObjectString.address)
  .andWhere(qb => {
    if (queryObjectString.address === "%%"){
     return qb.whereILike("address", queryObjectString.address).orWhereNull("address")
    }else{
     return qb.whereILike("address", queryObjectString.address)
    }
  })
  .limit(prpg).offset((pg-1)*prpg)

  for (let i = 0;i < resultData.length; i++){
    resultData[i].begin = resultData[i].begin.toLocaleDateString('ru-RU', options);
    if (resultData[i].end !== null){
      resultData[i].end = resultData[i].end.toLocaleDateString('ru-RU', options);
    }
  }

  let countData = await knex("department")
  .where(queryObject)
  .andWhereILike('code', queryObjectString.code)
  .andWhereILike('name', queryObjectString.name)
  //.andWhereILike('department_item_id', queryObjectString.department_item_id)
  .andWhere(qb => {
    if (queryObjectString.department_item_id === "%%"){
     return qb.whereILike("department_item_id", queryObjectString.department_item_id).orWhereNull("department_item_id")
    }else{
     return qb.whereILike("department_item_id", queryObjectString.department_item_id)
    }
  })
  //.andWhereILike('full_name', queryObjectString.full_name)
  .andWhere(qb => {
    if (queryObjectString.full_name === "%%"){
     return qb.whereILike("full_name", queryObjectString.full_name).orWhereNull("full_name")
    }else{
     return qb.whereILike("full_name", queryObjectString.full_name)
    }
  })
  //.andWhereILike('address', queryObjectString.address)
  .andWhere(qb => {
    if (queryObjectString.address === "%%"){
     return qb.whereILike("address", queryObjectString.address).orWhereNull("address")
    }else{
     return qb.whereILike("address", queryObjectString.address)
    }
  })
  .first()
  .count('id as countRow')

  for (let i = 0; i < resultData.length; i++){
    let parentsString = await getAllNamesOfParents(resultData[i].id)
    let parentsArray = parentsString.split(separ)
    parentsArray.pop()  //  Удалим ГХК
    parentsArray.pop()  // Удалим ГХК (ШТАТ)
    parentsArray.reverse()  // развернули
    parentsArray.pop()  // Удалим сам этот объект
    resultData[i]["parent_tree"] = parentsArray.join(separ)
}

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  
  resultData.push(countData)
  return resultData
}

//Показать подразделения подробно
const getOneDepartment = async(departmentId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  let ret = await knex("department").first().where({ id: departmentId })
  let parentsString = await getAllNamesOfParents(ret.id)
  let parentsArray = parentsString.split(separ)
  parentsArray.pop()  //  Удалим ГХК
  parentsArray.pop()  // Удалим ГХК (ШТАТ)
  parentsArray.reverse()  // развернули
  parentsArray.pop()  // Удалим сам этот объект
  ret["parent_tree"] = parentsArray.join(separ)
  return ret
}

//Создать подразделения
const creatDepartment = async(parent_id, begin, end, code, name, department_item_id, full_name, address, user) => {
  let newDepartment = {
    begin: begin,
    code: code,
    name: name,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
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
   const result = await knex("department").insert([newDepartment], ["id"]);
   newDepartment['id'] = result[0].id
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
  updateObject['updatedAt'] = new Date()
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
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