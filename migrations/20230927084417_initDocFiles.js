/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("docFile", (table) => {
    table.increments("id");
    table.integer("docKey").notNullable().comment('ссылка на заголовок документа');
    table.foreign("docKey").references("docHeader.id").onDelete("cascade");
    table.string("originalName", 255).notNullable().comment('Оригинальное имя файла (начальное)');
    table.string("name", 255).notNullable().comment('Имя файла (под которым хранится');
    table.string("type", 10).notNullable().comment('Тип файла (pdf/docx)');
    table.string("extension", 10).notNullable().comment('Расширение файла');
    table.string("pathSave", 255).notNullable().comment('Путь хранения');
    table.string("placeSave", 255).comment('Место хранения оригинала');
    table.integer("size").notNullable().comment('Размер файла');
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
    return knex.schema.dropTable("docFile");
};
