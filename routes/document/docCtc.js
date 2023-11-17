const express = require("express");
const router = express.Router();

const docCtcController = require("../../controllers/document/docCtc.js")

//получение всех результатов хелатотерапии
router.get("/", (req, res) => { 
  /* #swagger.tags = ['document']
       #swagger.description = 'Показ всех результатов хелатотерапии'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  docCtcController.get(page, perpage, sort).then((data) => {
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

//Поиск результатов хелатотерапии
router.get("/search", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Поиск результатов хелатотерапии'
    */
 
  const {page, perpage, docKey, flKey, dateExam, typeControlKey, 
    dateInput, radionuclideKey, material, consist, 
    flAccNum, typeControlName, radionuclideName, sort } = req.query;
  //console.log(`${organization}, ${typeDocument},\n ${typeExam}, ${dateDocument}, \n ${numberDocument}, ${dateExam}`)
      docCtcController.getByParam(page, perpage, docKey, flKey, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist, flAccNum, typeControlName, radionuclideName, sort ).then((data) => {
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

//Показать результатов хелатотерапии подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Просмотр результатов хелатотерапии подробно'
  */
  const docCtcId = req.params.id;
  docCtcController.getOne(docCtcId)
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

//создание результатов хелатотерапии
router.post("/", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Создание записи'
  */
 const { docKey, flKey, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
    typeof flKey === 'undefined' || 
    typeof dateExam === 'undefined' || 
    typeof typeControlKey === 'undefined' || 
    typeof radionuclideKey === 'undefined' || 
    typeof material === 'undefined'|| 
    typeof consist === 'undefined'
 ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает docKey, flKey, dateExam, typeControlKey, radionuclideKey, material или consist"
  })
}
docCtcController.create(docKey, flKey, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist, req.user)
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

//обновление результатов хелатотерапии
router.patch("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Обновление записи'
  */
 const docCtcId = req.params.id
 const { docKey, flKey, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist } = req.body;

 if (typeof docKey === 'undefined' && 
    typeof flKey === 'undefined' && 
    typeof dateExam === 'undefined' && 
    typeof typeControlKey === 'undefined' && 
    typeof dateInput === 'undefined' && 
    typeof radionuclideKey === 'undefined' && 
    typeof material === 'undefined' && 
    typeof consist === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 docCtcController.update(docCtcId, docKey, flKey, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist, req.user)
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

//удаление результатов хелатотерапии
router.delete("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Удаление записи'
  */
 const docCtcId = req.params.id
 docCtcController.delete(docCtcId)
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

//создание результатов хелатотерапии по табномер
router.post("/accnum", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Создание записи по accNum'
*/
const { docKey, accNum, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
  typeof accNum === 'undefined' || 
  typeof dateExam === 'undefined' || 
  typeof typeControlKey === 'undefined' || 
  typeof radionuclideKey === 'undefined' || 
  typeof material === 'undefined'|| 
  typeof consist === 'undefined'
){
  return res.status(400).json({
  status: "error",
  data: "Не хватает docKey, accNum, dateExam, typeControlKey, radionuclideKey, material или consist"
})
}
docCtcController.createByAccNum(docKey, accNum, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist, req.user)
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

//создание результатов хелатотерапии по снилс
router.post("/snils", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Создание записи по снилс'
*/
const { docKey, snils, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
  typeof snils === 'undefined' || 
  typeof dateExam === 'undefined' || 
  typeof typeControlKey === 'undefined' || 
  typeof radionuclideKey === 'undefined' || 
  typeof material === 'undefined'|| 
  typeof consist === 'undefined'
){
  return res.status(400).json({
  status: "error",
  data: "Не хватает docKey, snils, dateExam, typeControlKey, radionuclideKey, material или consist"
})
}
docCtcController.createBySnils(docKey, snils, dateExam, typeControlKey, dateInput, radionuclideKey, material, consist, req.user)
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