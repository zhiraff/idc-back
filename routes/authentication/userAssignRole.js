const express = require("express");
const router = express.Router();

const userAssignRoleController = require("../../controllers/authentication/userAssignRole.js")

//получение всех назначений ролей для пользователей
router.get("/", (req, res) => { 
  /* #swagger.tags = ['auth']
       #swagger.description = 'Показ всех назначений ролей для пользователей'
  */

  const { page, perpage, sort } = req.query;
  userAssignRoleController.get(page, perpage, sort).then((data) => {
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

//Поиск назначений ролей для пользователей
router.get("/search", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Поиск назначений ролей для пользователей'
  */
  const { page, perpage, userKey, roleKey, roleNameShort, sort } = req.query;
      userAssignRoleController.getByParam(page, perpage, userKey, roleKey, roleNameShort, sort).then((data) => {
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

//Показать назначения ролей для пользователей подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Просмотр записи подробно'
  */
  const userAssignRoleId = req.params.id;
  userAssignRoleController.getOne(userAssignRoleId)
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

//создание назначений ролей для пользователей
router.post("/", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Создание записи'
  */
 const { userKey, roleKey } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof userKey === 'undefined' || 
    typeof roleKey === 'undefined' ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает userKey, или roleKey"
  })
}
userAssignRoleController.create(userKey, roleKey, req.user)
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

//обновление назначений ролей для пользователей
router.patch("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Обновление записи'
  */
 const userAssignRoleId = req.params.id
 const {userKey, roleKey} = req.body;

 if (typeof userKey === 'undefined' && 
    typeof roleKey === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 userAssignRoleController.update(userAssignRoleId, userKey, roleKey, req.user)
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

//удаление назначений ролей для пользователей
router.delete("/:id", (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Удаление записи'
  */
 const userAssignRoleId = req.params.id
 userAssignRoleController.delete(userAssignRoleId)
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