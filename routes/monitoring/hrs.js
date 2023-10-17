const express = require("express");
const router = express.Router();

const hrsController = require("../../controllers/monitoring/hrs.js")

//получение всех результатов СИЧ
router.get("/", (req, res) => { 
  /* #swagger.tags = ['monitoring']
       #swagger.description = 'Показ резльтатов СИЧ'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  hrsController.get(page, perpage, sort).then((data) => {
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

//получение только последних результатов СИЧ
router.get("/last", (req, res) => { 
    /* #swagger.tags = ['monitoring']
         #swagger.description = 'Показ только последних резльтатов СИЧ'
    */
    const page = req.query.page;
    const perpage = req.query.perpage;
    const sort = req.query.sort;
    hrsController.getLast(page, perpage, sort).then((data) => {
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

//Поиск результатов СИЧ
router.get("/search", (req, res) => {
    /* #swagger.tags = ['monitoring']
       #swagger.description = 'Поиск результатов СИЧ'
  */
 
  //const page = req.query.page;
  // perpage = req.query.perpage;
  const { page, perpage, accNum, firstName, secondName, thirdName, 
    workOrganization, dateExam, radionuclide, 
    kindIdc, docOrganization, docDate, docNumber, beginPeriod, endPeriod, 
    bodyPart, consist, sort } = req.query;
  //const sort = req.query.sort;
  hrsController.getByParam(page, perpage, accNum, firstName, secondName, thirdName, 
    workOrganization, dateExam, radionuclide, 
    kindIdc, docOrganization, docDate, docNumber, beginPeriod, endPeriod, 
    bodyPart, consist, sort).then((data) => {
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