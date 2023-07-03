require("dotenv").config();
const knex = require("knex") ({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    pool: {min: 0, max: 5}
});

const express = require("express");

const app = express();

app.get("/", async (req, res) => {
    const users = await knex.select().table("users");
    let usrs_print = "";
    users.forEach(element => {
        usrs_print = usrs_print +"<br>" + element.id + " "+ element.username + " " + element.role;
    });

    res.status(200).send(`Добро пожаловать на backend АС "ИДК" <br> <br> Users (#, username, role): <br> ${usrs_print}`);

})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on http://192.168.145.224:${port}`)
})
