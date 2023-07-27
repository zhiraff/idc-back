//require("dotenv").config();
//const knex = require("../../knex_init");
const express = require("express");
const router = express.Router();

const bodyPartController = require("../../controllers/references/bodyPart.js")

//получение всех части тела
router.get("/", (req, res) => { 
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  bodyPartController.get(page, perpage, sort).then((data) => {
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

//Поиск части тела
router.get("/search", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  const type = req.query.type;
  const name = req.query.name;
  const sort = req.query.sort;
         bodyPartController.getByParam(page, perpage, type, name, sort).then((data) => {
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

//Показать части тела подробно
router.get("/:id", (req, res) => {
  const bodypartId = req.params.id;
  bodyPartController.getOne(bodypartId)
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

//создание части тела
router.post("/", (req, res) => {
 const { type, name } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof type === 'undefined' || 
    typeof name === 'undefined' ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает type, или name"
  })
}
bodyPartController.create(type, name, req.user)
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

//обновление части тела
router.patch("/:id", (req, res) => {
 const bodypartId = req.params.id
 const {type, name} = req.body;

 if (typeof type === 'undefined' && 
    typeof name === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 bodyPartController.update(bodypartId, type, name, req.user)
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

//удаление части тела
router.delete("/:id", (req, res) => {
 const bodypartId = req.params.id
 bodyPartController.delete(bodypartId)
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