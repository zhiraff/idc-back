//Миграция создаёт 
//Таблицу расчётов ОЭД
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("docErd", (table) => {
    table.increments("id");
    table.integer("docKey").notNullable().comment('ссылка на заголовок документа');
    table.foreign("docKey").references("docHeader.id").onDelete("cascade");
    table.integer("flKey").notNullable().comment('ссылка на физическое лицо');
    table.foreign("flKey").references("FL.id").onDelete("restrict");
    table.date("dateIncome").notNullable().comment('Дата поступления');
    table.date("beginPeriod").notNullable().comment('Дата начала периода');
    table.date("endPeriod").notNullable().comment('Дата окончания периода');
    table.float("dose").notNullable().comment('Доза, мЗв');
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
    return knex.schema.dropTable("docErd");
};
