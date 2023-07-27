const express = require("express");
const router = express.Router();

const departmentController = require("../../controllers/references/department.js")

//запросы api
//получение всех подразделения
router.get("/", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
    departmentController.get(page, perpage, sort).then((data) => {
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

//Поиск подразделения
router.get("/search", (req, res) => {
   // parent_id, begin, end, code, name, department_item_id, full_name, address
  const page = req.query.page;
  const perpage = req.query.perpage;
  const parent_id = req.query.parent_id;
  const begin = req.query.begin;
  const end = req.query.end;
  const code = req.query.code;
  const name = req.query.name;
  const department_item_id = req.query.department_item_id;
  const full_name = req.query.full_name;
  const address = req.query.address;
  const sort = req.query.sort;
  //console.log(req.user)
        departmentController.getByParam(page, perpage, parent_id, begin, end, code, name, department_item_id, full_name, address, sort).then((data) => {
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

//Показать подразделения подробно
router.get("/:id", (req, res) => {
  const departmentId = req.params.id;
  departmentController.getOne(departmentId)
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

//создание подразделения
router.post("/", (req, res) => {
// parent_id, begin, end, code, name, department_item_id, full_name, address
 const { parent_id, begin, end, code, name, department_item_id, full_name, address } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof begin === 'undefined' || 
    typeof code === 'undefined' || 
    typeof name === 'undefined'){
    return res.status(400).json({
    status: "error",
    data: "Не хватает begin, code или name "
  })
}
  departmentController.create(parent_id, begin, end, code, name, department_item_id, full_name, address, req.user)
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

//обновление подразделения
router.patch("/:id", (req, res) => {
 const departmentId = req.params.id
 const {parent_id, begin, end, code, name, department_item_id, full_name, address } = req.body;

 if (typeof parent_id === 'undefined' && 
    typeof begin === 'undefined' &&
    typeof end === 'undefined' &&
    typeof code === 'undefined' &&
    typeof name === 'undefined' &&
    typeof department_item_id === 'undefined' &&
    typeof full_name === 'undefined' &&
    typeof address === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 departmentController.update(departmentId, parent_id, begin, end, code, name, department_item_id, full_name, address, req.user)
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

//удаление подразделения
router.delete("/:id", (req, res) => {
 const departmentId = req.params.id

 departmentController.delete(departmentId)
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