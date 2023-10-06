const express = require("express");
const router = express.Router();

const permissionController = require("../../controllers/authentication/permission.js")

//получение всех прав
router.get("/", (req, res) => { 
  /* #swagger.tags = ['auth']
       #swagger.description = 'Показ всех прав'
  */

  const { page, perpage, sort } = req.query;
  permissionController.get(page, perpage, sort).then((data) => {
    let metaindex = data.findIndex(x => x.countRow)
    let metadata = data.splice(metaindex, 1)
      res.status(200).json({
        status: "success",
        data: data,
        metadata: metadata[0]
        }
        );
    })
    .catch((err)=>{
      console.log(err)
      res.status(400).json({
        status: "error",
        data: "",
        metadata: ""
      })
    })
  
});

//Поиск прав
router.get("/search", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Поиск прав'
  */
  const { page, perpage, name, codeName, tableName, sort } = req.query;
      permissionController.getByParam(page, perpage, name, codeName, tableName, sort).then((data) => {
      let metaindex = data.findIndex(x => x.countRow)
      let metadata = data.splice(metaindex, 1)
      res.status(200).json({
        status: "success",
        data: data,
        metadata: metadata[0] 
        }
        );
    })
    .catch((err)=>{
      console.log(err)
      res.status(400).json({
        status: "error",
        data: "",
        metadata: ""
      })
    })

});

//Показать право подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Просмотр записи подробно'
  */
  const permissionId = req.params.id;
  permissionController.getOne(permissionId)
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

//создание права
router.post("/", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Создание записи'
  */
 const { name, codeName, tableName } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof name === 'undefined' || 
    typeof codeName === 'undefined' || 
    typeof tableName === 'undefined' ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает name, codeName или tableName"
  })
}
permissionController.create(name, codeName, tableName, req.user)
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

//обновление права
router.patch("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Обновление записи'
  */
 const permissionId = req.params.id
 const {name, codeName, tableName} = req.body;

 if (typeof name === 'undefined' && 
    typeof codeName === 'undefined' && 
    typeof tableName === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 permissionController.update(permissionId, name, codeName, tableName, req.user)
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

//удаление права
router.delete("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Удаление записи'
  */
 const permissionId = req.params.id
 permissionController.delete(permissionId)
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