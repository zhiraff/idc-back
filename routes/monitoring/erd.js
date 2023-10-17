const express = require("express");
const router = express.Router();

const erdController = require("../../controllers/monitoring/erd.js")

//получение всех ОЭД
router.get("/", (req, res) => { 
  /* #swagger.tags = ['monitoring']
       #swagger.description = 'Показ ОЭД'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const sort = req.query.sort;
  erdController.get(page, perpage, sort).then((data) => {
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

//получение только последних ОЭД
router.get("/last", (req, res) => { 
    /* #swagger.tags = ['monitoring']
         #swagger.description = 'Показ только последних ОЭД'
    */
    const page = req.query.page;
    const perpage = req.query.perpage;
    const sort = req.query.sort;
    erdController.getLast(page, perpage, sort).then((data) => {
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

//Поиск ОЭД
router.get("/search", (req, res) => {
    /* #swagger.tags = ['monitoring']
       #swagger.description = 'Поиск ОЭД'
  */
 
  const page = req.query.page;
  const perpage = req.query.perpage;
  const { accNum, workOrganization, dateCalculate, erd,
    docOrganization, docDate, docNumber } = req.query;
  const sort = req.query.sort;
  erdController.getByParam(page, perpage, accNum, workOrganization, dateCalculate, erd,
    docOrganization, docDate, docNumber, sort).then((data) => {
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