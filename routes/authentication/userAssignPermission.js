const express = require("express");
const router = express.Router();

const userAssignPermissionController = require("../../controllers/authentication/userAssignPermission.js")

//получение всех назначений прав для пользователей
router.get("/", (req, res) => { 
  /* #swagger.tags = ['auth']
       #swagger.description = 'Показ всех назначений прав для пользователей'
  */

  const { page, perpage, sort } = req.query;
  userAssignPermissionController.get(page, perpage, sort).then((data) => {
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

//Поиск назначений прав для пользователей
router.get("/search", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Поиск назначений прав для пользователей'
  */
  const { page, perpage, userKey, permKey, permCodeName, sort } = req.query;
      userAssignPermissionController.getByParam(page, perpage, userKey, permKey, permCodeName, sort).then((data) => {
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

//Показать назначения прав для пользователей подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Просмотр записи подробно'
  */
  const userAssignPermissionId = req.params.id;
  userAssignPermissionController.getOne(userAssignPermissionId)
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

//создание назначений прав для пользователей
router.post("/", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Создание записи'
  */
 const { userKey, permKey } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof userKey === 'undefined' || 
    typeof permKey === 'undefined' ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает userKey, или permKey"
  })
}
userAssignPermissionController.create(userKey, permKey, req.user)
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

//обновление назначений прав для пользователей
router.patch("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Обновление записи'
  */
 const userAssignPermissionId = req.params.id
 const {userKey, permKey} = req.body;

 if (typeof userKey === 'undefined' && 
    typeof permKey === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 userAssignPermissionController.update(userAssignPermissionId, userKey, permKey, req.user)
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

//удаление назначений прав для пользователей
router.delete("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Удаление записи'
  */
 const userAssignPermissionId = req.params.id
 userAssignPermissionController.delete(userAssignPermissionId)
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