
const knex = require("../../knex_init");
const express = require("express");
const router = express.Router();

const kindIdcController = require("../../controllers/references/kindIdc.js")

//запросы api
//получение всех виды ИДК
router.get("/", (req, res) => {
      /* #swagger.tags = ['kindIdc']
       #swagger.description = 'Показ всех видов ИДК'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
    kindIdcController.get(page, perpage, sort).then((data) => {
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
  
});

//Поиск виды ИДК
router.get("/search", (req, res) => {
        /* #swagger.tags = ['kindIdc']
       #swagger.description = 'Поиск видов ИДК'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const type = req.query.type;
  const kind = req.query.kind;
  const kindShort = req.query.kindShort;
  const sort = req.query.sort;
  //console.log(req.user)
        kindIdcController.getByParam(page, perpage, type, kind, kindShort, sort).then((data) => {
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
});

//Показать виды ИДК подробно
router.get("/:id", (req, res) => {
        /* #swagger.tags = ['kindIdc']
       #swagger.description = 'Показать запись подробно'
  */
  const kindidcId = req.params.id;
  kindIdcController.getOne(kindidcId)
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

//создание виды ИДК
router.post("/", (req, res) => {
          /* #swagger.tags = ['kindIdc']
       #swagger.description = Создать новую запись'
  */
 const { type, kind, kindShort } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof type === 'undefined' || 
    typeof kind === 'undefined' || 
    typeof kindShort === 'undefined'){
    return res.status(400).json({
    status: "error",
    data: "Не хватает type, kind или kindShort "
  })
}
  kindIdcController.create(type, kind, kindShort, req.user)
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

//обновление виды ИДК
router.patch("/:id", (req, res) => {
          /* #swagger.tags = ['kindIdc']
       #swagger.description = 'Обновить запись'
  */
 const kindidcId = req.params.id
 const {type, kind, kindShort} = req.body;

 if (typeof type === 'undefined' && 
    typeof kind === 'undefined' &&
    typeof kindShort === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 kindIdcController.update(kindidcId, type, kind, kindShort, req.user)
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

//удаление виды ИДК
router.delete("/:id", (req, res) => {
          /* #swagger.tags = ['kindIdc']
       #swagger.description = 'Удалить запись'
  */
 const kindidcId = req.params.id

 kindIdcController.delete(kindidcId)
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