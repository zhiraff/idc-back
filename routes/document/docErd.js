const express = require("express");
const router = express.Router();

const docErdController = require("../../controllers/document/docErd.js")

//получение всех ОЭД
router.get("/", (req, res) => { 
  /* #swagger.tags = ['document']
     #swagger.description = 'Показ всех ОЭД'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  docErdController.get(page, perpage, sort).then((data) => {
    let metaindex = data.findIndex(x => x.countRow)
    let metadata = data.splice(metaindex, 1)
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
  
});

//Поиск ОЭД
router.get("/search", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Поиск ОЭД'
    */
  const {page, perpage, docKey, flKey, dateIncome, beginPeriod, endPeriod, dose, sort } = req.query;
      docErdController.getByParam(page, perpage, docKey, flKey, dateIncome, beginPeriod, endPeriod, dose, sort ).then((data) => {
      let metaindex = data.findIndex(x => x.countRow)
      let metadata = data.splice(metaindex, 1)
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

});

//Показать ОЭД подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Просмотр ОЭД подробно'
  */
  const docErdId = req.params.id;
  docErdController.getOne(docErdId)
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

//создание ОЭД
router.post("/", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Создание записи'
  */
 const { docKey, flKey, dateIncome, beginPeriod, endPeriod, dose } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
    typeof flKey === 'undefined' || 
    typeof beginPeriod === 'undefined' || 
    typeof endPeriod === 'undefined' || 
    typeof dose === 'undefined' || 
    typeof dateIncome === 'undefined'
 ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает docKey, flKey, beginPeriod, dateIncome, endPeriod, или dose"
  })
}
docErdController.create(docKey, flKey, dateIncome, beginPeriod, endPeriod, dose, req.user)
  .then((result) => {
    res.status(200).json({
      status: "success",
      data: result
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

//обновление ОЭД
router.patch("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Обновление записи'
  */
 const docErdId = req.params.id
 const { docKey, flKey, dateIncome, beginPeriod, endPeriod, dose } = req.body;

 if (typeof docKey === 'undefined' && 
    typeof flKey === 'undefined' && 
    typeof beginPeriod === 'undefined' && 
    typeof endPeriod === 'undefined' && 
    typeof dose === 'undefined' && 
    typeof dateIncome === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 docErdController.update(docErdId, docKey, flKey, dateIncome, beginPeriod, endPeriod, dose, req.user)
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

//удаление ОЭД
router.delete("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Удаление записи'
  */
 const docErdId = req.params.id
 docErdController.delete(docErdId)
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

//создание ОЭД по accnum
router.post("/accnum", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Создание записи по accnum'
*/
const { docKey, accNum, dateIncome, beginPeriod, endPeriod, dose } = req.body;

if (typeof docKey === 'undefined' || 
  typeof accNum === 'undefined' || 
  typeof beginPeriod === 'undefined' || 
  typeof endPeriod === 'undefined' || 
  typeof dose === 'undefined' || 
  typeof dateIncome === 'undefined'
){
  return res.status(400).json({
  status: "error",
  data: "Не хватает docKey, accNum, dateIncome, beginPeriod, endPeriod, или dose"
})
}
docErdController.createByAccNum(docKey, accNum, dateIncome, beginPeriod, endPeriod, dose, req.user)
.then((result) => {
  res.status(200).json({
    status: "success",
    data: result
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

//создание ОЭД по snils
router.post("/snils", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Создание записи по снилс'
*/
const { docKey, snils, dateIncome, beginPeriod, endPeriod, dose } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
  typeof snils === 'undefined' || 
  typeof beginPeriod === 'undefined' || 
  typeof endPeriod === 'undefined' || 
  typeof dose === 'undefined' || 
  typeof dateIncome === 'undefined'
){
  return res.status(400).json({
  status: "error",
  data: "Не хватает docKey, snils, dateIncome, beginPeriod, endPeriod, или dose"
})
}
docErdController.createBySnils(docKey, snils, dateIncome, beginPeriod, endPeriod, dose, req.user)
.then((result) => {
  res.status(200).json({
    status: "success",
    data: result
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