const express = require("express");
const router = express.Router();

const roleAssignPermissionController = require("../../controllers/authentication/roleAssignPermission.js")

//получение всех назначений прав для ролей
router.get("/", (req, res) => { 
  /* #swagger.tags = ['auth']
       #swagger.description = 'Показ всех назначений прав для ролей'
  */

  const { page, perpage, sort } = req.query;
  roleAssignPermissionController.get(page, perpage, sort).then((data) => {
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

//Поиск назначений прав для ролей
router.get("/search", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Поиск назначений прав для ролей'
  */
  const { page, perpage, roleKey, permKey, permCodeName, sort } = req.query;
      roleAssignPermissionController.getByParam(page, perpage, roleKey, permKey, permCodeName, sort).then((data) => {
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

//Показать назначения прав для ролей подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Просмотр записи подробно'
  */
  const roleAssignPermissionId = req.params.id;
  roleAssignPermissionController.getOne(roleAssignPermissionId)
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

//создание назначений прав для ролей
router.post("/", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Создание записи'
  */
 const { roleKey, permKey } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof roleKey === 'undefined' || 
    typeof permKey === 'undefined' ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает roleKey, или permKey"
  })
}
roleAssignPermissionController.create(roleKey, permKey, req.user)
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

//обновление назначений прав для ролей
router.patch("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Обновление записи'
  */
 const roleAssignPermissionId = req.params.id
 const {roleKey, permKey} = req.body;

 if (typeof roleKey === 'undefined' && 
    typeof permKey === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 roleAssignPermissionController.update(roleAssignPermissionId, roleKey, permKey, req.user)
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

//удаление назначений прав для ролей
router.delete("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Удаление записи'
  */
 const roleAssignPermissionId = req.params.id
 roleAssignPermissionController.delete(roleAssignPermissionId)
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