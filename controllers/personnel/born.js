const knex = require("../../knex_init");
//Поулчить весь персонал (и на контр и не на контр)
const getBorn = async (page, perpage, sort) => {
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
  let resultData = await knex("fl_born").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  let countData = await knex("fl_born")
  .first()
  .count('id as countRow')
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData

}

//Получить персонал, с постраничной пагинацией и параметрами
const getBornParam = async (page, perpage, flKey, date, country, region, area, locality, sort) => {
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
  if (typeof flKey !== 'undefined'){
    queryObject['flKey'] = flKey
  }
    if (typeof date !== 'undefined'){
    queryObject['date'] = date
  }
      if (typeof country !== 'undefined'){
        queryObjectString['country'] = "%"+country+"%"
  }else{
    queryObjectString['country'] = "%%"
  }
      if (typeof region !== 'undefined'){
        queryObjectString['region'] = "%"+region+"%"
  }else{
    queryObjectString['region'] = "%%"
  }
      if (typeof area !== 'undefined'){
        queryObjectString['area'] = "%"+area+"%"
  }else{
    queryObjectString['area'] = "%%"
  }
      if (typeof locality !== 'undefined'){
        queryObjectString['locality'] = "%"+locality+"%"
  }else{
    queryObjectString['locality'] = "%%"
  }

  let resultData = await knex("fl_born").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .andWhereILike("country", queryObjectString.country)
  .andWhereILike("region", queryObjectString.region)
  .andWhereILike("area", queryObjectString.area)
  .andWhereILike("locality", queryObjectString.locality)
  .limit(prpg).offset((pg-1)*prpg)
  let countData = await knex("fl_born")
  .where(queryObject)
  .andWhereILike("country", queryObjectString.country)
  .andWhereILike("region", queryObjectString.region)
  .andWhereILike("area", queryObjectString.area)
  .andWhereILike("locality", queryObjectString.locality)
  .first()
  .count('id as countRow')
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData

}

//Показать персонал подробно
const getOneBorn = async(bornId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("fl_born").first().where({ id: bornId })
}

const createBorn = async (flKey, date, country, region, area, locality, user) => {
    createObject = {
        flKey: flKey,
        date: date,
        country: country,
        region: region,
        locality: locality,
        createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
        updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    }
    if (typeof area !== 'undefined'){
        createObject['area'] = area
    }
    
    const result = await knex("fl_born").insert([createObject], ["id"]);
    createObject['id'] = result[0].id
    return createObject;
}

// обновление записи 
 const updateBorn = async (bornId, date, country, region, area, locality, user) => {
    let updateObject = {}
    if (typeof date !== 'undefined'){
    updateObject['date'] = date
  }
  if (typeof country !== 'undefined'){
    updateObject['country'] = country
  }
  if (typeof region !== 'undefined'){
    updateObject['region'] = region
  }
  if (typeof area !== 'undefined'){
    updateObject['area'] = area
  }
  if (typeof locality !== 'undefined'){
    updateObject['locality'] = locality
  }
  updateObject['updatedAt'] = Date.now()
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("fl_born")
    .where({ id: bornId })
    .update(updateObject);
 }

 //удаление записи физ.лица
 const deleteBorn = async (bornId) => {
  return knex("fl_born").where({ id: bornId }).del()
 }

module.exports.get = getBorn;
module.exports.getByParam = getBornParam;
module.exports.getOne = getOneBorn;
module.exports.create = createBorn;
module.exports.update = updateBorn;
module.exports.delete = deleteBorn;