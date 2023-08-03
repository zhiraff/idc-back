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
    
    const result = await knex("fl_fio").insert([createObject], ["id"]);
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
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;

})

//Получить весь персонал (только на контроле)
router.get("/control", (req, res) => {
    /*
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
    #swagger.tags = ['personnel']
    #swagger.description = 'Поиск человека среди стоящих на контроле'
    */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;

})

//Создать новую запись (ЦЕЛИКОМ СО ВСЕМИ ДАННЫМИ)
router.post("/whole", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Добавить персонал (передавать нужно сразу физ.лицо+адреса+документы+места+рождение)'
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

module.exports = router