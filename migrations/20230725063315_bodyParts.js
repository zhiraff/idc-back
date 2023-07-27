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
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("bodyPart");
};
