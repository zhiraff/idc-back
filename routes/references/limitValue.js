//require("dotenv").config();
//const knex = require("../../knex_init");
const express = require("express");
const router = express.Router();

const limitValueController = require("../../controllers/references/limitValue.js")
/*
//Методы работы с контрольными значениями
//Получить контрольных значений, с постраничной пагинацией
const getValue = async (page, perpage, sort) => {
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
  return knex("limitValue").select().orderBy(sortField, sortDirect).limit(prpg).offset((pg-1)*prpg)
}

//Получить контрольные значения, с постраничной пагинацией и параметрами
const getValueParam = async (page, perpage, radionuclide_id, indicator, value, gister, sort) => {
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
  let queryObject = {}
  if (typeof radionuclide_id !== 'undefined'){
    queryObject['radionuclide_id'] = radionuclide_id
  }
    if (typeof indicator !== 'undefined'){
    queryObject['indicator'] = indicator
  }
    if (typeof value !== 'undefined'){
    queryObject['value'] = value
  }
    if (typeof gister !== 'undefined'){
    queryObject['gister'] = gister
  }

  return knex("limitValue").select()
  .orderBy(sortField, sortDirect)
  .where(queryObject)
  .limit(prpg).offset((pg-1)*prpg)
}

//Показать предельное значение подробно
const getOneValue = async(valueId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("limitValue").first().where({ id: valueId })
}

//Создать предельное значение
const creatValue = async(radionuclide_id, indicator, value, gister, user) => {
  const newValue = {
    radionuclide_id: Number(radionuclide_id),
    value: Number(value),
    indicator: typeof indicator !== 'undefined' ? indicator : "",
    gister: typeof gister !== 'undefined' ? Number(gister) : 0,
    createdBy: typeof user !== 'undefined' ? user : "unknown",
    updatedBy: typeof user !== 'undefined' ? user : "unknown",
  };
  await knex("limitValue").insert([newValue]);
  return newValue;
}

// обновление контрольного значения
 const updateValue = async (valueId, radionuclide_id, indicator, value, gister, user) => {
    let updateObject = {}
    if (typeof radionuclide_id !== 'undefined'){
    updateObject['radionuclide_id'] = radionuclide_id
  }
  if (typeof indicator !== 'undefined'){
    updateObject['indicator'] = indicator
  }
    if (typeof value !== 'undefined'){
    updateObject['value'] = value
  }
    if (typeof gister !== 'undefined'){
    updateObject['gister'] = gister
  }
      if (typeof user !== 'undefined'){
    updateObject['updatedBy'] = user
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("limitValue")
    .where({ id: valueId })
    .update(updateObject);
 }

 //удаление значения
 const deleteValue = async (valueId) => {
  return knex("limitValue").where({ id: valueId }).del()
 }
*/
//запросы api
//получение всех значений
router.get("/", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
    limitValueController.get(page, perpage, sort).then((data) => {
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

//Поиск Значений
router.get("/search", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  const radionuclide_id = req.query.radionuclide_id;
  const value = req.query.value;
  const gister = req.query.gister;
  const indicator = req.query.indicator;
  const sort = req.query.sort;
  //console.log(req.user)
        limitValueController.getByParam(page, perpage, radionuclide_id, indicator, value, gister, sort).then((data) => {
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

//Показать значение подробно
router.get("/:id", (req, res) => {
  const valueId = req.params.id;
  limitValueController.getOne(valueId)
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

//создание значения
router.post("/", (req, res) => {
 const { radionuclide_id, indicator, value, gister } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof radionuclide_id === 'undefined' || 
    typeof value === 'undefined' || 
    typeof indicator === 'undefined'){
    return res.status(400).json({
    status: "error",
    data: "Не хватает radionuclide_id, value или indicator"
  })
}
  limitValueController.create(radionuclide_id, indicator, value, gister, req.user)
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

//обновление Значения
router.patch("/:id", (req, res) => {
 const valueId = req.params.id
 const {radionuclide_id, indicator, value, gister} = req.body;

 if (typeof radionuclide_id === 'undefined' && 
    typeof indicator === 'undefined' &&
    typeof value === 'undefined' && 
    typeof gister === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 limitValueController.update(valueId, radionuclide_id, indicator, value, gister, req.user)
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

//удаление значения
router.delete("/:id", (req, res) => {
 const valueId = req.params.id

 limitValueController.delete(valueId)
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