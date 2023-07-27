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
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("kindIdc");
};
