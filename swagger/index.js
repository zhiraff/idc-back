const auth = require('express-rbac/lib')
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
  tags: [
    {
      name: 'auth',
      description: 'Контроллер для аутентификации'
    },
    {
      name: 'bodyPart',
      description: 'Справочник "Части тела и органы человека"'
    },
    {
      name: 'department',
      description: 'Справочник "Перечень кодов подразделений и их наименование"'
    },
    {
      name: 'kindIdc',
      description: 'Справочник "Виды ИДК"'
    },
    {
      name: 'limitValue',
      description: 'Справочник "Контрольные числовые значения поступления/содержания радионуклидов"'
    },
    {
      name: 'profession',
      description: 'Справочник "Перечень должностей/профессий"'
    },
    {
      name: 'radionuclide',
      description: 'Справочник "Перечень радионуклидов"'
    },
    {
      name: 'user',
      description: 'Справочник "Пользователи АС"'
    },
    {
      name: 'personnel',
      description: 'Контроллируемый персонал'
    },
    {
      name: 'role',
      description: 'Справочник ролей'
    },
    {
      name: 'document',
      description: 'Работа с документами поступающими в ОРБ'
    },
  ],
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
