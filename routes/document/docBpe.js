const express = require("express");
const router = express.Router();

const docBpeController = require("../../controllers/document/docBpe.js")

//получение всех результатов БФО
router.get("/", (req, res) => { 
  /* #swagger.tags = ['document']
       #swagger.description = 'Показ всех результатов БФО'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  docBpeController.get(page, perpage, sort).then((data) => {
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

//Поиск результатов БФО
router.get("/search", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Поиск результатов БФО'
    */
 
  const {page, perpage, docKey, flKey, dateExam, typeControl, dateInput, radionuclideKey, material, consist, sort } = req.query;
  //console.log(`${organization}, ${typeDocument},\n ${typeExam}, ${dateDocument}, \n ${numberDocument}, ${dateExam}`)
      docBpeController.getByParam(page, perpage, docKey, flKey, dateExam, typeControl, dateInput, radionuclideKey, material, consist, sort ).then((data) => {
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

//Показать результатов БФО подробно
router.get("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Просмотр результатов БФО подробно'
  */
  const docBpeId = req.params.id;
  docBpeController.getOne(docBpeId)
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

//создание результатов БФО
router.post("/", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Создание записи'
  */
 const { docKey, flKey, dateExam, typeControl, dateInput, radionuclideKey, material, consist } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof docKey === 'undefined' || 
    typeof flKey === 'undefined' || 
    typeof dateExam === 'undefined' || 
    typeof typeControl === 'undefined' || 
    typeof radionuclideKey === 'undefined' || 
    typeof material === 'undefined'|| 
    typeof consist === 'undefined'
 ){
    return res.status(400).json({
    status: "error",
    data: "Не хватает docKey, flKey, dateExam, typeControl, radionuclideKey, material или consist"
  })
}
docBpeController.create(docKey, flKey, dateExam, typeControl, dateInput, radionuclideKey, material, consist, req.user)
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

//обновление результатов БФО
router.patch("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Обновление записи'
  */
 const docBpeId = req.params.id
 const { docKey, flKey, dateExam, typeControl, dateInput, radionuclideKey, material, consist } = req.body;

 if (typeof docKey === 'undefined' && 
    typeof flKey === 'undefined' && 
    typeof dateExam === 'undefined' && 
    typeof typeControl === 'undefined' && 
    typeof dateInput === 'undefined' && 
    typeof radionuclideKey === 'undefined' && 
    typeof material === 'undefined' && 
    typeof consist === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 docBpeController.update(docBpeId, docKey, flKey, dateExam, typeControl, dateInput, radionuclideKey, material, consist, req.user)
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

//удаление результатов БФО
router.delete("/:id", (req, res) => {
    /* #swagger.tags = ['document']
       #swagger.description = 'Удаление записи'
  */
 const docBpeId = req.params.id
 docBpeController.delete(docBpeId)
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