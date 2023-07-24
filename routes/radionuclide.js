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

require("dotenv").config();
const knex = require("../knex_init");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const passport = require('passport');
const LocalStrategy = require('passport-local');
//const LocalApiKeyStrategy = require('passport-localapikey');
const alg = "sha256"; // алгоритм хеширования
const enc = "hex"; // кодировка вычесленного хеша
//const secure = require('rbac/controllers/express'); //middleware для rbac
//const rbac = require('../rbac_init')  //сам rbac

//Методы работы с радионуклидами
//Получить список радионуклидов, с постраничной пагинацией
const getRadionuclide = async (page, perpage) => {
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
  return knex("radionuclide").select().limit(prpg).offset((pg-1)*prpg)
}
//Показать радионуклид подробно
const getOneRadionuclide = async(radionuclideId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("radionuclide").first("id", "name", "symbol").where({ id: radionuclideId })
}

//Создать радионуклид
const creatRadionuclide = async(symbol, name, htmlcode, user) => {
  const newRadionuclide = {
    symbol: symbol,
    name: name,
    htmlcode: typeof htmlcode !== 'undefined' ? htmlcode : "",
    createdBy: typeof user !== 'undefined' ? user : "",
    updatedBy: typeof user !== 'undefined' ? user : "",
  };
  await knex("radionuclide").insert([newRadionuclide]);
  return newRadionuclide;
}
// обновление радионуклида
 const updateRadionuclide = async (radionuclideId, symbol, name, htmlcode, user) => {
  const usr = typeof user !== 'undefined' ? user : ""
   return knex("radionuclide")
    .where({ id: radionuclideId })
    .update({
      symbol: symbol,
      name: name,
      htmlcode: htmlcode,
      updatedBy: usr
    });
 }

 //удаление радионуклида
 const deleteRadionuclide = async (radionuclideId) => {
  return knex("radionuclide").where({ id: radionuclideId }).del()
 }

//запросы api
//получение всех радионуклидов
router.get("/", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  console.log(req.user)
    getRadionuclide(page, perpage).then((data) => {
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
  getOneRadionuclide(radionuclideId)
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
  creatRadionuclide(symbol, name, htmlcode, req.user)
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
 console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
 if (typeof symbol === 'undefined' && typeof name === 'undefined' && typeof htmlcode === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 updateRadionuclide(radionuclideId, symbol, name, htmlcode, req.user)
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

 deleteRadionuclide(radionuclideId)
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