require("dotenv").config();
const express = require("express")
const router = express.Router()
const knex = require("../knex_init");


//Методы (не забыть перенести в controllers)
//Поулчить весь персонал (и на контр и не на контр)
const getPersonnel = (page, perpage, sort) => {
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
  return knex("FL").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
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

const createDocs = async (flKey, name, serial, number, dateIssue, whoIssue, podrIssue, active, user) => {
    createObject = {
        flKey: flKey,
        name: name,
        number: number,
        serial: serial,
        dateIssue: dateIssue,
        whoIssue: whoIssue,
        podrIssue: podrIssue,

        createdBy: typeof user !== 'undefined' ? user : "unknown",
        updatedBy: typeof user !== 'undefined' ? user : "unknown",
    }
    if (typeof active !== 'undefined'){
        createObject['active'] = active
    }
    
    const result = await knex("fl_docs").insert([createObject], ["id"]);
    createObject['id'] = result[0].id
    return createObject;
}

const createBorn = async (flKey, date, country, region, area, locality, user) => {
    createObject = {
        flKey: flKey,
        date: date,
        country: country,
        region: region,
        locality: locality,
        createdBy: typeof user !== 'undefined' ? user : "unknown",
        updatedBy: typeof user !== 'undefined' ? user : "unknown",
    }
    if (typeof area !== 'undefined'){
        createObject['area'] = area
    }
    
    const result = await knex("fl_born").insert([createObject], ["id"]);
    createObject['id'] = result[0].id
    return createObject;
}

const createFio = async (flKey, firstName, secondName, thirdName, date, comment, user) => {
    createObject = {
        flKey: flKey,
        date: date,
        createdBy: typeof user !== 'undefined' ? user : "unknown",
        updatedBy: typeof user !== 'undefined' ? user : "unknown",
    }
    if (typeof firstName !== 'undefined'){
        createObject['firstName'] = firstName
    }
    if (typeof secondName !== 'undefined'){
        createObject['secondName'] = secondName
    }
    if (typeof thirdName !== 'undefined'){
        createObject['thirdName'] = thirdName
    }
    if (typeof comment !== 'undefined'){
        createObject['comment'] = comment
    }
    
    const result = await knex("fl_ch_fio").insert([createObject], ["id"]);
    createObject['id'] = result[0].id
    return createObject;
}

const createFl = async ( signImport, firstName, secondName, thirdName, sex,
                family, snils, inn, organization, department, departmentMCC,
                jobCode, tabNum, accNum, id_kadr, user) => {
    createObject = {
        sex: sex,
        family: family,
        organization: organization,
        jobCode: jobCode,
        accNum: accNum,
        createdBy: typeof user !== 'undefined' ? user : "unknown",
        updatedBy: typeof user !== 'undefined' ? user : "unknown",
    }
    if (typeof signImport !== 'undefined'){
        createObject['signImport'] = signImport
    }
    if (typeof firstName !== 'undefined'){
        createObject['firstName'] = firstName
    }
    if (typeof secondName !== 'undefined'){
        createObject['secondName'] = secondName
    }
    if (typeof thirdName !== 'undefined'){
        createObject['thirdName'] = thirdName
    }
    if (typeof snils !== 'undefined'){
        createObject['snils'] = snils
    }
    if (typeof inn !== 'undefined'){
        createObject['inn'] = inn
    }
    if (typeof department !== 'undefined'){
        createObject['department'] = department
    }
    if (typeof departmentMCC !== 'undefined'){
        createObject['departmentMCC'] = departmentMCC
    }
    if (typeof tabNum !== 'undefined'){
        createObject['tabNum'] = tabNum
    }
    if (typeof id_kadr !== 'undefined'){
        createObject['id_kadr'] = id_kadr
    }
    
    const result = await knex("FL").insert([createObject], ["id"]);
    createObject['id'] = result[0].id
    return createObject;
}

//Получить персонал, с постраничной пагинацией и параметрами
const getPersonnelParam = async (page, perpage, signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, sort) => {
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
  if (typeof signImport !== 'undefined'){
    queryObject['signImport'] = signImport
  }
    if (typeof firstName !== 'undefined'){
    queryObject['firstName'] = firstName
  }
      if (typeof secondName !== 'undefined'){
    queryObject['secondName'] = secondName
  }
      if (typeof thirdName !== 'undefined'){
    queryObject['thirdName'] = thirdName
  }
      if (typeof sex !== 'undefined'){
    queryObject['sex'] = sex
  }
      if (typeof family !== 'undefined'){
    queryObject['family'] = family
  }
      if (typeof snils !== 'undefined'){
    queryObject['snils'] = snils
  }
      if (typeof inn !== 'undefined'){
    queryObject['inn'] = inn
  }
      if (typeof organization !== 'undefined'){
    queryObject['organization'] = organization
  }
      if (typeof department !== 'undefined'){
    queryObject['department'] = department
  }
      if (typeof departmentMCC !== 'undefined'){
    queryObject['departmentMCC'] = departmentMCC
  }
      if (typeof jobCode !== 'undefined'){
    queryObject['jobCode'] = jobCode
  }
      if (typeof tabNum !== 'undefined'){
    queryObject['tabNum'] = tabNum
  }
      if (typeof accNum !== 'undefined'){
    queryObject['accNum'] = accNum
  }
      if (typeof id_kadr !== 'undefined'){
    queryObject['id_kadr'] = id_kadr
  }

  return knex("FL").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .limit(prpg).offset((pg-1)*prpg)
}

// обновление записи о физ.лице
 const updateFl = async (personnelId, signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, user) => {
    let updateObject = {}
    if (typeof signImport !== 'undefined'){
    updateObject['signImport'] = signImport
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
  if (typeof sex !== 'undefined'){
    updateObject['sex'] = sex
  }
  if (typeof family !== 'undefined'){
    updateObject['family'] = family
  }
  if (typeof snils !== 'undefined'){
    updateObject['snils'] = snils
  }
  if (typeof inn !== 'undefined'){
    updateObject['inn'] = inn
  }
  if (typeof organization !== 'undefined'){
    updateObject['organization'] = organization
  }
  if (typeof department !== 'undefined'){
    updateObject['department'] = department
  }
  if (typeof departmentMCC !== 'undefined'){
    updateObject['departmentMCC'] = departmentMCC
  }
  if (typeof jobCode !== 'undefined'){
    updateObject['jobCode'] = jobCode
  }
  if (typeof tabNum !== 'undefined'){
    updateObject['tabNum'] = tabNum
  }
  if (typeof accNum !== 'undefined'){
    updateObject['accNum'] = accNum
  }
  if (typeof id_kadr !== 'undefined'){
    updateObject['id_kadr'] = id_kadr
  }
   
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("FL")
    .where({ id: personnelId })
    .update(updateObject);
 }

 //удаление части физ.лица
 const deleteFl = async (PersonnelId) => {
  return knex("FL").where({ id: PersonnelId }).del()
 }


// обновление записи о физ.лице
 const updateFio = async (fioId, firstName, secondName, thirdName, date, comment, user) => {
    let updateObject = {}
    if (typeof firstName !== 'undefined'){
    updateObject['firstName'] = firstName
  }
  if (typeof secondName !== 'undefined'){
    updateObject['secondName'] = secondName
  }
  if (typeof thirdName !== 'undefined'){
    updateObject['thirdName'] = thirdName
  }
  if (typeof date !== 'undefined'){
    updateObject['date'] = date
  }
  if (typeof comment !== 'undefined'){
    updateObject['comment'] = comment
  }
   
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("fl_ch_fio")
    .where({ id: fioId })
    .update(updateObject);
 }

 //удаление записи 
 const deleteFio = async (fioId) => {
  return knex("fl_ch_fio").where({ id: fioId }).del()
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
   
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
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


 // обновление записи адресов у физ.лица
 const updateAddress = async (addressId, type, zipCode, country, region, area, city, street, home, struct, build, appart, user) => {
    let updateObject = {}
    if (typeof addressId !== 'undefined'){
    updateObject['addressId'] = addressId
  }
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
    .where({ id: bornId })
    .update(updateObject);
 }

 //удаление записи адресов у физ.лица
 const deleteAddress = async (bornId) => {
  return knex("fl_address").where({ id: bornId }).del()
 }

  // обновление записи документы у физ.лица
 const updateDocs = async (docsId, name, serial, number, dateIssue, whoIssue, podrIssue, active, user) => {
    let updateObject = {}
    if (typeof name !== 'undefined'){
    updateObject['name'] = name
  }
  if (typeof serial !== 'undefined'){
    updateObject['serial'] = serial
  }
  if (typeof number !== 'undefined'){
    updateObject['number'] = number
  }
  if (typeof dateIssue !== 'undefined'){
    updateObject['dateIssue'] = dateIssue
  }
  if (typeof whoIssue !== 'undefined'){
    updateObject['whoIssue'] = whoIssue
  }
    if (typeof podrIssue !== 'undefined'){
    updateObject['podrIssue'] = podrIssue
  }
    if (typeof active !== 'undefined'){
    updateObject['active'] = active
  }
   
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("fl_docs")
    .where({ id: docsId })
    .update(updateObject);
 }

 //удаление записи документы у физ.лица
 const deleteDocs = async (bornId) => {
  return knex("fl_docs").where({ id: docsId }).del()
 }

//API
//Получить весь персонал (и контролир и не контролир)
router.get("/", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Получить весь персонал (и на контроле и не на контроле)'
    */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  //console.log(`page, perpage, sort = ${page}, ${perpage}, ${sort}`)
  getPersonnel(page, perpage, sort)
  .then((data) => {
    res.status(200).json({
        "status": "success",
        "data": data
    })
    })
    .catch((err)=>{
        console.log(err)
        res.status(400).json({
            "status": "error",
            "data": ""
        })
    })
  })


//поиск человека (и контролир и не контролир)
router.get("/search", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Поиск человека (и на контроле и не на контроле)'
    */
  //const page = req.query.page;
  //const perpage = req.query.perpage;
  //const sort = req.query.sort;
   const { page, perpage, signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, sort  } = req.query

         getPersonnelParam(page, perpage, signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, sort).then((data) => {
            res.status(200).json({
                status: "success",
                data: data
        }
        );
    })
    .catch((err)=>{
      console.log(err)
      res.status(400).json({
        status: "error",
        data: ""
      })
    })
})

//Получить весь персонал (только на контроле)
router.get("/control", (req, res) => {
    /*
    #swagger.ignore = true
    #swagger.tags = ['personnel']
    #swagger.description = 'Показать весь персонал стоящий на контроле'
    */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;

})
//поиск человека (только на контроле)
router.get("/control/search", (req, res) => {
    /*
    #swagger.ignore = true
    #swagger.tags = ['personnel']
    #swagger.description = 'Поиск человека среди стоящих на контроле'
    */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;

})

//Создать новую запись (ЦЕЛИКОМ СО ВСЕМИ ДАННЫМИ)
router.post("/whole", async (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Добавить персонал (передавать можно сразу физ.лицо+адреса+документы+места+рождение)'
    */
    let idPersonnel = 0
    const { signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, 
            fio,
           // fioDate, fioComment,
            born,
          //  bornDate, bornCountry, bornRegion, bornArea, bornLocality,
          docs,
          //  docsName, docsSerial, docsNumber, docsDateIssue, docsWhoIssue, docsPodrIssue, docsActive,
            address
          //  addressType, addressZipCode, addressCountry, addressRegion, addressArea, addressCity, addressStreet, addressHome, addressStruct, addressBuild, addressAppart
         } = req.body
    //проверка на наличие обязательных базовых вещей
    if (typeof sex === 'undefined' || sex ==='' ||
        typeof family === 'undefined' || family ==='' ||
        typeof organization === 'undefined' || organization ==='' ||
        typeof jobCode === 'undefined' || jobCode ==='' ||
        typeof accNum === 'undefined' || accNum ==='' ){
                return res.status(400).json({
                status: "error",
                data: "Не хватает одного из обязательных полей (sex, family, organization, jobCode, accNum) "
                })
    }
    //создание записи в физ.лицах
    await createFl( signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, req.user)
    .then((data) => {
        idPersonnel = data.id
        /*
        res.status(200).json({
            "status": "success",
            "data": data
        })
        */
    })
    .catch((err) => {
        console.log(err)
        return res.status(400).json({
            "status": "error",
            "data": ""
        })
    })

    //создание записи в fio, если был передан массив fio
    //const {flKey, firstName, secondName, thirdName, date, comment } = req.body
    if ( Array.isArray(fio) && idPersonnel !== 0) {
            fio.forEach(async (element) => {
                if ( typeof element.date !== 'undefined' && element.date !== '') {
                   await createFio(idPersonnel, element.firstName, element.secondName, element.thirdName, element.date, element.comment, req.user)
                    .catch((err) => {
                        console.log("ошибка создания записи в fl_ch_fio")
                        console.log(err)
                    })
                }
            });
    }

    //Создать новую запись в таблице данных о рождении
   if ( Array.isArray(born) && idPersonnel !== 0) {
            born.forEach(async (element) => {
                //проверка на наличие обязательных базовых вещей
                if ( typeof element.date === 'undefined'  || element.date ===''  || 
                    typeof element.country === 'undefined' || element.country ==='' ||
                    typeof element.region === 'undefined' || element.region ==='' || 
                    typeof element.locality === 'undefined'  || element.locality ==='' ){

                }else{
                   await createBorn(idPersonnel, element.date, element.country, element.region, element.area, element.locality, req.user)
                    .catch((err) => {
                        console.log("ошибка создания записи в fl_born")
                        console.log(err)
                    })
                }
            });
    }

    //Создать новую запись в таблице документов
   if ( Array.isArray(docs) && idPersonnel !== 0) {
            docs.forEach(async (element) => {
                //проверка на наличие обязательных базовых вещей
        if ( typeof element.name === 'undefined'  || element.name ===''  || 
         typeof element.serial === 'undefined' || element.serial ==='' ||
         typeof element.number === 'undefined' || element.number ==='' || 
         typeof element.dateIssue === 'undefined' || element.dateIssue ==='' ||
         typeof element.whoIssue === 'undefined'  || element.whoIssue ===''  || 
         typeof element.podrIssue === 'undefined' || element.podrIssue ==='' ){

                }else{
                  await  createDocs(idPersonnel,  element.name, element.serial, element.number, element.dateIssue, element.whoIssue, element.podrIssue, element.active, req.user)
                .catch((err) => {
                        console.log("ошибка создания записи в fl_docs")
                        console.log(err)
                    })
                }
            });
    }

       //Создать новую запись в таблице адресов
    //const {flKey, type, zipCode, country, region, area, city, street, home, struct, build, appart} = req.body
    
   if ( Array.isArray(address) && idPersonnel !== 0) {
        for(const element of address) {
            
            if ( typeof element.country === 'undefined' || element.country ==='' || 
                typeof element.region === 'undefined' || element.region ==='' ||
                typeof element.city === 'undefined' || element.city ==='' || 
                typeof element.street === 'undefined' || element.street ==='' ||
                typeof element.home === 'undefined' || element.home ==='' || 
                typeof element.appart === 'undefined' || element.appart ==='' ){

                }else{
                    console.log(`${idPersonnel},  ${element.type}, ${element.zipCode}, ${element.country}, ${element.region}, ${element.area}, ${element.city}, ${element.street}, ${element.home}, ${element.struct}, ${element.build}, ${element.appart}, ${req.user}`)
                    await  createAddres(idPersonnel,  element.type, element.zipCode, element.country, element.region, element.area, element.city, element.street, element.home, element.struct, element.build, element.appart, req.user)
                .catch((err) => {
                        console.log("ошибка создания записи в fl_addres")
                        console.log(err)
                    })
                }
        }
/*
            address.forEach( async (element) => {
                //проверка на наличие обязательных базовых вещей
                if ( typeof element.country === 'undefined' || element.country ==='' || 
                typeof element.region === 'undefined' || element.region ==='' ||
                typeof element.city === 'undefined' || element.city ==='' || 
                typeof element.street === 'undefined' || element.street ==='' ||
                typeof element.home === 'undefined' || element.home ==='' || 
                typeof element.appart === 'undefined' || element.appart ==='' ){

                }else{
                    console.log(`${idPersonnel},  ${element.type}, ${element.zipCode}, ${element.country}, ${element.region}, ${element.area}, ${element.city}, ${element.street}, ${element.home}, ${element.struct}, ${element.build}, ${element.appart}, ${req.user}`)
                const resu = await  createAddres(idPersonnel,  element.type, element.zipCode, element.country, element.region, element.area, element.city, element.street, element.home, element.struct, element.build, element.appart, req.user)
                .catch((err) => {
                        console.log("ошибка создания записи в fl_addres")
                        console.log(err)
                    })
                }
            });
            */
    }

    if (idPersonnel !== 0) {
        res.status(200).json({
            "status": "success",
            "data": ""
        })
    }
    /*
   //fl
    const { signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr } = req.body
    //fio
    const {flKey, firstName, secondName, thirdName, date, comment } = req.body
    //born
    const {flKey, date, country, region, area, locality } = req.body
    //docs
    const {flKey, name, serial, number, dateIssue, whoIssue, podrIssue, active } = req.body
    //address
    const {flKey, type, zipCode, country, region, area, city, street, home, struct, build, appart} = req.body
        */
})

//Создать новую запись только физическое лицо
router.post("/fl", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Создать физическое лицо'
    */
     const { signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr } = req.body
    
    //проверка на наличие обязательных базовых вещей
    if (typeof sex === 'undefined' || sex ==='' ||
        typeof family === 'undefined' || family ==='' ||
        typeof organization === 'undefined' || organization ==='' ||
        typeof jobCode === 'undefined' || jobCode ==='' ||
        typeof accNum === 'undefined' || accNum ==='' ){
                return res.status(400).json({
                status: "error",
                data: "Не хватает одного из обязательных полей (sex, family, organization, jobCode, accNum) "
                })
    }
    createFl( signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, req.user)
    .then((data) => {
        res.status(200).json({
            "status": "success",
            "data": data
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(400).json({
            "status": "error",
            "data": ""
        })
    })
})

//Создать новую запись в таблице изменений ФИО
router.post("/fio", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Создать запись в таблице изменений ФИО у физ.лица'
    */
    const {flKey, firstName, secondName, thirdName, date, comment } = req.body
    //проверка на наличие обязательных базовых вещей
    if ( typeof flKey === 'undefined' || flKey ==='' ||
         typeof date === 'undefined' || date ==='' ){
                return res.status(400).json({
                status: "error",
                data: "Не хватает одного из обязательных полей (flKey, date) "
                })
    }
    createFio(flKey, firstName, secondName, thirdName, date, comment, req.user)
    .then((data) => {
        res.status(200).json({
            "status": "success",
            "data": data
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(400).json({
            "status": "error",
            "data": ""
        })
    })
})

//Создать новую запись в таблице данных о рождении
router.post("/born", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Создать запись в таблице рождение у физ.лица'
    */
   const {flKey, date, country, region, area, locality } = req.body
    //проверка на наличие обязательных базовых вещей
    if ( typeof flKey === 'undefined' || flKey ==='' ||
         typeof date === 'undefined'  || date ===''  || 
         typeof country === 'undefined' || country ==='' ||
         typeof region === 'undefined' || region ==='' || 
         typeof locality === 'undefined'  || locality ==='' ){
                return res.status(400).json({
                status: "error",
                data: "Не хватает одного из обязательных полей (flKey, date, country, region, locality) "
                })
    }
    createBorn(flKey, date, country, region, area, locality, req.user)
    .then((data) => {
        res.status(200).json({
            "status": "success",
            "data": data
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(400).json({
            "status": "error",
            "data": ""
        })
    })

})

//Создать новую запись в таблице документов
router.post("/docs", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Создать запись в таблице документы у физ.лица'
    */
    const {flKey, name, serial, number, dateIssue, whoIssue, podrIssue, active } = req.body
    //проверка на наличие обязательных базовых вещей
    if ( typeof flKey === 'undefined' || flKey ==='' ||
         typeof name === 'undefined'  || name ===''  || 
         typeof serial === 'undefined' || serial ==='' ||
         typeof number === 'undefined' || number ==='' || 
         typeof dateIssue === 'undefined' || dateIssue ==='' ||
         typeof whoIssue === 'undefined'  || whoIssue ===''  || 
         typeof podrIssue === 'undefined' || podrIssue ==='' ){
                return res.status(400).json({
                status: "error",
                data: "Не хватает одного из обязательных полей (flKey, name, serial, number, dateIssue, whoIssue, podrIssue) "
                })
    }
    createDocs(flKey, name, serial, number, dateIssue, whoIssue, podrIssue, active, req.user)
    .then((data) => {
        res.status(200).json({
            "status": "success",
            "data": data
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(400).json({
            "status": "error",
            "data": ""
        })
    })
})

//Создать новую запись в таблице адресов
router.post("/address", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Создать запись в таблице адреса у физ.лица'
    */
 const {flKey, type, zipCode, country, region, area, city, street, home, struct, build, appart} = req.body
    //проверка на наличие обязательных базовых вещей
    if ( typeof flKey === 'undefined' || flKey ==='' ||
         typeof country === 'undefined' || country ==='' || 
         typeof region === 'undefined' || region ==='' ||
         typeof city === 'undefined' || city ==='' || 
         typeof street === 'undefined' || street ==='' ||
          typeof home === 'undefined' || home ==='' || 
         typeof appart === 'undefined' || appart ==='' ){
                return res.status(400).json({
                status: "error",
                data: "Не хватает одного из обязательных полей (flKey, country, region, city, street, home, appart) "
                })
    }
    createAddres(flKey, type, zipCode, country, region, area, city, street, home, struct, build, appart, req.user)
    .then((data) => {
        res.status(200).json({
            "status": "success",
            "data": data
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(400).json({
            "status": "error",
            "data": ""
        })
    })

})

//обновление записи в FL
router.patch("/fl/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Обновить запись в таблице физ.лица'
    */
 const personneltId = req.params.id
 const {signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr} = req.body;

 updateFl(personneltId, signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, req.user)
 .then((data)=>{
  res.status(200).json({
    status: "success",
    data: data
  })
 })
 .catch((err) => {
  console.log(err)
  res.status(400).json({
    status: "error",
    data: ""
  })
 })

});

//удаление Записи о персонале в FL
router.delete("/fl/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Удалить запись в таблице у физ.лица'
    */
 const personneltId = req.params.id
 deleteFl(personneltId)
 .then((data)=>{
  res.status(200).json({
    status: "success",
    data: data
  })
 })
 .catch((err) => {
  console.log(err)
  res.status(400).json({
    status: "error",
    data: ""
  })
 })

});

//обновление записи в fl_ch_fio
router.patch("/fio/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Обновить запись в таблице изменения фамилии физ.лица'
    */
 const fioId = req.params.id
const {firstName, secondName, thirdName, date, comment } = req.body
    //проверка на наличие обязательных базовых вещей
    if ( typeof firstName === 'undefined' &&
         typeof secondName === 'undefined' &&
         typeof thirdName === 'undefined' &&
         typeof date === 'undefined' &&
         typeof comment === 'undefined'){
                return res.status(400).json({
                status: "error",
                data: "Нечего обновлять"
                })
    }

 updateFio(fioId, firstName, secondName, thirdName, date, comment, req.user)
 .then((data)=>{
  res.status(200).json({
    status: "success",
    data: data
  })
 })
 .catch((err) => {
  console.log(err)
  res.status(400).json({
    status: "error",
    data: ""
  })
 })

});

//удаление Записи о персонале в fl_ch_fio
router.delete("/fio/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Удалить запись в таблице смен ФИО у физ.лица'
    */
 const fioId = req.params.id
 deleteFio(fioId)
 .then((data)=>{
  res.status(200).json({
    status: "success",
    data: data
  })
 })
 .catch((err) => {
  console.log(err)
  res.status(400).json({
    status: "error",
    data: ""
  })
 })

});

//обновление записи в fl_born
router.patch("/born/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Обновить запись в таблице дней рождений физ.лица'
    */
 const bornId = req.params.id
   const {date, country, region, area, locality } = req.body
    //проверка на наличие обязательных базовых вещей
    if ( typeof date === 'undefined'  &&
         typeof country === 'undefined' &&
         typeof region === 'undefined' &&
         typeof locality === 'undefined'  &&
         typeof area === 'undefined' ){
                return res.status(400).json({
                status: "error",
                data: "Нечего обновлять"
                })
    }

 updateBorn(bornId, date, country, region, area, locality, req.user)
 .then((data)=>{
  res.status(200).json({
    status: "success",
    data: data
  })
 })
 .catch((err) => {
  console.log(err)
  res.status(400).json({
    status: "error",
    data: ""
  })
 })

});

//удаление Записи о персонале в fl_born
router.delete("/born/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Удалить запись в таблице дней рождений у физ.лица'
    */
 const bornId = req.params.id
 deleteBorn(bornId)
 .then((data)=>{
  res.status(200).json({
    status: "success",
    data: data
  })
 })
 .catch((err) => {
  console.log(err)
  res.status(400).json({
    status: "error",
    data: ""
  })
 })

});

//обновление записи в fl_docs
router.patch("/docs/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Обновить запись в таблице документов физ.лица'
    */
 const docsId = req.params.id
   const { name, serial, number, dateIssue, whoIssue, podrIssue, active } = req.body
    //проверка на наличие обязательных базовых вещей
    if ( typeof name === 'undefined'  &&
         typeof serial === 'undefined' &&
         typeof number === 'undefined' &&
         typeof dateIssue === 'undefined' &&
         typeof whoIssue === 'undefined' &&
         typeof podrIssue === 'undefined' &&
         typeof active === 'undefined' ){
                return res.status(400).json({
                status: "error",
                data: "Нечего обновлять "
                })
    }

 updateDocs(docsId, name, serial, number, dateIssue, whoIssue, podrIssue, active, req.user)
 .then((data)=>{
  res.status(200).json({
    status: "success",
    data: data
  })
 })
 .catch((err) => {
  console.log(err)
  res.status(400).json({
    status: "error",
    data: ""
  })
 })

});

//удаление Записи о персонале в fl_docs
router.delete("/docs/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Удалить запись в таблице документов у физ.лица'
    */
 const docsId = req.params.id
 deleteDocs(docsId)
 .then((data)=>{
  res.status(200).json({
    status: "success",
    data: data
  })
 })
 .catch((err) => {
  console.log(err)
  res.status(400).json({
    status: "error",
    data: ""
  })
 })

});

//обновление записи в fl_address
router.patch("/address/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Обновить запись в таблице документов физ.лица'
    */
 const addressId = req.params.id
const { type, zipCode, country, region, area, city, street, home, struct, build, appart} = req.body
    //проверка на наличие полей
    if ( typeof type === 'undefined' &&
         typeof zipCode === 'undefined' &&
         typeof country === 'undefined' &&
         typeof region === 'undefined' &&
          typeof area === 'undefined' && 
         typeof city === 'undefined' &&
         typeof street === 'undefined' &&
         typeof home === 'undefined' &&
         typeof struct === 'undefined' &&
         typeof build === 'undefined' &&
         typeof appart === 'undefined'
          ){
                return res.status(400).json({
                status: "error",
                data: "Нечего обновлять"
                })
    }

 updateAddress(addressId, type, zipCode, country, region, area, city, street, home, struct, build, appart, req.user)
 .then((data)=>{
  res.status(200).json({
    status: "success",
    data: data
  })
 })
 .catch((err) => {
  console.log(err)
  res.status(400).json({
    status: "error",
    data: ""
  })
 })

});

//удаление Записи о персонале в fl_address
router.delete("/address/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Удалить запись в таблице адресов у физ.лица'
    */
 const addressId = req.params.id
 deleteAddress(addressId)
 .then((data)=>{
  res.status(200).json({
    status: "success",
    data: data
  })
 })
 .catch((err) => {
  console.log(err)
  res.status(400).json({
    status: "error",
    data: ""
  })
 })

});

module.exports = router