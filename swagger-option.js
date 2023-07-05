const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Swagger для АС ИДК.",
      version: "0.1.0",
      description:
        " ФЯО ФГУП ГХК, ДИТ 2023 г.  ",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Ссылка на гит",
        url: "https://github.com/zhiraff/idc-back",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "/api/v1/",
        basePath: "/api/v1/"
      },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = options