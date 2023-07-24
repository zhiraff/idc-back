/**  
*   @swagger
*   components:
*     schemas:
*       profession:
*         type: object
*         required:
*           - code
*           - name
*         properties:
*           id:
*             type: integer
*             description: id Профессии
*           code:
*             type: integer
*             description: Код профессии
*           name:
*             type: string
*             description: Название Профессии
*           division:
*             type: string
*             description: Раздел (Профессии/должности)
*           controlNumber:
*               type: integer
*               description: Контрольное число
*           etks_category:
*               type: string
*               description: Код по ЕТКС либо категория
*           okz:
*               type: strin
*               description: Код по ОКЗ (Общерос. классиф. занятий) (и такое бывает)
*         example:
*           id: 6388
*           code: 22824
*           name: Инженер-программист
*           division: Должности служащих
*           controlNumber: 3
*           etks_category: 2
*           okz: 2132
*  */
require("dotenv").config();
const knex = require("../knex_init");
const express = require("express");
const router = express.Router();

//Методы работы с профессиями
//Получить список профессий, с постраничной пагинацией
const getProfession = async (page, perpage) => {
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
  return knex("profession").select().limit(prpg).offset((pg-1)*prpg)
}

const getProfessionParam = async (page, perpage, division, code, name, okz) => {
  const pg = typeof page !== 'undefined' && page !== '' ? page : 1
  const prpg = typeof perpage !== 'undefined' && perpage !== '' ? perpage : 25
  let queryObject = {}
  if (typeof division !== 'undefined' && division !== ''){
    queryObject['division'] = division
  }
    if (typeof code !== 'undefined' && code !== ''){
    queryObject['code'] = code
  }
    if (typeof name !== 'undefined' && name !== ''){
    queryObject['name'] = name
  }
    if (typeof okz !== 'undefined' && okz !== ''){
    queryObject['okz'] = okz
  }
  //const div = typeof division !== 'undefined' && division !== '' ? division : null
  //const cd = typeof code !== 'undefined' && code !== '' ? code : null
  //const nm = typeof name !== 'undefined' && name !== '' ? name : null
  //const okz = typeof okzz !== 'undefined' && okzz !== '' ? okzz : null
  //console.log(queryObject)
  return knex("profession").select()
  .where(queryObject)
  .limit(prpg).offset((pg-1)*prpg)
}

//Показать профессию подробно
const getOneprofession = async(professionId) => {
  //knex("sessions").first("id", "userId", "sessionId").where({ sessionId: sessionId });
  return knex("profession").first("id", "division", "code", "name", "okz").where({ id: professionId })
}

//Создать профессию
const creatProfession = async(division, code, name, okz, cn, etks, user) => {
  const newProfession = {
    division: division,
    code: Number(code),
    name: name,
    okz: typeof okz !== 'undefined' ? okz : "",
    controlNumber: typeof cn !== 'undefined' ? Number(cn) : 0,
    etks_category: typeof etks !== 'undefined' ? etks : "",
    createdBy: typeof user !== 'undefined' ? user : "",
    updatedBy: typeof user !== 'undefined' ? user : "",
  };
  await knex("profession").insert([newProfession]);
  return newProfession;
}

// обновление профессии
 const updateProfession = async (professionId, division, code, name, okz, cn, etks, user) => {
    let updateObject = {}
  if (typeof division !== 'undefined' && division !== ''){
    updateObject['division'] = division
  }
    if (typeof code !== 'undefined' && code !== ''){
    updateObject['code'] = code
  }
    if (typeof name !== 'undefined' && name !== ''){
    updateObject['name'] = name
  }
    if (typeof okz !== 'undefined' && okz !== ''){
    updateObject['okz'] = okz
  }
      if (typeof cn !== 'undefined'){
    updateObject['controlNumber'] = cn
  }
      if (typeof etks !== 'undefined' && etks !== ''){
    updateObject['etks_category'] = etks
  }
      if (typeof user !== 'undefined' && user !== ''){
    updateObject['updatedBy'] = user
  }else{
    updateObject['updatedBy'] = 'unknown'
  }
   return knex("profession")
    .where({ id: professionId })
    .update(updateObject
);
 }

 //удаление профессии
 const deleteProfession = async (professionId) => {
  return knex("profession").where({ id: professionId }).del()
 }

//запросы api
//получение всех профессий
router.get("/", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  //console.log(req.user)
    getProfession(page, perpage).then((data) => {
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

//Поиск профессии
router.get("/search", (req, res) => {
  const page = req.query.page;
  const perpage = req.query.perpage;
  const division = req.query.division;
  const code = req.query.code;
  const name = req.query.name;
  const okz = req.query.okz;
  //console.log(req.user)
        getProfessionParam(page, perpage, division, code, name, okz).then((data) => {
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

//Показать профессию подробно
router.get("/:id", (req, res) => {
  const professionId = req.params.id;
  getOneprofession(professionId)
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

//создание профессии
router.post("/", (req, res) => {
 const { code, name, division, okz, cn, etks } = req.body;
//console.log(`symbol, name, htmlcode ${symbol}, ${name}, ${htmlcode}`)
if (typeof code === 'undefined' || typeof name === 'undefined'){
    return res.status(400).json({
    status: "error",
    data: "Не хватает code или name"
  })
}
  creatProfession(division, code, name, okz, cn, etks, req.user)
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

//обновление Профессии
router.patch("/:id", (req, res) => {
 const professionId = req.params.id
 const {code, name, division, okz, cn, etks} = req.body;

 if (typeof code === 'undefined' && 
    typeof name === 'undefined' &&
    typeof division === 'undefined' && 
    typeof okz === 'undefined'  && 
    typeof cn === 'undefined'  && 
    typeof etks === 'undefined'){
  return res.status(400).json({
    status: "error",
    data: "Нечего обновлять"
  })
 }
 updateProfession(professionId,  division, code, name, okz, cn, etks, req.user)
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

//удаление профессии
router.delete("/:id", (req, res) => {
 const professionId = req.params.id

 deleteProfession(professionId)
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