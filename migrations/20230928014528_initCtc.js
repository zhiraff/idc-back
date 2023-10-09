//Миграция создаёт 
//Таблицу результатов хелатотерапии
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("docCtc", (table) => {
    table.increments("id");
    table.integer("docKey").notNullable().comment('ссылка на заголовок документа');
    table.foreign("docKey").references("docHeader.id").onDelete("cascade");
    table.integer("flKey").notNullable().comment('ссылка на физическое лицо');
    table.foreign("flKey").references("FL.id").onDelete("restrict");
    table.date("dateExam").notNullable().comment('Дата взятия пробы');
    table.integer("typeControlKey", 255).notNullable().comment('Вид контроля');
    table.foreign("typeControlKey").references("kindIdc.id").onDelete("restrict");
    table.date("dateInput").comment('Дата поступления');
    table.integer("radionuclideKey").notNullable().comment('ссылка на радионуклид');
    table.foreign("radionuclideKey").references("radionuclide.id").onDelete("restrict");
    table.string("material", 255).notNullable().comment('Материал');
    table.float("consist").notNullable().comment('содержание');
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
    return knex.schema.dropTable("docCtc");
};
