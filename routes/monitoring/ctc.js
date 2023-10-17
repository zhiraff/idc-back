const express = require("express");
const router = express.Router();

const ctcController = require("../../controllers/monitoring/ctc.js")

//получение всех результатов Хелатотерапии
router.get("/", (req, res) => { 
  /* #swagger.tags = ['monitoring']
       #swagger.description = 'Показ резльтатов Хелатотерапии'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  ctcController.get(page, perpage, sort).then((data) => {
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

//получение только последних результатов Хелатотерапии
router.get("/last", (req, res) => { 
    /* #swagger.tags = ['monitoring']
         #swagger.description = 'Показ только последних резльтатов Хелатотерапии'
    */
    const page = req.query.page;
    const perpage = req.query.perpage;
    const sort = req.query.sort;
    ctcController.getLast(page, perpage, sort).then((data) => {
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

//Поиск результатов Хелатотерапии
router.get("/search", (req, res) => {
    /* #swagger.tags = ['monitoring']
       #swagger.description = 'Поиск результатов Хелатотерапии'
  */
 
  const page = req.query.page;
  const perpage = req.query.perpage;
  const { accNum, workOrganization, dateExam, radionuclide, 
    docOrganization, docDate, docNumber, beginPeriod, endPeriod, material, consist } = req.query;
  const sort = req.query.sort;
  ctcController.getByParam(page, perpage, accNum, workOrganization, dateExam, radionuclide, 
    docOrganization, docDate, docNumber, beginPeriod, endPeriod, material, consist, sort).then((data) => {
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

module.exports = router