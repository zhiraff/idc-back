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

/*  
    @swagger
    tags:
      name: Radionuclides
      description: API для работы со справочником перечень радионуклидов
    /Radionuclides:
      get:
        summary: Просмотр всех радионуклидов
        tags: [Radionuclides]
     responses:
        200:
          description: Просмотр всех радионуклидов
            content:
              application/json:
                schema:
                  type: array
                items:
                  $ref: '#/components/schemas/Radionuclide'
     post:
       summary: Создание нового радионуклида
       tags: [Radionuclides]
       requestBody:
         required: true
         content:
           application/json:
             schema:
               $ref: '#/components/schemas/Radionuclides'
       responses:
         200:
           description: Радионуклид добавлен.
           content:
             application/json:
               schema:
                 $ref: '#/components/schemas/Radionuclides'
         500:
           description: Ошибка сервера
   /Radionuclides/{id}:
     get:
       summary: Просмотр радионуклида по id
       tags: [Radionuclides]
       parameters:
         - in: path
           name: id
           schema:
             type: string
           required: true
           description: id радионуклида
       responses:
         200:
           description: радионуклид найденный по id
           contens:
             application/json:
               schema:
                 $ref: '#/components/schemas/Radionuclides'
         404:
           description: радионуклид не найден
     put:
       summary: Обновление радионуклида по id
       tags: [Radionuclides]
       parameters:
         - in: path
           name: id
           schema:
             type: string
           required: true
           description: id радионуклида
       requestBody:
         required: true
         content:
           application/json:
             schema:
               $ref: '#/components/schemas/Radionuclides'
       responses:
         200:
           description: радионуклид обновлён
           content:
             application/json:
               schema:
                 $ref: '#/components/schemas/Radionuclides'
         404:
           description: радионуклид не найден
         500:
           description: Ошибка сервера
      delete:
        summary: Удаление радионуклида по id
        tags: [Radionuclides]
        parameters:
          - in: path
            name: id
            schema:
              type: string
            required: true
            description: id радионуклида
  
        responses:
          200:
            description: радионуклид удалён
          404:
            description: радионуклид не найден
  */
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

//Методы работы с радионуклидами
//Получить список радионуклидов, с постраничной пагинацией
const getRadionuclide = async (page, perpage) => {
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
  return knex("radionuclide").select().limit(prpg).offset((pg-1)*25)
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
    data: "nothing to create"
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
    data: "nothing to update"
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