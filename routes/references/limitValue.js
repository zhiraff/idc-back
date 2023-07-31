const express = require("express");
const router = express.Router();

const limitValueController = require("../../controllers/references/limitValue.js")

//запросы api
//получение всех значений
router.get("/", (req, res) => {
  /* #swagger.tags = ['limitValue']
       #swagger.description = 'Показать все контрольные значения'
  */
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
    /* #swagger.tags = ['limitValue']
       #swagger.description = 'Поиск контрольных значений'
  */
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
    /* #swagger.tags = ['limitValue']
       #swagger.description = 'Показать контрольное значение подробно'
  */
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
    /* #swagger.tags = ['limitValue']
       #swagger.description = 'Создание записи'
  */
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
    /* #swagger.tags = ['limitValue']
       #swagger.description = 'Обновление записи'
  */
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
    /* #swagger.tags = ['limitValue']
       #swagger.description = 'Удаление записи'
  */
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