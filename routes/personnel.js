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
    await knex("fl_addres").insert([createObject]);
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

})

//Создать новую запись в таблице изменений ФИО
router.post("/fio", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Создать запись в таблице изменений ФИО у физ.лица'
    */

})

//Создать новую запись в таблице данных о рождении
router.post("/born", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Создать запись в таблице рождение у физ.лица'
    */

})

//Создать новую запись в таблице документов
router.post("/docs", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Создать запись в таблице документы у физ.лица'
    */

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
        res.status(400).json({
            "status": "error",
            "data": ""
        })
    })

})

module.exports = router