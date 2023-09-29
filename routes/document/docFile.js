const express = require("express")
const router = express.Router()

const docFileController = require("../../controllers/document/docFiles.js")

const uploadDocument = docFileController.upload

router.post('/test', uploadDocument.single('filescan'), function (req, res, next) {
    // #swagger.tags = ['document']
    // #swagger.description = 'Загрузка скан-файла'
    // req.file - файл `avatar`
    // req.body сохранит текстовые поля, если они будут
    let testfile = req.file
    console.log(testfile) 
    //console.log(next) 
    res.status(200).send(`файл загружен`);
    //next()
  })

  module.exports = router