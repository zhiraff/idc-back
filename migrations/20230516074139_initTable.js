//миграция создаёт таблицу ролей
exports.up = function(knex) {
  return knex.schema
  .createTable("roles", (table) => {
    table.increments("id");
   // table.primary("id");
    table.string("name", 255);
    table.string("name_plural", 255);
    table.string("name_short", 100);
    table.timestamps(true, true, true);
    })
  .then(() => {
    return knex("roles").insert([{
        name: "Администратор АС", 
        name_plural: "Администраторы АС",
        name_short: "administrator"
     },
     {
        name: "Администратор безопасности", 
        name_plural: "Администраторы безопасности",
        name_short: "security"
     },
     {
        name: "Ответственный от ОРБ", 
        name_plural: "Ответственные от ОРБ",
        name_short: "orb_response"
     },
     {
        name: "Оператор", 
        name_plural: "Операторы",
        name_short: "operator"
     },
    ])
  });
/*
 
  */
};

exports.down = function(knex) {
  //
  return knex.schema.dropTable("roles");
};
