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
  return knex("radionuclide").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
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
  queryObject = {}
  if (typeof symbol !== 'undefined'){
    queryObject['symbol'] = symbol
  }
  if (typeof name !== 'undefined'){
    queryObject['name'] = name
  }
    if (typeof htmlcode !== 'undefined'){
    queryObject['htmlcode'] = htmlcode
  }

  return knex("radionuclide").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject).limit(prpg)
  .offset((pg-1)*prpg)
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
    createdBy: typeof user !== 'undefined' ? user : "unknown",
    updatedBy: typeof user !== 'undefined' ? user : "unknown",
  };
  await knex("radionuclide").insert([newRadionuclide]);
  return newRadionuclide;
}
// обновление радионуклида
 const updateRadionuclide = async (radionuclideId, symbol, name, htmlcode, user) => {
  const usr = typeof user !== 'undefined' ? user : "unknown"
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
  updateObject['updateBy'] = usr
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