const express = require("express");
const router = express.Router();

const docHrsController = require("../../controllers/document/docHrs.js")

//получение всех результатов СИЧ
router.get("/", (req, res) => { 
  /* #swagger.tags = ['document']
       #swagger.description = 'Показ всех результатов СИЧ'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  docHrsController.get(page, perpage, sort).then((data) => {
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

//Поиск результатов СИЧ
router.get("/search", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Поиск результатов СИЧ'
    */
 
  const {page, perpage, docKey, flKey, dateExam, typeControlKey, consist,
    flAccNum, typeControlName, radionuclideName, bodyPartName, sort } = req.query;
  //console.log(`${organization}, ${typeDocument},\n ${typeExam}, ${dateDocument}, \n ${numberDocument}, ${dateExam}`)
    docHrsController.getByParam(page, perpage, docKey, flKey, dateExam, typeControlKey, consist, 
    flAccNum, typeControlName, radionuclideName, bodyPartName, sort ).then((data) => {
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

//Показать результатов СИЧ подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Просмотр результатов СИЧ подробно'
  */
  const docHrsId = req.params.id;
  docHrsController.getOne(docHrsId)
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

//создание результатов СИЧ
router.post("/", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Создание записи'
  */
 const { docKey, flKey, dateExam, typeControlKey, bodyPartKey, radionuclideKey, consist } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
    typeof flKey === 'undefined' || 
    typeof dateExam === 'undefined' || 
    typeof typeControlKey === 'undefined' || 
  //  typeof bodyPartKey === 'undefined'|| 
  //  typeof radionuclideKey === 'undefined' || 
    typeof consist === 'undefined'
 ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает docKey, flKey, dateExam, typeControlKey или consist"
  })
}
docHrsController.create(docKey, flKey, dateExam, typeControlKey, bodyPartKey, radionuclideKey, consist, req.user)
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

//обновление результатов СИЧ
router.patch("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Обновление записи'
  */
 const docHrsId = req.params.id
 const { docKey, flKey, dateExam, typeControlKey, bodyPartKey, radionuclideKey, consist } = req.body;

 if (typeof docKey === 'undefined' && 
    typeof flKey === 'undefined' && 
    typeof dateExam === 'undefined' && 
    typeof typeControlKey === 'undefined' && 
    typeof bodyPartKey === 'undefined' && 
    typeof radionuclideKey === 'undefined' && 
    typeof consist === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 docHrsController.update(docHrsId, docKey, flKey, dateExam, typeControlKey, bodyPartKey, radionuclideKey, consist, req.user)
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

//удаление результатов СИЧ
router.delete("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Удаление записи'
  */
 const docHrsId = req.params.id
 docHrsController.delete(docHrsId)
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

//создание результатов СИЧ по accnum
router.post("/accnum", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Создание записи по accNum'
*/
const { docKey, accNum, dateExam, typeControlKey, bodyPartKey, radionuclideKey, consist } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
  typeof accNum === 'undefined' || 
  typeof dateExam === 'undefined' || 
  typeof typeControlKey === 'undefined' || 
//  typeof bodyPartKey === 'undefined'|| 
//  typeof radionuclideKey === 'undefined' || 
  typeof consist === 'undefined'
){
  return res.status(400).json({
  status: "error",
  data: "Не хватает docKey, accNum, dateExam, typeControlKey или consist"
})
}
docHrsController.createByAccNum(docKey, accNum, dateExam, typeControlKey, bodyPartKey, radionuclideKey, consist, req.user)
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

//создание результатов СИЧ по snils
router.post("/snils", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Создание записи по snils'
*/
const { docKey, snils, dateExam, typeControlKey, bodyPartKey, radionuclideKey, consist } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
  typeof snils === 'undefined' || 
  typeof dateExam === 'undefined' || 
  typeof typeControlKey === 'undefined' || 
//  typeof bodyPartKey === 'undefined'|| 
//  typeof radionuclideKey === 'undefined' || 
  typeof consist === 'undefined'
){
  return res.status(400).json({
  status: "error",
  data: "Не хватает docKey, snils, dateExam, typeControlKey или consist"
})
}
docHrsController.createBySnils(docKey, snils, dateExam, typeControlKey, bodyPartKey, radionuclideKey, consist, req.user)
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