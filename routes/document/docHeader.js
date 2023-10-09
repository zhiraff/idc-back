const express = require("express");
const router = express.Router();

const docHeaderController = require("../../controllers/document/docHeader.js")

//получение все заголовки документа
router.get("/", (req, res) => { 
  /* #swagger.tags = ['document']
       #swagger.description = 'Показ все заголовки документа'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  docHeaderController.get(page, perpage, sort).then((data) => {
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

//Поиск заголовка документа
router.get("/search", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Поиск заголовка документа'
  */
 
  const {page, perpage, organization, typeDocument, typeExam, dateDocument, numberDocument, beginPeriod, endPeriod, sort } = req.query;
  //console.log(`${organization}, ${typeDocument},\n ${typeExam}, ${dateDocument}, \n ${numberDocument}, ${dateExam}`)
      docHeaderController.getByParam(page, perpage, organization, typeDocument, typeExam, dateDocument, numberDocument, beginPeriod, endPeriod, sort).then((data) => {
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

//Показать заголовка документа подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Просмотр заголовка документа подробно'
  */
  const docHeaderId = req.params.id;
  docHeaderController.getOne(docHeaderId)
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

//создание заголовка документа
router.post("/", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Создание записи'
  */
 const { organization, typeDocument, typeExam, dateDocument, numberDocument, beginPeriod, endPeriod } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof organization === 'undefined' || 
    typeof typeDocument === 'undefined' || 
    typeof typeExam === 'undefined' || 
    typeof dateDocument === 'undefined' || 
    typeof numberDocument === 'undefined'// || 
 //   typeof dateExam === 'undefined'
 ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает organization, typeDocument, typeExam, dateDocument или numberDocument"
  })
}
docHeaderController.create(organization, typeDocument, typeExam, dateDocument, numberDocument, beginPeriod, endPeriod, req.user)
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

//обновление заголвка документа
router.patch("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Обновление записи'
  */
 const docHeaderId = req.params.id
 const { organization, typeDocument, typeExam, dateDocument, numberDocument, beginPeriod, endPeriod } = req.body;

 if (typeof organization === 'undefined' && 
    typeof typeDocument === 'undefined' && 
    typeof typeExam === 'undefined' && 
    typeof dateDocument === 'undefined' && 
    typeof numberDocument === 'undefined' && 
    typeof beginPeriod === 'undefined'&& 
    typeof endPeriod === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 docHeaderController.update(docHeaderId, organization, typeDocument, typeExam, dateDocument, numberDocument, beginPeriod, endPeriod, req.user)
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

//удаление заголовка документа
router.delete("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Удаление записи'
  */
 const docHeaderId = req.params.id
 docHeaderController.delete(docHeaderId)
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