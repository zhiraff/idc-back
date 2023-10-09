//Миграция создаёт справочник 
//Части тела и органы человека
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("bodyPart", (table) => {
    table.increments("id");
    //table.primary("id");
    table.enu("type", ['Орган', 'Часть тела']).comment('Тип');
    table.string("name", 255).notNullable().unique().comment('Название');
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();
})
.then(() => {
  return knex("bodyPart").insert([
    {
      type: "Орган",
      name: "Печень",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "Орган",
      name: "Селезёнка",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "Орган",
      name: "Левое легкое",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "Орган",
      name: "Правое легко",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "Орган",
      name: "Все органы",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "Часть тела",
      name: "Левая рука",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "Часть тела",
      name: "Левая нога",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "Часть тела",
      name: "Правая рука",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "Часть тела",
      name: "Правая нога",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "Часть тела",
      name: "Голова",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      type: "Часть тела",
      name: "Туловище",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
  ])
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("bodyPart");
};
