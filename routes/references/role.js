const express = require("express");
const router = express.Router();

const roleController = require("../../controllers/references/role.js")

//получение всех ролей
router.get("/", (req, res) => { 
  /* #swagger.tags = ['role']
       #swagger.description = 'Показ всех ролей'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  roleController.get(page, perpage, sort).then((data) => {
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

//Поиск роли
router.get("/search", (req, res) => {
    /* #swagger.tags = ['role']
       #swagger.description = 'Поиск роли'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const name = req.query.name;
  const name_plural = req.query.name_plural;
  const name_short = req.query.name_short;
  const sort = req.query.sort;
  roleController.getByParam(page, perpage, name, name_plural, name_short, sort).then((data) => {
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

//Показать роль подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['role']
       #swagger.description = 'Просмотр записи подробно'
  */
  const roleId = req.params.id;
  roleController.getOne(roleId)
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

//создание роли
router.post("/", (req, res) => {
    /* #swagger.tags = ['role']
       #swagger.description = 'Создание роли'
  */
 const { name, name_plural, name_short } = req.body;

//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof name === 'undefined' && 
    typeof name_plural === 'undefined' &&
    typeof name_short === 'undefined'
    ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает name или name_plural или name_short"
  })
}
roleController.create(name, name_plural, name_short, req.user)
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
    /* #swagger.tags = ['role']
       #swagger.description = 'Обновление записи'
  */
 const roleId = req.params.id
 const { name, name_plural, name_short } = req.body;

 if (typeof name === 'undefined' && 
    typeof name_plural === 'undefined' &&
    typeof name_short === 'undefined'
    ){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 roleController.update(roleId, name, name_plural, name_short, req.user)
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
    /* #swagger.tags = ['role']
       #swagger.description = 'Удаление записи'
  */
 const roleId = req.params.id
 roleController.delete(roleId)
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