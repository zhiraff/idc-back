require("dotenv").config();
const knex = require("./knex_init");
const fs = require('fs');
const express = require("express");
//const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const passport = require('passport');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const auth = require('express-rbac');
const cors = require('cors');
const base_url = process.env.BASE_URL || "localhost"
const api_url = "/api/v1"

//Настройка swagger-autogen
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json'))

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);

//настройка cors
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true,
  preflightContinue: true
}

//Подключение middleware для работы
const personnelRouter = require("./routes/personnel.js");
// Отражение информации по показателям
const bpeRouter = require("./routes/monitoring/bpe.js");
const erdRouter = require("./routes/monitoring/erd.js");
const hrsRouter = require("./routes/monitoring/hrs.js");
const ctcRouter = require("./routes/monitoring/ctc.js");
//Идентификация аутентификация авторизация
const authRouter = require("./routes/authentication/auth.js");
const authController = require("./controllers/authentication/auth.js")
const permissionRouter = require("./routes/authentication/permission.js");
const roleAssignPermissionRouter = require("./routes/authentication/roleAssignPermission.js");
const userAssignPermissionRouter = require("./routes/authentication/userAssignPermission.js");
const userAssignRoleRouter = require("./routes/authentication/userAssignRole.js");
// Заведение документов
const documentRouter = require("./routes/document/docHeader.js");
const docBpeRouter = require("./routes/document/docBpe.js");
const docHrsRouter = require("./routes/document/docHrs.js");
const docErdRouter = require("./routes/document/docErd.js");
const docCtcRouter = require("./routes/document/docCtc.js");
const docFileRouter = require("./routes/document/docFile.js");
const docIncomeRouter = require("./routes/document/docIncome.js");
// Справочники
const radionuclideRouter = require("./routes/references/radionuclide.js");
const professionRouter = require("./routes/references/profession.js");
const limitValueRouter = require("./routes/references/limitValue.js");
const bodyPartRouter = require("./routes/references/bodyPart.js");
const kindIdcRouter = require("./routes/references/kindIdc.js");
const departmentRouter = require("./routes/references/department.js");
const userRouter = require("./routes/references/user.js");
const roleRouter = require("./routes/references/role.js");


const sessionStore = new KnexSessionStore({
  knex,
  tablename: 'sessions', // optional. Defaults to 'sessions'
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: false,
    secure: false
  }
}));

app.use(passport.authenticate('session'));

app.use(auth.authorize({
  bindToProperty: 'user'
}, async function(req, done) {
    let rls = []
    let perm = new Set();
    if (typeof req.user === 'undefined'){
      //Пользователь не авторизован
      var auth = {
        roles: ['anonymous'],
        permissions: ['suck', 'cry']
    };
    } else {
      //Пользователь авторизован
      //Роли у пользователя
    rls = await authController.userRoles(req.user.id)
      //Права у пользователя
    let perm1 = await authController.userPermission(req.user.id)
      //Права у ролей пользователя
    let perm2 = await authController.rolePermissionByUserId(req.user.id)
    //Объединим права у удалим дубликаты
    let permSet = new Set(perm1.concat(perm2))

    var auth = {
    roles: await authController.userRoles(req.user.id),
    permissions: Array.from(permSet)
    };
    }
    done(auth);
}))

//привязка маршрутов к middleware 
app.use(`${api_url}/personnel`, personnelRouter);
// Отражение информации по показателям
app.use(`${api_url}/monitoring/bpe`, bpeRouter);
app.use(`${api_url}/monitoring/erd`, erdRouter);
app.use(`${api_url}/monitoring/hrs`, hrsRouter);
app.use(`${api_url}/monitoring/ctc`, ctcRouter);
//Идентификация аутентификация авторизация
app.use(`${api_url}/auth`, authRouter);
app.use(`${api_url}/permission`, permissionRouter);
app.use(`${api_url}/rolepermission`, roleAssignPermissionRouter);
app.use(`${api_url}/userpermission`, userAssignPermissionRouter);
app.use(`${api_url}/userrole`, userAssignRoleRouter);
// Заведение документов
app.use(`${api_url}/document/header`, documentRouter);
app.use(`${api_url}/document/bpe`, docBpeRouter);
app.use(`${api_url}/document/hrs`, docHrsRouter);
app.use(`${api_url}/document/erd`, docErdRouter);
app.use(`${api_url}/document/ctc`, docCtcRouter);
app.use(`${api_url}/document/file`, docFileRouter);
app.use(`${api_url}/document/income`, docIncomeRouter);
// справочники
app.use(`${api_url}/references/radionuclide`, radionuclideRouter);
app.use(`${api_url}/references/profession`, professionRouter);
app.use(`${api_url}/references/limitvalue`, limitValueRouter);
app.use(`${api_url}/references/bodypart`, bodyPartRouter);
app.use(`${api_url}/references/kindidc`, kindIdcRouter);
app.use(`${api_url}/references/department`, departmentRouter);
app.use(`${api_url}/references/user`, userRouter);
app.use(`${api_url}/references/role`, roleRouter);


//app.get("/", auth.isInRole('Super Admin'), async (req, res) => {
app.get("/", async (req, res) => {
  //#swagger.ignore = true
   // let isAllowed = req.user.isInRole('add_users');
   // console.log(isAllowed)


    res.status(200).send(`Добро пожаловать на backend АС "ИДК" <br> <br> Нужная страница находится здесь: <a href='${req.protocol}://${req.hostname}:${port}/api-docs'>${req.protocol}://${req.hostname}:${port}/api-docs</a>`);

})


app.listen(port, () => {
    console.log(`Server listening on http://${base_url}:${port}`)
})
