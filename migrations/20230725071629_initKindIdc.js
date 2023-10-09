//Миграция создаёт справочник 
//виды контроля
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("kindIdc", (table) => {
    table.increments("id");
    table.string("type", 255).notNullable().comment('Тип обследования');
    table.string("kind", 255).notNullable().comment('Вид ИДК');
    table.string("kindShort", 10).notNullable().comment('Вид ИДК коротко');
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();
})
.then(()=> {
  return knex("kindIdc").insert([
    {
      type: "СИЧ",
      kind: "Текущий ИДК",
      kindShort: "тк",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "СИЧ",
      kind: "Входной контроль",
      kindShort: "вх",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "СИЧ",
      kind: "Специальный контроль",
      kindShort: "ск",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "СИЧ",
      kind: "По направлению врача",
      kindShort: "2 ТО",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "СИЧ",
      kind: "Информационный контроль",
      kindShort: "ик",
      createdBy: "migrations",
      updatedBy: "migrations"
    }
  ])
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("kindIdc");
};
