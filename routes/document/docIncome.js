const express = require("express");
const router = express.Router();

const docIncomeController = require("../../controllers/document/docIncome.js")

//получение всех поступлений радионуклидов
router.get("/", (req, res) => { 
  /* #swagger.tags = ['document']
       #swagger.description = 'Показ всех поступлений радионуклидов'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  docIncomeController.get(page, perpage, sort).then((data) => {
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

//Поиск поступлений радионуклидов
router.get("/search", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Поиск поступлений радионуклидов'
    */
 
  const {page, perpage, docKey, flKey, radionuclideKey, dateIncome, value,
     radionuclideName, flAccNum, sort } = req.query;
  //console.log(`${organization}, ${typeDocument},\n ${typeExam}, ${dateDocument}, \n ${numberDocument}, ${dateExam}`)
      docIncomeController.getByParam(page, perpage, docKey, flKey, radionuclideKey, dateIncome, value,
        radionuclideName, flAccNum, sort ).then((data) => {
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

//Показать поступления радионуклидов подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Просмотр поступлений радионуклидов подробно'
  */
  const docIncomeId = req.params.id;
  docIncomeController.getOne(docIncomeId)
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

//создание поступление радионуклида
router.post("/", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Создание записи'
    */
 const { docKey, flKey, radionuclideKey, dateIncome, value } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
    typeof flKey === 'undefined' || 
    typeof radionuclideKey === 'undefined'
 ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает docKey, flKey или radionuclideKey"
  })
}
docIncomeController.create(docKey, flKey, radionuclideKey, dateIncome, value, req.user)
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

//обновление поступления радионуклида
router.patch("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Обновление записи'
  */
 const docIncomeId = req.params.id
 const { docKey, flKey, radionuclideKey, dateIncome, value } = req.body;

 if (typeof docKey === 'undefined' && 
    typeof flKey === 'undefined' && 
    typeof radionuclideKey === 'undefined' && 
    typeof dateIncome === 'undefined' && 
    typeof value === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 docIncomeController.update(docIncomeId, docKey, flKey, radionuclideKey, dateIncome, value, req.user)
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

//удаление поступления радионуклида
router.delete("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Удаление записи'
  */
 const docIncomeId = req.params.id
 docIncomeController.delete(docIncomeId)
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

//создание поступление радионуклида по accnum
router.post("/accnum", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Создание записи по accnum'
*/
const { docKey, accNum, radionuclideKey, dateIncome, value } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
  typeof accNum === 'undefined' || 
  typeof radionuclideKey === 'undefined'
){
  return res.status(400).json({
  status: "error",
  data: "Не хватает docKey, accNum или radionuclideKey"
})
}
docIncomeController.createByAccNum(docKey, accNum, radionuclideKey, dateIncome, value, req.user)
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

//создание поступление радионуклида по snils
router.post("/snils", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Создание записи по snils'
*/
const { docKey, snils, radionuclideKey, dateIncome, value } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
  typeof snils === 'undefined' || 
  typeof radionuclideKey === 'undefined'
){
  return res.status(400).json({
  status: "error",
  data: "Не хватает docKey, snils или radionuclideKey"
})
}
docIncomeController.createBySnils(docKey, snils, radionuclideKey, dateIncome, value, req.user)
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