/*  
   @swagger
   components:
     schemas:
       Users:
         type: object
         required:
           - username
           - password
         properties:
           id:
             type: integer
             description: id пользователя
           username:
             type: string
             description: имя пользователя
           firstName:
             type: string
             description: Имя
           secondName:
             type: string
             description: Фамилия
           thirdName:
             type: string
             description: Отчество
           role:
             type: string
             description: Роль
         example:
           id: 1
           username: admin
           firstName: Тимофей
           secondName: Пиголев
           thirdName: Валерьевич
           role: administrator
     securitySchemes:
       cookieAuth:
         type: apiKey
         in: cookie
         name: JSESSIONID
   security:
     - cookieAuth: []
  */
/*  
   @swagger
   tags:
     name: Users
     description: API для работы с пользователями АС
   /users:
     get:
       security:
         - cookieAuth: []
       summary: Просмотр всех пользователей
       tags: [Users]
       responses:
         200:
           description: Просмотр всех пользователей
           content:
             application/json:
               schema:
                 type: array
                 items:
                   $ref: '#/components/schemas/Users'
     post:
       summary: Создание нового пользователя
       tags: [Users]
       requestBody:
         required: true
         content:
           application/json:
             schema:
               $ref: '#/components/schemas/Users'
       responses:
         200:
           description: id созданного пользователя
           content:
             application/json:
               schema:
                 $ref: '#/components/schemas/Users'
         500:
           description: ошибка сервера
   /users/{id}:
     get:
       summary: Просмотр пользователя по id
       tags: [Users]
       parameters:
         - in: path
           name: id
           schema:
             type: string
           required: true
           description: id пользователя
       responses:
         200:
           description: Пользователь найденный по id
           contens:
             application/json:
               schema:
                 $ref: '#/components/schemas/Users'
         404:
           description: Пользователь не найден
     put:
      summary: Обновление пользователя по id
      tags: [Users]
      parameters:
        - in: path
          name: id
          schema:
            type: string
          required: true
          description: id пользователя
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Users'
      responses:
        200:
          description: Пользователб обновлён
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Users'
        404:
          description: Пользователь не найден
        500:
          description: Ошибка сервера
     delete:
       summary: Удаление пользователя по id
       tags: [Users]
       parameters:
         - in: path
           name: id
           schema:
             type: string
           required: true
           description: id пользователя
  
       responses:
         200:
           description: Пользователь удалён
         404:
           description: Пользователь не найден
  */