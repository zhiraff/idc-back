const express = require("express")
const router = express.Router()
const docFileController = require("../../controllers/document/docFiles.js")
const { reject } = require("lodash")

const uploadDocument = docFileController.upload

router.post('/:docheaderId', uploadDocument.single('filescan'), function (req, res, next) {
    // #swagger.tags = ['document']
    // #swagger.description = 'Загрузка скан-файла'
    /*
     #swagger.consumes = ['multipart/form-data'] 
     #swagger.parameters['filescan'] = {
      in: 'formData',
      type: 'file',
      required: 'true',
      description: 'Some description...',
      }
      */
    // req.file - файл `avatar`
    // req.body сохранит текстовые поля, если они будут
    let saveFile = req.file
    const docHeaderId = req.params.docheaderId;
    docFileController.save(docHeaderId, saveFile, req.user)
    .then(data => {
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

  })

  //получение всех загруженных файлов для документа
router.get("/all/:id_docHeader", (req, res) => { 
  /*   #swagger.tags = ['document']
       #swagger.description = 'Показ всех файлов для конкретного документа по id_docHeader'
  */
  const page = req.query.page;
  const perpage = req.query.perpage;
  const id_docHeader = req.params.id_docHeader;
  docFileController.getAllByDocId(page, perpage, id_docHeader).then((data) => {
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

//Загрузка файла на АРМ
router.get("/:id", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Загрузка файла на АРМ'
*/
const docFileId = req.params.id;
docFileController.download(docFileId)
.then((data) => {
  if(typeof data === 'undefined'){
  
    res.status(400).json({
      status: "error",
      data: "Файл не найден"
    })
  }else{
    res.download(data.pathSave, data.originalName)
    // метод senfile для превью

    /*
    const options = {
      root: process.cwd(),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
    res.sendFile(data.pathSave, options)
    */
  }

})
.catch((err)=>{
  console.log(err)
  res.status(400).json({
    status: "error",
    data: "Файл не найден"
  })
})
});

//отправка в ответ (для превью например)
router.get("/preview/:id", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Получение содержимого файла для превью. (Осторожно swagger может крашнуться!)'
     #swagger.produces = ['application/pdf']
  */
const docFileId = req.params.id;
docFileController.download(docFileId)
.then((data) => {
  if(typeof data === 'undefined'){
  
    res.status(400).json({
      status: "error",
      data: "Файл не найден"
    })
  }else{
    const options = {
      root: process.cwd(),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
        'Content-Type': data.mimetype
      }
    }
    //console.log(options)
    //console.log(data)
    res.sendFile(data.pathSave, options, (err)=>{
      if (err) {
        console.log('error preview file')
        next(err)
      } else {
        console.log('Sent:', data.originalName)
      }
    })
  }

})
.catch((err)=>{
  console.log(err)
  res.status(400).json({
    status: "error",
    data: "Файл не найден"
  })
})
});

//Показать информацию о загруженном файле подробно
router.get("/info/:id", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Просмотр информацию о загруженном файле подробно'
*/
const docFileId = req.params.id;
docFileController.getOneById(docFileId)
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


//удаление всех файлов по id_dochead
router.delete("/all/:id_dochead", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Удаление всех файлов по id_dochead'
*/
const id_dochead = req.params.id_dochead
docFileController.deleteByHeader(id_dochead)
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

//удаление файла по id
router.delete("/:id", (req, res) => {
  /* #swagger.tags = ['document']
     #swagger.description = 'Удаление файла по id'
*/
const docFileId = req.params.id
docFileController.deleteById(docFileId)
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