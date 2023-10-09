//Миграция создаёт справочник 
//смены ФИО у физического лица
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("fl_ch_fio", (table) => {
    table.increments("id");
    table.integer("flKey").notNullable().comment('ссылка на физ.лицо');
    table.foreign("flKey").references("FL.id").onDelete("cascade");
    table.string("firstName", 255).comment('Имя');
    table.string("secondName", 255).comment('Фамилия');
    table.string("thirdName", 255).comment('Отчество');
    table.date("date").notNullable().comment('Дата изменения');
    table.string("comment", 255).comment('Комментарий');
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
  return knex.schema.dropTable("fl_ch_fio");
};
