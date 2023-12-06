// миграция создаёт табилцу пользователей, потому что
//таблица сессии не нужна, она создаётся автоматически с passport.js
const crypto = require("crypto");
const alg = "sha256";
const enc = "hex";

const hash = (d) => {
    let myhash = crypto.createHash(alg);
    myhash.update(d);
    return myhash.digest(enc);
}

exports.up = function(knex) {
     return knex.schema
    .createTable("users", (table) => {
    table.increments("id");
    //table.primary("id");
    table.string("username", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.string("firstName", 255);
    table.string("secondName", 255);
    table.string("thirdName", 255);
    table.integer("role").notNullable();
    table.foreign("role").references("roles.id").onDelete("cascade");
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();

  })
  .then(() => {
    return knex("users").insert([
      {
        username: "admin".toUpperCase(), 
        password: hash("1"), 
        firstName: "Служебная", 
        secondName: "Учётная", 
        thirdName: "Запись", 
        role: 1,
        createdBy: "migrations",
        updatedBy: "migrations"
     },
     {
      username: "AnVlAlekseeva".toUpperCase(), 
      password: hash("1"), 
      firstName: "Анастасия", 
      secondName: "Алексеева", 
      thirdName: "Владимировна", 
      role: 1,
      createdBy: "migrations",
      updatedBy: "migrations"
   },
   {
    username: "TVPigolev".toUpperCase(), 
    password: hash("1"), 
    firstName: "Тимофей", 
    secondName: "Пиголев", 
    thirdName: "Валерьевич", 
    role: 1,
    createdBy: "migrations",
    updatedBy: "migrations"
 }])
  });
  
};


exports.down = function(knex) {
   return knex.schema.dropTable("users");
};
