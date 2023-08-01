/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("fl_born", (table) => {
    table.increments("id");
    table.integer("flKey").notNullable().comment('ссылка на физ.лицо');
    table.foreign("flKey").references("FL.id").onDelete("cascade");
    table.date("date").notNullable().comment('Дата рождения');
    table.string("country", 255).notNullable().comment('Страна рождения');
    table.string("region", 255).notNullable().comment('Регион рождения');
    table.string("area", 255).comment('Район рождения');
    table.string("locality", 255).notNullable().comment('Населенный пункт рождения');
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
  return knex.schema.dropTable("fl_born");
};
