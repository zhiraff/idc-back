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
    table.string("username", 255).notNullable().unique();
    table.string("password", 255).notNullable();
    table.string("firstName", 255);
    table.string("secondName", 255);
    table.string("thirdName", 255);
    table.string("role", 255).notNullable();
    table.bigInteger("created_at").notNullable();
    table.string("created_by").notNullable();
    table.bigInteger("updated_at").notNullable();
    table.string("updated_by").notNullable();

  })
  .then(() => {
    return knex("users").insert([{
        username: "admin", 
        password: hash("1"), 
        firstName: "Timofey", 
        secondName: "Pigolev", 
        thirdName: "Valerevich", 
        role: "admin",
        created_at: Date.now(),
        created_by: "migrations",
        updated_at: Date.now(),
        updated_by: "migrations"
     }])
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
