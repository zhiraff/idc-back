const express = require("express");
const router = express.Router();

const userController = require("../../controllers/references/user.js")

//запросы api
//получение всех пользователей
router.get("/", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
    userController.get(page, perpage, sort).then((data) => {
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

//Поиск пользователя
router.get("/search", (req, res) => {
   // username, firstName, secondName, thirdName, role
  const page = req.query.page;
  const perpage = req.query.perpage;
  const username = req.query.username;
  const firstName = req.query.firstName;
  const secondName = req.query.secondName;
  const thirdName = req.query.thirdName;
  const role = req.query.role;
  const sort = req.query.sort;
  //console.log(req.user)
        userController.getByParam(page, perpage, username, firstName, secondName, thirdName, role, sort).then((data) => {
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

//Показать пользователя подробно
router.get("/:id", (req, res) => {
  const userId = req.params.id;
  userController.getOne(userId)
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

//создание пользователя
router.post("/", (req, res) => {
// username, password, firstName, secondName, thirdName, role
 const { username, password, firstName, secondName, thirdName, role } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof username === 'undefined' || 
    typeof password === 'undefined' || 
    typeof role === 'undefined'){
    return res.status(400).json({
    status: "error",
    data: "Не хватает username, password или role "
  })
}
  userController.create(username, password, firstName, secondName, thirdName, role, req.user)
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

//обновление пользователя
router.patch("/:id", (req, res) => {
 const userId = req.params.id
 const {username, password, firstName, secondName, thirdName, role } = req.body;

 if (typeof username === 'undefined' && 
    typeof password === 'undefined' &&
    typeof firstName === 'undefined' &&
    typeof secondName === 'undefined' &&
    typeof thirdName === 'undefined' &&
    typeof role === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 userController.update(userId, username, password, firstName, secondName, thirdName, role, req.user)
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

//удаление пользователя
router.delete("/:id", (req, res) => {
 const userId = req.params.id
 userController.delete(userId)
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