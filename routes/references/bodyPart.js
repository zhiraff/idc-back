const express = require("express");
const router = express.Router();

const bodyPartController = require("../../controllers/references/bodyPart.js")

//получение всех части тела
router.get("/", (req, res) => { 
  /* #swagger.tags = ['bodyPart']
       #swagger.description = 'Показ всех частей тела'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  bodyPartController.get(page, perpage, sort).then((data) => {
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

//Поиск части тела
router.get("/search", (req, res) => {
    /* #swagger.tags = ['bodyPart']
       #swagger.description = 'Поиск частей тела'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const type = req.query.type;
  const name = req.query.name;
  const sort = req.query.sort;
      bodyPartController.getByParam(page, perpage, type, name, sort).then((data) => {
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

//Показать часть тела подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['bodyPart']
       #swagger.description = 'Просмотр записи подробно'
  */
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
    /* #swagger.tags = ['bodyPart']
       #swagger.description = 'Создание записи'
  */
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
    /* #swagger.tags = ['bodyPart']
       #swagger.description = 'Обновление записи'
  */
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
    /* #swagger.tags = ['bodyPart']
       #swagger.description = 'Удаление записи'
  */
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