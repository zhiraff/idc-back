require("dotenv").config();
const knex = require("./knex_init");

const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const passport = require('passport');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const auth = require('express-rbac');


const authRouter = require("./routes/auth.js");
const radionuclideRouter = require("./routes/radionuclide.js");
const professionRouter = require("./routes/profession.js");

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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/references/radionuclide", radionuclideRouter);
app.use("/api/v1/references/profession", professionRouter);

app.get("/", async (req, res) => {
    const users = await knex.select().table("users");
    let usrs_print = "";
    users.forEach(element => {
        usrs_print = usrs_print +"<br>" + element.id + " "+ element.username + " " + element.role;
    });

    res.status(200).send(`Добро пожаловать на backend АС "ИДК" <br> <br> Нужная страница находится здесь: <a href='${req.protocol}://${req.hostname}:${port}/api-docs'>${req.protocol}://${req.hostname}:${port}/api-docs</a>`);

})



const specs = swaggerJsdoc(require("./swagger-option.js"));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
