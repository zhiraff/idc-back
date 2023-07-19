  /**  
  * @swagger
  * components:
  *   schemas:
  *     auth_login:
  *       properties:
  *         status:
  *           type: string
  *         sessionId:
  *           type: string
  *     auth_signup:
  *       properties:
  *         status:
  *           type: string
  *         user:
  *           username: string
  *           password: string
  *           role: integer
  *           firstName: string
  *           secondName: string
  *           thirdName: string
  *           createdBy: string
  *           updatedBy: string
  *     auth_whoami:
  *       properties:
  *         username:
  *           type: string
  *         role:
  *           type: string

  */
  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: API для авторизации
   * /api/v1/auth/login:
   *   post:
   *     summary: Авторизация
   *     tags: [Auth]
   *     requestBody:
   *       description: Поля для атворизации
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *             required:
   *               - username
   *               - password
   *     responses:
   *       '200':
   *         description: Авторизован успешно
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/auth_login'
   *             example:
   *               status: success
   *               sessionId: ID сессии который можно использовать в последующих запросах
   *       '400':
   *         description: Логин или пароль не верны
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/auth_login'
   *             example:
   *               status: error
   *               sessionId: 
   * /api/v1/auth/logout:
   *   post:
   *     summary: Выход
   *     tags: [Auth]
   * /api/v1/auth/signup:
   *   post:
   *     summary: Регистрация нового пользователя (временно)
   *     tags: [Auth]
   *     requestBody:
   *       description: Регистрация пользователя (временно)
   *       required: true
   *       content:
   *         application/x-www-form-urlencoded:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *               role:
   *                 type: integer
   *               name:
   *                 type: string
   *               surname:
   *                 type: string
   *               patronym:
   *                 type: string
   *             required:
   *               - username
   *               - password
   *     responses:
   *       '200':
   *         description: Пользователь создан
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/auth_signup'
   *             example:
   *               status: success
   *               user:
   *                 username: username
   *                 password: password
   *                 role: rl
   *                 firstName: nm
   *                 secondName: srn
   *                 thirdName: ptr
   *                 createdBy: usr
   *                 updatedBy: usr
   *                 
   *       '400':
   *         description: Ошибка введённых данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/auth_signup'
   *             example:
   *               status: error
   *               user: 
   * /api/v1/auth/whoami:
   *   get:
   *     summary: Проверка атворизован ли пользователь
   *     tags: [Auth]
   *     responses:
   *       '200':
   *         description: Выполнено успешно
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/auth_whoami'
   *             example:
   *               username: admin
   *               role: Администратор АС
   */
require("dotenv").config();
const knex = require("../knex_init");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const passport = require('passport');
const LocalStrategy = require('passport-local');
//const LocalApiKeyStrategy = require('passport-localapikey');
const alg = "sha256"; // алгоритм хеширования
const enc = "hex"; // кодировка вычесленного хеша

//ф-я хэширования пароля
const hash = (d) => {
  let myhash = crypto.createHash(alg);
  myhash.update(d);
  return myhash.digest(enc);
};

//ф-я поиска пользователя по username
const findUserByUsername = async (username) => {
  return knex("users").first("id", "username", "password", "role").where({ username: username });
};

//ф-я поиска пользователя по sessionId
const findUserBySessionId = async (sessionId) => {
  return knex("sessions").first("sid", "sess", "expired").where({ sid: sessionId })
  .catch((err) => {
    console.log(err)
    return 'Error';
  })
  .then((data) => {
    if (typeof data === 'undefined') {
      return 'Anonymous';
    } else {
      return data.sess.passport.user.username;
    }
  });
};

//ф-я поиска роли по id
const findRoleById = async (RoleId) => {
  return knex("roles").first("id", "name").where({ id: RoleId })
  .catch((err) => {
    console.log(err)
    return 'Error';
  })
  .then((data) => {
    if (typeof data === 'undefined') {
      return 'Anonymous';
    } else {
      return data.name;
    }
  });
};

//ф-я созадния пользователя
const createUser = async (username, password, role, name, surname, patronym, user) => {
  const usr = typeof user !== 'undefined' && user !== '' ? user : 'anonymous'
  const nm = typeof  name !== 'undefined' && name !== '' ? name : 'anonymous'
  const srn = typeof  surname !== 'undefined' && surname !== '' ? surname : 'anonymous'
  const ptr = typeof  patronym !== 'undefined' && patronym !== '' ? patronym : 'anonymous'
  const rl = typeof  role !== 'undefined' && role !== '' ? role : '3'
  const newUser = {
    username: username,
    password: hash(password),
    role: rl,
    firstName: nm,
    secondName: srn,
    thirdName: ptr,
    createdBy: usr,
    updatedBy: usr,
  };
  try {
    await knex("users").insert(newUser);
    newUser['password'] = password
    return newUser;
  } catch (err) {
    return 'err';
  }
};

//ф-я описывает стратегию аутентификации local
const strategy = new LocalStrategy(function verify(username, password, cb) {
    const user = findUserByUsername(username)
    .catch((err) => {
        return cb(err)
    })
    .then((data) => {
      if (typeof data === 'undefined'){
            return cb(null, false)
      }else {
        if (data.password != hash(password)){
            return cb(null, false)
        }
        return cb(null, data)
      }

    })
    
});

//добавим описанную стратегию к пасспорту
passport.use('local', strategy)
//passport.use(strategyapi)

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

//вход
router.post('/login', passport.authenticate('local', {
//  successRedirect: '/',
  failureRedirect: '/auth/errorlogin'
}), async (req, res) => {

    res.cookie("sessionId", req.sessionID, { httpOnly: true }).status(200).json({
      'status': 'success',
      'sessionId': req.sessionID
    });
});

router.get('/errorlogin', async(req, res) => {
    res.status(400).json({
      'status': 'error',
      'sessionid': ''
    })
});

//выход
router.post('/logout', function(req, res, next) {
  res.clearCookie("sessionId")
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({
      'status': 'ok'
    })
  });
});

//регистрация
router.post("/signup", async (req, res) => {
  const { username, password, role, name, surname, patronym } = req.body;
    result = await createUser(username, password, role, name, surname, patronym, req.user);
  if (result === 'err') {
    res.status(400).json({
      "status": "error",
      "user": ''
    });
  }else {
    res.status(202).json({
      "status": "success",
      "user": result
    })
  }
});

//регистрация
router.get("/whoami", async (req, res) => {
  let username = ''
  let role = ''
  //console.log(req.isAuthenticated())
  if (req.isAuthenticated()){
    //ищем свой токен в куках
    if (typeof req.cookies.sessionId === 'undefined'){
    //в куках нет, ищем в заголовках
    if (typeof req.headers.sessionid !== 'undefined'){
      //в заголовках есть
      username = await findUserBySessionId(req.headers.sessionid)
    }else{
      //нигде нет
      username = await findUserBySessionId('')
    }
  }else{
    //в куках есть
    username = await findUserBySessionId(req.cookies.sessionId)
  }
      if (username === 'Anonymous') {
        role = "Anonymous"
      }else{
        const roleid = await findUserByUsername(username)
        role = await findRoleById(roleid.role)
      }
  } else {
    username = 'Anonymous'
    role = "Anonymous"
  }
 res.status(200).json({
  "username": username,
  "role": role
 })
});
module.exports = router