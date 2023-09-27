const knex = require("../../knex_init");

//Методы работы с профессиями
//Получить список профессий, с постраничной пагинацией
const getProfession = async (page, perpage, sort) => {
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

  let resultData = await knex("profession").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  let countData = await knex("profession")
  .first()
  .count('id as countRow')

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)

  return resultData
}

const getProfessionParam = async (page, perpage, division, code, name, okz, sort) => {
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
  let queryObjectString = {}
  if (typeof division !== 'undefined'){
    queryObjectString['division'] = "%"+division+"%"
  } else {
    queryObjectString['division'] = "%%"
  }
    if (typeof code !== 'undefined'){
    queryObject['code'] = code
  }
    if (typeof name !== 'undefined'){
      queryObjectString['name'] = "%"+name+"%"
  }else {
    queryObjectString['name'] = "%%"
  }
    if (typeof okz !== 'undefined'){
      queryObjectString['okz'] = "%"+okz+"%"
  } else {
    queryObjectString['okz'] = "%%"
  }

  let resultData = await knex("profession").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .andWhereILike('division', queryObjectString.division)
  .andWhereILike('name', queryObjectString.name)
  .andWhereILike('okz', queryObjectString.okz)
  .limit(prpg).offset((pg-1)*prpg)

  let countData = await knex("profession")
  .where(queryObject)
  .andWhereILike('division', queryObjectString.division)
  .andWhereILike('name', queryObjectString.name)
  .andWhereILike('okz', queryObjectString.okz)
  .first()
  .count('id as countRow')

  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)

  return resultData
}

//Показать профессию подробно
const getOneProfession = async(professionId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("profession").first().where({ id: professionId })
}

//Создать профессию
const creatProfession = async(division, code, name, okz, cn, etks, user) => {
  const newProfession = {
    division: division,
    code: Number(code),
    name: name,
    okz: typeof okz !== 'undefined' ? okz : "",
    controlNumber: typeof cn !== 'undefined' ? Number(cn) : 0,
    etks_category: typeof etks !== 'undefined' ? etks : "",
    createdBy: typeof user.username !== 'undefined' ? user.username : "",
    updatedBy: typeof user.username !== 'undefined' ? user.username : "",
  };
   const result = await knex("profession").insert([newProfession], ["id"]);
   newProfession['id'] = result[0].id
  return newProfession;
}

// обновление профессии
 const updateProfession = async (professionId, division, code, name, okz, cn, etks, user) => {
    let updateObject = {}
  if (typeof division !== 'undefined'){
    updateObject['division'] = division
  }
    if (typeof code !== 'undefined'){
    updateObject['code'] = code
  }
    if (typeof name !== 'undefined'){
    updateObject['name'] = name
  }
    if (typeof okz !== 'undefined'){
    updateObject['okz'] = okz
  }
      if (typeof cn !== 'undefined'){
    updateObject['controlNumber'] = cn
  }
      if (typeof etks !== 'undefined'){
    updateObject['etks_category'] = etks
  }
  updateObject['updatedAt'] = new Date()
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("profession")
    .where({ id: professionId })
    .update(updateObject);
 }

 //удаление профессии
 const deleteProfession = async (professionId) => {
  return knex("profession").where({ id: professionId }).del()
 }

 module.exports.get = getProfession;
module.exports.getByParam = getProfessionParam;
module.exports.getOne = getOneProfession;
module.exports.create = creatProfession;
module.exports.update = updateProfession;
module.exports.delete = deleteProfession;