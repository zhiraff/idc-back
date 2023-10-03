const knex = require("../../knex_init");
//Поулчить весь персонал (и на контр и не на контр)
const getAddress = async (page, perpage, sort) => {
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

  let resultData = await knex("fl_address").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
  let countData = await knex("fl_address")
  .first()
  .count('id as countRow')
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Получить персонал, с постраничной пагинацией и параметрами
const getAddressParam = async (page, perpage, flKey, type, zipCode, country, region, area, city, street, home, struct, build, appart, sort) => {
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
  let queryObjectString = {}
  if (typeof flKey !== 'undefined'){
    queryObject['flKey'] = flKey
  }
    if (typeof type !== 'undefined'){
      queryObjectString['type'] = "%"+type+"%"
  } else {
    queryObjectString['type'] = "%%"
  }
      if (typeof zipCode !== 'undefined'){
    queryObject['zipCode'] = zipCode
  }
      if (typeof country !== 'undefined'){
        queryObjectString['country'] = "%"+country+"%"
  } else {
    queryObjectString['country'] = "%%"
  }
      if (typeof region !== 'undefined'){
        queryObjectString['region'] = "%"+region+"%"
  } else {
    queryObjectString['region'] = "%%"
  }
      if (typeof area !== 'undefined'){
        queryObjectString['area'] = "%"+area+"%"
  } else {
    queryObjectString['area'] = "%%"
  }
      if (typeof city !== 'undefined'){
        queryObjectString['city'] = "%"+city+"%"
  } else {
    queryObjectString['city'] = "%%"
  }
      if (typeof street !== 'undefined'){
        queryObjectString['street'] = "%"+street+"%"
  } else {
    queryObjectString['street'] = "%%"
  }
      if (typeof home !== 'undefined'){
        queryObjectString['home'] = "%"+home+"%"
  } else {
    queryObjectString['home'] = "%%"
  }
      if (typeof struct !== 'undefined'){
        queryObjectString['struct'] = "%"+struct+"%"
  } else {
    queryObjectString['struct'] = "%%"
  }
      if (typeof build !== 'undefined'){
        queryObjectString['build'] = "%"+build+"%"
  } else {
    queryObjectString['build'] = "%%"
  }
      if (typeof appart !== 'undefined'){
        queryObjectString['appart'] = "%"+appart+"%"
  } else {
    queryObjectString['appart'] = "%%"
  }

  //console.log(queryObject)
  //console.log(queryObjectString)

  let resultData = await knex("fl_address").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  //.andWhereILike("type", queryObjectString.type)
  .andWhere(qb => {
     if (queryObjectString.type === "%%"){
      return qb.whereILike("type", queryObjectString.type).orWhereNull("type")
     }else{
      return qb.whereILike("type", queryObjectString.type)
     }
  })
  .andWhereILike("country", queryObjectString.country)
  .andWhereILike("region", queryObjectString.region)
  //.andWhereILike("area", queryObjectString.area)
  .andWhere(qb => {
    if (queryObjectString.area === "%%"){
     return qb.whereILike("area", queryObjectString.area).orWhereNull("area")
    }else{
     return qb.whereILike("area", queryObjectString.area)
    }
 })
  .andWhereILike("city", queryObjectString.city)
  .andWhereILike("street", queryObjectString.street)
  .andWhereILike("home", queryObjectString.home)
  //.andWhereILike("struct", queryObjectString.struct)
  .andWhere(qb => {
    if (queryObjectString.struct === "%%"){
     return qb.whereILike("struct", queryObjectString.struct).orWhereNull("struct")
    }else{
     return qb.whereILike("struct", queryObjectString.struct)
    }
 })
  //.andWhereILike("build", queryObjectString.build)
  .andWhere(qb => {
    if (queryObjectString.build === "%%"){
     return qb.whereILike("build", queryObjectString.build).orWhereNull("build")
    }else{
     return qb.whereILike("build", queryObjectString.build)
    }
 })
  .andWhereILike("appart", queryObjectString.appart)
  .limit(prpg).offset((pg-1)*prpg)

  let countData = await knex("fl_address")
  .where(queryObject)
  //.andWhereILike("type", queryObjectString.type)
  .andWhere(qb => {
    if (queryObjectString.type === "%%"){
     return qb.whereILike("type", queryObjectString.type).orWhereNull("type")
    }else{
     return qb.whereILike("type", queryObjectString.type)
    }
 })
  .andWhereILike("country", queryObjectString.country)
  .andWhereILike("region", queryObjectString.region)
  //.andWhereILike("area", queryObjectString.area)
  .andWhere(qb => {
    if (queryObjectString.area === "%%"){
     return qb.whereILike("area", queryObjectString.area).orWhereNull("area")
    }else{
     return qb.whereILike("area", queryObjectString.area)
    }
 })
  .andWhereILike("city", queryObjectString.city)
  .andWhereILike("street", queryObjectString.street)
  .andWhereILike("home", queryObjectString.home)
  //.andWhereILike("struct", queryObjectString.struct)
  .andWhere(qb => {
    if (queryObjectString.struct === "%%"){
     return qb.whereILike("struct", queryObjectString.struct).orWhereNull("struct")
    }else{
     return qb.whereILike("struct", queryObjectString.struct)
    }
 })
  //.andWhereILike("build", queryObjectString.build)
  .andWhere(qb => {
    if (queryObjectString.build === "%%"){
     return qb.whereILike("build", queryObjectString.build).orWhereNull("build")
    }else{
     return qb.whereILike("build", queryObjectString.build)
    }
 })
  .andWhereILike("appart", queryObjectString.appart)
  .first()
  .count('id as countRow')
  countData['pages'] = Math.ceil(countData.countRow/prpg)
  countData['currentPage'] = pg
  resultData.push(countData)
  return resultData
}

//Показать персонал подробно
const getOneAddress = async(addressId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("fl_address").first().where({ id: addressId })
}

 // обновление записи адресов у физ.лица
 const updateAddress = async (addressId, type, zipCode, country, region, area, city, street, home, struct, build, appart, user) => {
    let updateObject = {}

  if (typeof type !== 'undefined'){
    updateObject['type'] = type
  }
  if (typeof zipCode !== 'undefined'){
    updateObject['zipCode'] = zipCode
  }
  if (typeof country !== 'undefined'){
    updateObject['country'] = country
  }
  if (typeof region !== 'undefined'){
    updateObject['region'] = region
  }
    if (typeof region !== 'undefined'){
    updateObject['region'] = region
  }
    if (typeof area !== 'undefined'){
    updateObject['area'] = area
  }
    if (typeof city !== 'undefined'){
    updateObject['city'] = city
  }
    if (typeof street !== 'undefined'){
    updateObject['street'] = street
  }
    if (typeof home !== 'undefined'){
    updateObject['home'] = home
  }
    if (typeof struct !== 'undefined'){
    updateObject['struct'] = struct
  }
    if (typeof build !== 'undefined'){
    updateObject['build'] = build
  }
      if (typeof appart !== 'undefined'){
    updateObject['appart'] = appart
  }
  updateObject['updatedAt'] = new Date()
      if (typeof user.username !== 'undefined'){
    updateObject['updatedBy'] = user.username
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("fl_address")
    .where({ id: addressId })
    .update(updateObject);
 }

 //удаление записи адресов у физ.лица
 const deleteAddress = async (addressId) => {
  return knex("fl_address").where({ id: addressId }).del()
 }

 const createAddres = async (flKey, type, zipCode, country, region, area, city, street, home, struct, build, appart, user) => {
    createObject = {
        flKey: flKey,
        country: country,
        region: region,
        city: city,
        street: street,
        home: home,
        appart: appart,
        createdBy: typeof user.username !== 'undefined' ? user.username : "unknown",
        updatedBy: typeof user.username !== 'undefined' ? user.username : "unknown",
    }
    if (typeof type !== 'undefined'){
        createObject['type'] = type
    }
    if (typeof zipCode !== 'undefined'){
        createObject['zipCode'] = zipCode
    }
        if (typeof area !== 'undefined'){
        createObject['area'] = area
    }
    if (typeof struct !== 'undefined'){
        createObject['struct'] = struct
    }
    if (typeof build !== 'undefined'){
        createObject['build'] = build
    }
    const result = await knex("fl_address").insert([createObject], ["id"]);
    createObject['id'] = result[0].id
    return createObject;
}

module.exports.get = getAddress;
module.exports.getByParam = getAddressParam;
module.exports.getOne = getOneAddress;
module.exports.create = createAddres;
module.exports.update = updateAddress;
module.exports.delete = deleteAddress;