/**  
*   @swagger
*   components:
*     schemas:
*       profession:
*         type: object
*         required:
*           - code
*           - name
*         properties:
*           id:
*             type: integer
*             description: id Профессии
*           code:
*             type: integer
*             description: Код профессии
*           name:
*             type: string
*             description: Название Профессии
*           division:
*             type: string
*             description: Раздел (Профессии/должности)
*           controlNumber:
*               type: integer
*               description: Контрольное число
*           etks_category:
*               type: string
*               description: Код по ЕТКС либо категория
*           okz:
*               type: strin
*               description: Код по ОКЗ (Общерос. классиф. занятий) (и такое бывает)
*         example:
*           id: 6388
*           code: 22824
*           name: Инженер-программист
*           division: Должности служащих
*           controlNumber: 3
*           etks_category: 2
*           okz: 2132
*  */
//require("dotenv").config();
const knex = require("../../knex_init");
const express = require("express");
const router = express.Router();

const professionController = require("../../controllers/references/profession.js")

//запросы api
//получение всех профессий
router.get("/", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  //console.log(req.user)
    professionController.get(page, perpage, sort).then((data) => {
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

//Поиск профессии
router.get("/search", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  const division = req.query.division;
  const code = req.query.code;
  const name = req.query.name;
  const okz = req.query.okz;
  const sort = req.query.sort;
  //console.log(req.user)
        professionController.getByParam(page, perpage, division, code, name, okz, sort).then((data) => {
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

//Показать профессию подробно
router.get("/:id", (req, res) => {
  const professionId = req.params.id;
  professionController.getOne(professionId)
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

//создание профессии
router.post("/", (req, res) => {
 const { code, name, division, okz, cn, etks } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof code === 'undefined' || typeof name === 'undefined'){
    return res.status(400).json({
    status: "error",
    data: "Не хватает code или name"
  })
}
  professionController.create(division, code, name, okz, cn, etks, req.user)
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

//обновление Профессии
router.patch("/:id", (req, res) => {
 const professionId = req.params.id
 const {code, name, division, okz, cn, etks} = req.body;

 if (typeof code === 'undefined' && 
    typeof name === 'undefined' &&
    typeof division === 'undefined' && 
    typeof okz === 'undefined'  && 
    typeof cn === 'undefined'  && 
    typeof etks === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 professionController.update(professionId,  division, code, name, okz, cn, etks, req.user)
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

//удаление профессии
router.delete("/:id", (req, res) => {
 const professionId = req.params.id

 professionController.delete(professionId)
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