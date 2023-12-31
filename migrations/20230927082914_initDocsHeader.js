//Миграция создаёт 
//Таблицу документов (заголовки)
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("docHeader", (table) => {
    table.increments("id");
    table.string("organization", 255).notNullable().comment('Организация приславшая документ');
    table.string("typeDocument", 255).notNullable().comment('Тип документа');
    //table.string("typeExam", 255).notNullable().comment('Тип обследования');
    table.enu("typeExam", ['БФО', 'СИЧ', "Хелатотерапия", "ОЭД"]).notNullable().comment('Тип обследования');
    table.date("dateDocument").notNullable().comment('Дата документа');
    table.string("numberDocument", 255).notNullable().comment('Номер документа');
    table.date("beginPeriod").comment('Дата начала обследований');
    table.date("endPeriod").comment('Дата окончания обследований');
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
    return knex.schema.dropTable("docHeader");
};
