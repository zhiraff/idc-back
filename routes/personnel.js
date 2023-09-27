require("dotenv").config();
const express = require("express")
const router = express.Router()

const personnelController = require("../controllers/personnel/personnel")
const addressController = require("../controllers/personnel/address")

//API
//Получить весь персонал (и контролир и не контролир)
/
router.get("/", (req, res) => {
    /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Получить весь персонал (и на контроле и не на контроле)'
    */
   
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  //console.log(`page, perpage, sort = ${page}, ${perpage}, ${sort}`)
  //getPersonnel(page, perpage, sort)
  personnelController.getPersonnel(page, perpage, sort)
  .then(async (data) => {
    let metaindex = data.findIndex(x => x.countRow)
    let metadata = data.splice(metaindex, 1)
    let mtindx
    let mtdt
    for (let i=0; i< data.length; i++){
     data[i].address = await personnelController.getAddressByParam(1, 25, data[i].id)
     mtindx = data[i].address.findIndex(x => x.countRow)
     mtdt = data[i].address.splice(mtindx, 1)

     data[i].born = await personnelController.getBornByParam(1, 25, data[i].id)
     mtindx = data[i].born.findIndex(x => x.countRow)
     mtdt = data[i].born.splice(mtindx, 1)

     data[i].ch_fio = await personnelController.getFioByParam(1, 25, data[i].id)
     mtindx = data[i].ch_fio.findIndex(x => x.countRow)
     mtdt = data[i].ch_fio.splice(mtindx, 1)

     data[i].docs = await personnelController.getDocsByParam(1, 25, data[i].id)
     mtindx = data[i].docs.findIndex(x => x.countRow)
     mtdt = data[i].docs.splice(mtindx, 1)
    }

    res.status(200).json({
        "status": "success",
        "data": data,
        "metadata": metadata[0]
    })
    })
    .catch((err)=>{
        console.log(err)
        res.status(400).json({
            "status": "error",
            "data": "",
            "metadata": ""
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

  personnelController.getPersonnelByParam(page, perpage, signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr, sort).then( async (data) => {
              let metaindex = data.findIndex(x => x.countRow)
              let metadata = data.splice(metaindex, 1)
              let mtindx
              let mtdt
              for (let i=0; i< data.length; i++){
                data[i].address = await personnelController.getAddressByParam(1, 25, data[i].id)
                mtindx = data[i].address.findIndex(x => x.countRow)
                mtdt = data[i].address.splice(mtindx, 1)

                data[i].born = await personnelController.getBornByParam(1, 25, data[i].id)
                mtindx = data[i].address.findIndex(x => x.countRow)
                mtdt = data[i].address.splice(mtindx, 1)

                data[i].ch_fio = await personnelController.getFioByParam(1, 25, data[i].id)
                mtindx = data[i].address.findIndex(x => x.countRow)
                mtdt = data[i].address.splice(mtindx, 1)

                data[i].docs = await personnelController.getDocsByParam(1, 25, data[i].id)
                mtindx = data[i].address.findIndex(x => x.countRow)
                mtdt = data[i].address.splice(mtindx, 1)
                
               }
            res.status(200).json({
                status: "success",
                data: data,
                metadata: metadata[0] 
        }
        );
    })
    .catch((err)=>{
      console.log(err)
      res.status(400).json({
        status: "error",
        data: "",
        metadata: ""
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
router.post("/", async (req, res) => {
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
    await personnelController.createPersonnel( signImport, firstName, secondName, thirdName, sex,
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
                  // await createFio(idPersonnel, element.firstName, element.secondName, element.thirdName, element.date, element.comment, req.user)
                   await personnelController.createFio(idPersonnel, element.firstName, element.secondName, element.thirdName, element.date, element.comment, req.user)
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
                   //await createBorn(idPersonnel, element.date, element.country, element.region, element.area, element.locality, req.user)
                   await personnelController.createBorn(idPersonnel, element.date, element.country, element.region, element.area, element.locality, req.user)
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
                 // await  createDocs(idPersonnel,  element.name, element.serial, element.number, element.dateIssue, element.whoIssue, element.podrIssue, element.active, req.user)
                  await  personnelController.createDocs(idPersonnel,  element.name, element.serial, element.number, element.dateIssue, element.whoIssue, element.podrIssue, element.active, req.user)
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
                   // await  createAddres(idPersonnel,  element.type, element.zipCode, element.country, element.region, element.area, element.city, element.street, element.home, element.struct, element.build, element.appart, req.user)
                    await  personnelController.createAddress(idPersonnel,  element.type, element.zipCode, element.country, element.region, element.area, element.city, element.street, element.home, element.struct, element.build, element.appart, req.user)
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
    personnelController.createPersonnel( signImport, firstName, secondName, thirdName, sex,
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
    
    //createFio(flKey, firstName, secondName, thirdName, date, comment, req.user)
    personnelController.createFio(flKey, firstName, secondName, thirdName, date, comment, req.user)
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
    
    //createBorn(flKey, date, country, region, area, locality, req.user)
    personnelController.createBorn(flKey, date, country, region, area, locality, req.user)
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
    
    //createDocs(flKey, name, serial, number, dateIssue, whoIssue, podrIssue, active, req.user)
    personnelController.createDocs(flKey, name, serial, number, dateIssue, whoIssue, podrIssue, active, req.user)
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
    
    //createAddres(flKey, type, zipCode, country, region, area, city, street, home, struct, build, appart, req.user)
    personnelController.createAddress(flKey, type, zipCode, country, region, area, city, street, home, struct, build, appart, req.user)
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

 personnelController.updatePersonnel(personneltId, signImport, firstName, secondName, thirdName, sex,
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
 personnelController.deletePersonnel(personneltId)
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

 //updateFio(fioId, firstName, secondName, thirdName, date, comment, req.user)
 personnelController.updateFio(fioId, firstName, secondName, thirdName, date, comment, req.user)
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
 
 //deleteFio(fioId)
 personnelController.deleteFio(fioId)
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

 //updateBorn(bornId, date, country, region, area, locality, req.user)
 personnelController.updateBorn(bornId, date, country, region, area, locality, req.user)
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
 
 //deleteBorn(bornId)
 personnelController.deleteBorn(bornId)
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

 //updateDocs(docsId, name, serial, number, dateIssue, whoIssue, podrIssue, active, req.user)
 personnelController.updateDocs(docsId, name, serial, number, dateIssue, whoIssue, podrIssue, active, req.user)
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
 
 //deleteDocs(docsId)
 personnelController.deleteDocs(docsId)
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

 //updateAddress(addressId, type, zipCode, country, region, area, city, street, home, struct, build, appart, req.user)
 personnelController.updateAddress(addressId, type, zipCode, country, region, area, city, street, home, struct, build, appart, req.user)
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
 
 //deleteAddress(addressId)
 personnelController.deleteAddress(addressId)
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

//обновление записи в fl
router.patch("/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Обновить запись о физ.лице'
    */
 const flId = req.params.id
const { signImport, firstName, secondName, thirdName, sex,
            family, snils, inn, organization, department, departmentMCC,
            jobCode, tabNum, accNum, id_kadr} = req.body
    //проверка на наличие полей
    if ( typeof signImport === 'undefined' &&
         typeof firstName === 'undefined' &&
         typeof secondName === 'undefined' &&
         typeof thirdName === 'undefined' &&
          typeof sex === 'undefined' && 
         typeof family === 'undefined' &&
         typeof snils === 'undefined' &&
         typeof inn === 'undefined' &&
         typeof organization === 'undefined' &&
         typeof department === 'undefined' &&
         typeof departmentMCC === 'undefined' &&
         typeof jobCode === 'undefined' &&
         typeof tabNum === 'undefined' &&
         typeof accNum === 'undefined' &&
         typeof id_kadr === 'undefined'
          ){
                return res.status(400).json({
                status: "error",
                data: "Нечего обновлять"
                })
    }

 personnelController.updatePersonnel(flId, signImport, firstName, secondName, thirdName, sex,
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

//удаление Записи fl
router.delete("/:id", (req, res) => {
   /*
    #swagger.tags = ['personnel']
    #swagger.description = 'Удалить запись в таблице физ.лиц'
    */
 const flId = req.params.id
 
 personnelController.deletePersonnel(flId)
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

//Показать персонал подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['personnel']
       #swagger.description = 'Просмотр персонала подробно'
  */
  const personnelId = req.params.id;
  personnelController.getOnePersonnel(personnelId)
  .then((data) => {
    res.status(200).json({
      status: "success",
      data: data
    })
  })
  .catch((err)=>{
    console.log(err)
    res.status(400).json({
      status: "error",
      data: ""
    })
  })

});

module.exports = router