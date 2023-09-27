const knex = require("../../knex_init");


//Методы работы с радионуклидами
//Получить список радионуклидов, с постраничной пагинацией
const getRadionuclide = async (page, perpage, sort) => {
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

  let resultData = await knex("radionuclide").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  let countData = await knex("radionuclide")
  .first()
  .count('id as countRow')

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)

  return resultData
}

//Получить список радионуклидов, с по различным параметрам
const getRadionuclideParam = async (symbol, name, htmlcode, page, perpage, sort) => {
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
  queryObjectString = {}
  if (typeof symbol !== 'undefined'){
    queryObjectString['symbol'] = "%"+symbol+"%"
  }else {
    queryObjectString['symbol'] = "%%"
  }
  if (typeof name !== 'undefined'){
    queryObjectString['name'] = "%"+name+"%"
  } else {
    queryObjectString['name'] = "%%"
  }
    if (typeof htmlcode !== 'undefined'){
      queryObjectString['htmlcode'] = "%"+htmlcode+"%"
  } else {
    queryObjectString['htmlcode'] = "%%"
  }

  let resultData = await knex("radionuclide")
  .select()
  .orderBy(sortField, sortDirect)
  .whereILike('symbol', queryObjectString.symbol)
  .andWhereILike('name', queryObjectString.name)
  .andWhereILike('htmlcode', queryObjectString.htmlcode)
  .limit(prpg)
  .offset((pg-1)*prpg)

  let countData = await knex("radionuclide")
  .whereILike('symbol', queryObjectString.symbol)
  .andWhereILike('name', queryObjectString.name)
  .andWhereILike('htmlcode', queryObjectString.htmlcode)
  .first()
  .count('id as countRow')

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)

  return resultData
}
//Показать радионуклид подробно
const getOneRadionuclide = async(radionuclideId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("radionuclide").first().where({ id: radionuclideId })
}

//Создать радионуклид
const creatRadionuclide = async(symbol, name, htmlcode, user) => {
  const newRadionuclide = {
    symbol: symbol,
    name: name,
    htmlcode: typeof htmlcode !== 'undefined' ? htmlcode : "",
    createdBy: typeof user.username !== 'undefined' ? user.username: "unknown",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
  };
   const result = await knex("radionuclide").insert([newRadionuclide], ["id"]);
   newRadionuclide['id'] = result[0].id
  return newRadionuclide;
}
// обновление радионуклида
 const updateRadionuclide = async (radionuclideId, symbol, name, htmlcode, user) => {
  const usr = typeof user.username !== 'undefined' ? user.username : "unknown"
  let updateObject = {}
  if (typeof symbol !== 'undefined'){
    updateObject['symbol'] = symbol
  }

  if (typeof name !== 'undefined'){
    updateObject['name'] = name
  }

  if (typeof htmlcode !== 'undefined'){
    updateObject['htmlcode'] = htmlcode
  }
  updateObject['updatedAt'] = Date.now()
  updateObject['updatedBy'] = usr
   return knex("radionuclide")
    .where({ id: radionuclideId })
    .update(updateObject);
/*
    .update({
      symbol: symbol,
      name: name,
      htmlcode: htmlcode,
      updatedBy: usr
    });
    */
 }

 //удаление радионуклида
 const deleteRadionuclide = async (radionuclideId) => {
  return knex("radionuclide").where({ id: radionuclideId }).del()
 }

module.exports.get = getRadionuclide;
module.exports.getByParam = getRadionuclideParam;
module.exports.getOne = getOneRadionuclide;
module.exports.create = creatRadionuclide;
module.exports.update = updateRadionuclide;
module.exports.delete = deleteRadionuclide;