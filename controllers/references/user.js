const knex = require("../../knex_init");
const crypto = require("crypto");
const alg = "sha256"; // алгоритм хеширования
const enc = "hex"; // кодировка вычесленного хеша

//Методы работы с пользователями АС

//ф-я хэширования пароля
const hash = (d) => {
  let myhash = crypto.createHash(alg);
  myhash.update(d);
  return myhash.digest(enc);
};

//Получить пользователи, с постраничной пагинацией
const getUser = async (page, perpage, sort) => {
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

  let resultData = await knex("users").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  let countData = await knex("users")
  .first()
  .count('id as countRow')

  countData['pages'] = countData.countRow/perpage
  countData['currentPage'] = pg
  resultData.push(countData)

  return resultData
}

//Получить пользователи, с постраничной пагинацией и параметрами
const getUserParam = async (page, perpage, username, firstName, secondName, thirdName, role, sort) => {
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
  let queryObject = {}
  let queryObjectString = {}
  if (typeof username !== 'undefined'){
    queryObjectString['username'] = "%"+username+"%"
  } else {
    queryObjectString['username'] = "%%"
  }
  if (typeof firstName !== 'undefined'){
  queryObjectString['firstName'] = "%"+firstName+"%"
  } else {
    queryObjectString['firstName'] = "%%"
  }
  if (typeof secondName !== 'undefined'){
  queryObjectString['secondName'] = "%"+secondName+"%"
  } else {
    queryObjectString['secondName'] = "%%"
  }
  if (typeof thirdName !== 'undefined'){
  queryObjectString['thirdName'] = "%"+thirdName+"%"
  } else {
    queryObjectString['thirdName'] = "%%"
  }
  if (typeof role !== 'undefined'){
    queryObject['role'] = role
  }
  /*
  if (typeof department_item_id !== 'undefined'){
    queryObject['department_item_id'] = department_item_id
  }
*/
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

  let resultData = await knex("users").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .andWhereILike('username', queryObjectString.username)
  .andWhereILike('firstName', queryObjectString.firstName)
  .andWhereILike('secondName', queryObjectString.secondName)
  .andWhereILike('thirdName', queryObjectString.thirdName)
  .limit(prpg).offset((pg-1)*prpg)

  let countData = await knex("users")
  .where(queryObject)
  .andWhereILike('username', queryObjectString.username)
  .andWhereILike('firstName', queryObjectString.firstName)
  .andWhereILike('secondName', queryObjectString.secondName)
  .andWhereILike('thirdName', queryObjectString.thirdName)
  .first()
  .count('id as countRow')

  countData['pages'] = countData.countRow/perpage
  countData['currentPage'] = pg
  resultData.push(countData)

  return 
}

//Показать пользователя подробно
const getOneUser = async(UserId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("users").first().where({ id: UserId })
}

//Создать пользователя
const creatUser = async(username, password, firstName, secondName, thirdName, role, user) => {
  let newUser = {
    username: username,
    password: hash(password),
    role: role,
    createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
    if (typeof firstName !== 'undefined'){
    newUser['firstName'] = firstName
  }
      if (typeof secondName !== 'undefined'){
    newUser['secondName'] = secondName
  }
      if (typeof thirdName !== 'undefined'){
    newUser['thirdName'] = thirdName
  }
 
   const result = await knex("users").insert([newUser], ["id"]);
   newUser['id'] = result[0].id
  return newUser;
}

// обновление пользователя
 const updateUser = async (UserId, username, password, firstName, secondName, thirdName, role, user) => {
    let updateObject = {}
    if (typeof username !== 'undefined'){
    updateObject['username'] = username
  }
  if (typeof password !== 'undefined'){
    updateObject['password'] = hash(password)
  }
    if (typeof firstName !== 'undefined'){
    updateObject['firstName'] = firstName
  }
      if (typeof secondName !== 'undefined'){
    updateObject['secondName'] = secondName
  }
      if (typeof thirdName !== 'undefined'){
    updateObject['thirdName'] = thirdName
  }
      if (typeof role !== 'undefined'){
    updateObject['role'] = role
  }
  updateObject['updatedAt'] = Date.now()
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
  //console.log(user)
   return knex("users")
    .where({ id: UserId })
    .update(updateObject);
 }

 //удаление пользователя
 const deleteUser = async (UserId) => {
  return knex("users").where({ id: UserId }).del()
 }

 module.exports.get = getUser;
module.exports.getByParam = getUserParam;
module.exports.getOne = getOneUser;
module.exports.create = creatUser;
module.exports.update = updateUser;
module.exports.delete = deleteUser;