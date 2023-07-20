/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// миграция создаёт справочник "перечень радионуклидов"

exports.up = function(knex) {
    return knex.schema
    .createTable("radionuclide", (table) => {
    table.increments("id");
    //table.primary("id");
    table.string("symbol", 50).notNullable().unique();
    table.string("name", 255).notNullable();
    table.string("htmlcode", 255);
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
  return knex.schema.dropTable("radionuclide");
};
