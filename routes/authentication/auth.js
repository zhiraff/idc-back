require("dotenv").config();
const express = require("express");
const router = express.Router();

const authController = require("../../controllers/authentication/auth")

//вход
router.post('/login', authController.passport.authenticate('local', {
//  successRedirect: '/',
  failureRedirect: '/api/v1/auth/errorlogin'
}), async (req, res) => {
  //console.log("success login")
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
      res.status(200).json({
      'status': 'success',
      'sessionId': req.sessionID
    });
});

router.get('/errorlogin', async(req, res) => {
  // #swagger.tags = ['auth']
  //#swagger.ignore = true
  console.log("errr login")
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
  //res.clearCookie("sessionId")
  /*
  req.session.destroy(function(err) {
    if (err) { return next(err);
      
     }
     res.clearCookie('connect.sid');
    res.status(200).json({
      'status': 'ok'
    })
  });
  */
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
  const { username, password, name, surname, patronym } = req.body;
    result = await authController.createUser(username, password, name, surname, patronym, req.user);
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
  if (typeof req.user.username !== 'undefined'){
        username = req.user.username
        const usr = await authController.findUserByUsername(req.user.username)
        roles = await authController.userRoles(usr.id)
        let perm1 = await authController.userPermission(usr.id)
        let perm2 = await authController.rolePermissionByUserId(usr.id)
        permissions = Array.from(new Set(perm1.concat(perm2))) 
  } else {
    console.log(req.user.username)
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