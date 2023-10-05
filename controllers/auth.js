
const knex = require("../knex_init");
const crypto = require("crypto");
const passport = require('passport');
const LocalStrategy = require('passport-local');
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
    const result = await knex("users").insert(newUser, "id");
    newUser['password'] = password
    newUser['id'] = result[0].id
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

//ф-я сбора ролей пользователя
const userRoles = async (userId) => {
  let ret = []
  const res = await knex('userAssignRole')
  .select('roles.name_short as role', 'userAssignRole.*')
  .where('userKey', userId)
  .leftJoin('roles', 'userAssignRole.roleKey', 'roles.id')

  for (let i = 0; i < res.length; i++){
    ret.push(res[i].role)
 
  }
  return ret;
}

//ф-я сбора прав у ролей по roleID
const userRolePermissions = async (roleId) => {
  let ret = []
  const res = await knex('roleAssignPermission')
.select('permission.codeName as permName', 'roleAssignPermission.*')
.where('roleKey', roleId)
.leftJoin('permission', 'roleAssignPermission.permKey', 'permission.id')

for (let j = 0; j < res.length; j++){

  ret.push(res[j].permName)
}
return ret
}

//ф-я сбора прав у пользователя
const userPermission = async (userId) => {
let ret = []
const res = await knex('userAssignPermission')
      .select('permission.codeName as permName', 'userAssignPermission.*')
      .where('userKey', userId)
      .leftJoin('permission', 'userAssignPermission.permKey', 'permission.id')
      for (let i = 0; i < res.length; i++){
        ret.push(res[j].permName)
      }
      return ret  
}

//ф-я сбора прав у ролей пользователя по userID
const rolePermissionByUserId = async (userId) => {
  let ret = []
const userRoles = await knex('userAssignRole')
.select()
.where('userKey', userId)

for (let i = 0; i < userRoles.length; i++){
        //сбор прав наследуемых от ролей 
    const userRolePermissions = await knex('roleAssignPermission')
    .select('permission.codeName as permName', 'roleAssignPermission.*')
    .where('roleKey', userRoles[i].id)
    .leftJoin('permission', 'roleAssignPermission.permKey', 'permission.id')

for (let j = 0; j < userRolePermissions.length; j++){
  
  ret.push(userRolePermissions[j].permName)
}
}
return ret
}


module.exports.findUserByUsername = findUserByUsername;
module.exports.findUserBySessionId = findUserBySessionId;
module.exports.findRoleById = findRoleById;
module.exports.createUser = createUser;
module.exports.passport = passport;
module.exports.userRoles = userRoles;
module.exports.userRolePermissions = userRolePermissions;
module.exports.userPermission = userPermission;
module.exports.rolePermissionByUserId = rolePermissionByUserId;