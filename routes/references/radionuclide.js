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
const knex = require("../../knex_init");
const express = require("express");
const router = express.Router();

//Методы работы с радионуклидами
//Получить список радионуклидов, с постраничной пагинацией
const getRadionuclide = async (page, perpage, sort) => {
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
      let sortField = 'id'
  let sortDirect = 'asc'
  if (typeof sort !== 'undefined'){
    if (sort.startsWith('-')){
      sortField = sort.slice(1)
      sortDirect = 'desc'
    }else{
      sortField = sort
    }
  }
  return knex("radionuclide").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
}

//Получить список радионуклидов, с по различным параметрам
const getRadionuclideParam = async (symbol, name, htmlcode, page, perpage, sort) => {
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
      let sortField = 'id'
  let sortDirect = 'asc'
  if (typeof sort !== 'undefined'){
    if (sort.startsWith('-')){
      sortField = sort.slice(1)
      sortDirect = 'desc'
    }else{
      sortField = sort
    }
  }
  queryObject = {}
  if (typeof symbol !== 'undefined'){
    queryObject['symbol'] = symbol
  }
  if (typeof name !== 'undefined'){
    queryObject['name'] = name
  }
    if (typeof htmlcode !== 'undefined'){
    queryObject['htmlcode'] = htmlcode
  }

  return knex("radionuclide").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject).limit(prpg)
  .offset((pg-1)*prpg)
}
//Показать радионуклид подробно
const getOneRadionuclide = async(radionuclideId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("radionuclide").first().where({ id: radionuclideId })
}

//Создать радионуклид
const creatRadionuclide = async(symbol, name, htmlcode, user) => {
  const newRadionuclide = {
    symbol: symbol,
    name: name,
    htmlcode: typeof htmlcode !== 'undefined' ? htmlcode : "",
    createdBy: typeof user !== 'undefined' ? user : "unknown",
    updatedBy: typeof user !== 'undefined' ? user : "unknown",
  };
  await knex("radionuclide").insert([newRadionuclide]);
  return newRadionuclide;
}
// обновление радионуклида
 const updateRadionuclide = async (radionuclideId, symbol, name, htmlcode, user) => {
  const usr = typeof user !== 'undefined' ? user : "unknown"
  let updateObject = {}
  if (typeof symbol !== 'undefined'){
    updateObject['symbol'] = symbol
  }

  if (typeof name !== 'undefined'){
    updateObject['name'] = name
  }

  if (typeof htmlcode !== 'undefined'){
    updateObject['htmlcode'] = htmlcode
  }
  updateObject['updateBy'] = usr
   return knex("radionuclide")
    .where({ id: radionuclideId })
    .update(updateObject);
/*
    .update({
      symbol: symbol,
      name: name,
      htmlcode: htmlcode,
      updatedBy: usr
    });
    */
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
  const sort = req.query.sort;
  //console.log(req.user)
    getRadionuclide(page, perpage, sort).then((data) => {
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
      getRadionuclideParam(symbol, name, htmlcode, page, perpage, sort).then((data) => {
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
// console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
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