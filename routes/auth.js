
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
  return knex("users").first("id", "username", "password").where({ username: username });
};

//ф-я созадния пользователя
const createUser = async (username, password, role, name, surname, patronym, user) => {
  const usr = typeof user !== 'undefined' ? user : 'anonymous'
  const nm = typeof  name !== 'undefined' ? name : 'anonymous'
  const srn = typeof  surname !== 'undefined' ? surname : 'anonymous'
  const ptr = typeof  patronym !== 'undefined' ? patronym : 'anonymous'
  const newUser = {
    username: username,
    password: hash(password),
    role: role,
    createdBy: usr,
    updatedBy: usr,
    firstName: nm,
    secondName: srn,
    thirdName: ptr
  };
  try {
    await knex("users").insert(newUser);
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
        if (data.password != hash(password)){
            return cb(null, false)
        }
        return cb(null, data)
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
  failureRedirect: '/auth'
}), async (req, res) => {

    //res.cookie("sessionId", req.sessionID, { httpOnly: true }).status(200).json({
    //  'sessionId': req.sessionID
   // });
    res.status(200).json({
      'sessionId': req.sessionID
    });

});
// корневой /auth - заглушка
router.get('/', async(req, res) => {
    res.send('ok /auth/');
});

//выход
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//регистрация
router.post("/signup", async (req, res) => {
  const { username, password, role, name, surname, patronym } = req.body;
    result = await createUser(username, password, role, name, surname, patronym, req.user);

  if (result === 'err') {
    res.status(400).json({
      "message": "Some error"
    });
  }else {
    res.status(202).redirect("/");
  }
  
  //console.log(result)
  //res.status(202).redirect("/");
});
module.exports = router