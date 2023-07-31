const { join, dirname } = require('path')
const { fileURLToPath } = require('url')
const swaggerAutogen = require('swagger-autogen')(/*options*/)

//const _dirname = dirname(fileURLToPath(import.meta.url))

const doc = {
  info: {
    title: "Swagger для АС ИДК.",
    version: "0.1.0",
    description: " ФЯО ФГУП ГХК, ДИТ 2023 г. ",
    license: {
      name: "ДИТ",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Ссылка на гит",
      url: "https://github.com/zhiraff/idc-back",
    },
  },
  definitions: {
    auth_login: {
      status: 'success',
      sessionId: 'sesion id',
    },

  },
  host: 'localhost:3000',
  schemes: ['http']
}

const outputFile = join(__dirname, 'output.json')
const endpointsFiles = [join(__dirname, '../index.js')]

swaggerAutogen(outputFile, endpointsFiles, doc).then(
  ({ success }) => {
    console.log(`Generated: ${success}`)
  }
)
