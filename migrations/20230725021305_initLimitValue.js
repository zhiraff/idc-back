//Миграция создаёт справочник 
//Контрольные числовые значения поступления/содержания радионуклида
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("limitValue", (table) => {
    table.increments("id");
    //table.primary("id");
    table.integer("radionuclide_id").notNullable().comment('ID радионуклида');
    table.foreign("radionuclide_id").references("radionuclide.id").onDelete("cascade");
    table.enu("indicator", ['Поступление', 'Содержание']).comment('Тип показателя');
    table.integer("value").notNullable().comment('Контрольное значение');
    table.integer("gister").comment('Гистерезис');
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
  return knex.schema.dropTable("limitValue");
};
