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

//Настройка swagger-autogen
const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json'))

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);

//Подключение middleware для работы
const authRouter = require("./routes/auth.js");
const personnelRouter = require("./routes/personnel.js");
//Подключение middleware для работы справочников
const radionuclideRouter = require("./routes/references/radionuclide.js");
const professionRouter = require("./routes/references/profession.js");
const limitValueRouter = require("./routes/references/limitValue.js");
const bodyPartRouter = require("./routes/references/bodyPart.js");
const kindIdcRouter = require("./routes/references/kindIdc.js");
const departmentRouter = require("./routes/references/department.js");
const userRouter = require("./routes/references/user.js");


const sessionStore = new KnexSessionStore({
  knex,
  tablename: 'sessions', // optional. Defaults to 'sessions'
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
}, function(req, done) {
      var auth = {
        roles: ['Super Admin', 'User'],
        permissions: ['CanAddContent', 'CanRemoveContent']
    };
    done(auth);
}))

//привязка маршрутов справочников к middleware справочников
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/personnel", personnelRouter);
app.use("/api/v1/references/radionuclide", radionuclideRouter);
app.use("/api/v1/references/profession", professionRouter);
app.use("/api/v1/references/limitvalue", limitValueRouter);
app.use("/api/v1/references/bodypart", bodyPartRouter);
app.use("/api/v1/references/kindidc", kindIdcRouter);
app.use("/api/v1/references/department", departmentRouter);
app.use("/api/v1/references/user", userRouter);

app.get("/", async (req, res) => {
  //#swagger.ignore = true
    const users = await knex.select().table("users");
    let usrs_print = "";
    users.forEach(element => {
        usrs_print = usrs_print +"<br>" + element.id + " "+ element.username + " " + element.role;
    });

    res.status(200).send(`Добро пожаловать на backend АС "ИДК" <br> <br> Нужная страница находится здесь: <a href='${req.protocol}://${req.hostname}:${port}/api-docs'>${req.protocol}://${req.hostname}:${port}/api-docs</a>`);

})



//const specs = swaggerJsdoc(require("./swagger-option.js"));



app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
