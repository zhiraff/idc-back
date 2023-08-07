const knex = require("../../knex_init");
//Поулчить весь персонал (и на контр и не на контр)
const getAddress = (page, perpage, sort) => {
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
  return knex("fl_address").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
}

//Получить персонал, с постраничной пагинацией и параметрами
const getAddressParam = async (page, perpage, flKey, type, zipCode, country, region, area, city, street, home, struct, build, appart, sort) => {
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
  if (typeof flKey !== 'undefined'){
    queryObject['flKey'] = flKey
  }
    if (typeof type !== 'undefined'){
    queryObject['type'] = type
  }
      if (typeof zipCode !== 'undefined'){
    queryObject['zipCode'] = zipCode
  }
      if (typeof country !== 'undefined'){
    queryObject['country'] = country
  }
      if (typeof region !== 'undefined'){
    queryObject['region'] = region
  }
      if (typeof area !== 'undefined'){
    queryObject['area'] = area
  }
      if (typeof city !== 'undefined'){
    queryObject['city'] = city
  }
      if (typeof street !== 'undefined'){
    queryObject['street'] = street
  }
      if (typeof home !== 'undefined'){
    queryObject['home'] = home
  }
      if (typeof struct !== 'undefined'){
    queryObject['struct'] = struct
  }
      if (typeof build !== 'undefined'){
    queryObject['build'] = build
  }
      if (typeof appart !== 'undefined'){
    queryObject['appart'] = appart
  }

  return knex("fl_address").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .limit(prpg).offset((pg-1)*prpg)
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
   
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
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
        createdBy: typeof user !== 'undefined' ? user : "unknown",
        updatedBy: typeof user !== 'undefined' ? user : "unknown",
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