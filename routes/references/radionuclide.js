/**  
*   @swagger
*   components:
*     schemas:
*       Radionuclide:
*         type: object
*         required:
*           - symbol
*           - name
*         properties:
*           id:
*             type: integer
*             description: id радионуклида
*           symbol:
*             type: string
*             description: Символьное название радионуклида
*           name:
*             type: string
*             description: Название радионуклида
*           htmlcode:
*             type: string
*             description: html-код для вставки названия
*         example:
*           id: 1
*           symbol: U238
*           name: Изотоп урана 238
*           htmlcode: U<sup>238</sup>
*  */

//require("dotenv").config();
//const knex = require("../../knex_init");
const express = require("express");
const router = express.Router();

const radionuclideController = require("../../controllers/references/radionuclide.js")

//запросы api
//получение всех радионуклидов
router.get("/", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  //console.log(req.user)
    radionuclideController.get(page, perpage, sort).then((data) => {
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

//поиск радионуклидов
router.get("/search", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  const symbol = req.query.symbol;
  const name = req.query.name;
  const htmlcode = req.query.htmlcode;
  const sort = req.query.sort;
  //console.log(req.user)
    //getRadionuclide(page, perpage).then((data) => {
      radionuclideController.getByParam(symbol, name, htmlcode, page, perpage, sort).then((data) => {
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

//Показать радионуклид подробно
router.get("/:id", (req, res) => {
  const radionuclideId = req.params.id;
  radionuclideController.getOne(radionuclideId)
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

//создание радионуклида
router.post("/", (req, res) => {

 const { symbol, name, htmlcode } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof symbol === 'undefined' && typeof name === 'undefined' && typeof htmlcode === 'undefined'){
    return res.status(400).json({
    status: "error",
    data: "Нечего создавать"
  })
}
  radionuclideController.create(symbol, name, htmlcode, req.user)
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

//обновление радионуклида
router.patch("/:id", (req, res) => {
 const radionuclideId = req.params.id
 const {symbol, name, htmlcode} = req.body;
// console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
 if (typeof symbol === 'undefined' && typeof name === 'undefined' && typeof htmlcode === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 radionuclideController.update(radionuclideId, symbol, name, htmlcode, req.user)
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

//удаление радионуклида
router.delete("/:id", (req, res) => {
 const radionuclideId = req.params.id

 radionuclideController.delete(radionuclideId)
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