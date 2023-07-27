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
  return knex("profession").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
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
  if (typeof division !== 'undefined'){
    queryObject['division'] = division
  }
    if (typeof code !== 'undefined'){
    queryObject['code'] = code
  }
    if (typeof name !== 'undefined'){
    queryObject['name'] = name
  }
    if (typeof okz !== 'undefined'){
    queryObject['okz'] = okz
  }

  return knex("profession").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .limit(prpg).offset((pg-1)*prpg)
}

//Показать профессию подробно
const getOneprofession = async(professionId) => {
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
    createdBy: typeof user !== 'undefined' ? user : "",
    updatedBy: typeof user !== 'undefined' ? user : "",
  };
  await knex("profession").insert([newProfession]);
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
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
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