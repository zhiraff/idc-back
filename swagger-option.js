const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Swagger для АС ИДК. ФЯО ФГУП ГХК, ДИТ 2023 г.",
      version: "0.1.0",
      description:
        "Базовый адрес: host:port/api/v1/ ",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Тимофей Валерьевич П",
        url: "https://yandex.ru",
        email: "tvpigolev@sibghk.ru",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Основной сервер для работы",
        basePath: "/api/v1/"
      },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = options