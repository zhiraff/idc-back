//Миграция создаёт справочник 
//документы физического лица
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("fl_docs", (table) => {
    table.increments("id");
    table.integer("flKey").notNullable().comment('ссылка на физ.лицо');
    table.foreign("flKey").references("FL.id").onDelete("cascade");
    table.string("name", 255).notNullable().comment('Название документа');
    table.string("serial", 255).notNullable().comment('Серия');
    table.string("number", 255).notNullable().comment('Номер');
    table.date("dateIssue").notNullable().comment('Дата выдачи');
    table.string("whoIssue", 255).notNullable().comment('Кем выдано');
    table.string("podrIssue", 255).comment('Подразделение');
    table.boolean("active").comment("Основной")
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
  return knex.schema.dropTable("fl_docs");
};
