require("dotenv").config();
const express = require("express");
const router = express.Router();

const authController = require("../../controllers/authentication/auth")

//вход
router.post('/login', authController.passport.authenticate('local', {
//  successRedirect: '/',
  failureRedirect: '/api/v1/auth/errorlogin'
}), async (req, res) => {
    /* #swagger.tags = ['auth']
       #swagger.description = 'Авторизация'
       #swagger.parameters['username'] ={
        in: 'formData',
        description: 'Login пользователя',
        required: 'true',
        type: 'string'
       }
        #swagger.parameters['password'] = {
        in: 'formData',
        description: 'Пароль',
        required: 'true',
        type: 'string'
       }
       #swagger.responses[200] = {
        description: 'Авторизация прошла успешно',
        schema: { $ref: '#/definitions/auth_login' }
       }
       #swagger.responses[400] = {
        description: 'Ошибка авторизации',
        schema: {
          status: 'error',
          sessionId: ''
        }  
      }
        
        */
    res.cookie("sessionId", req.sessionID, { httpOnly: true }).status(200).json({
      'status': 'success',
      'sessionId': req.sessionID
    });
});

router.get('/errorlogin', async(req, res) => {
  // #swagger.tags = ['auth']
  //#swagger.ignore = true
    res.status(400).json({
      'status': 'error',
      'sessionid': ''
    })
});

//выход
router.post('/logout', function(req, res, next) {
  // #swagger.tags = ['auth']
      // #swagger.description = 'Выход'
    /* #swagger.responses[200] = {
      description: 'успешно',
  } */
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
  /*    
        #swagger.tags = ['auth']
        #swagger.description = 'Регистрация нового пользователя (временно)'
       #swagger.responses[200] = {
      description: 'успешно'
  } 
  */
  const { username, password, role, name, surname, patronym } = req.body;
    result = await authController.createUser(username, password, role, name, surname, patronym, req.user);
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

//ктоя, его зовут ктоя, это ктоя.
router.get("/whoami", async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.description = 'Кто я'

  let username = ''
  let roles = ''
  let permissions = []
  //let perm = new Set();
  //console.log(req.isAuthenticated())
  if (req.isAuthenticated()){
    //ищем свой токен в куках
    if (typeof req.cookies.sessionId === 'undefined'){
    //в куках нет, ищем в заголовках
    if (typeof req.headers.sessionid !== 'undefined'){
      //в заголовках есть
      username = await authController.findUserBySessionId(req.headers.sessionid)
    }else{
      //нигде нет
      username = await authController.findUserBySessionId('')
    }
  }else{
    //в куках есть
    username = await authController.findUserBySessionId(req.cookies.sessionId)
  }
      if (username === 'Anonymous') {
        roles = "Anonymous"
        permissions = ["login", "whoami"]
      }else{
        //const roleid = await authController.findUserByUsername(username)
        const usr = await authController.findUserByUsername(username)
        roles = await authController.userRoles(usr.id)
        let perm1 = await authController.userPermission(req.user.id)
        let perm2 = await authController.rolePermissionByUserId(req.user.id)
        permissions = Array.from(new Set(perm1.concat(perm2))) 
      }

  } else {
    username = 'Anonymous'
    roles = "Anonymous",
    permissions = ["login", "whoami"]
  }
 res.status(200).json({
  "username": username,
  "roles": roles,
  "permissions": permissions
 })
});
module.exports = router