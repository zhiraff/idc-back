//Миграция создаёт справочник 
//Физические лица
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("FL", (table) => {
    table.increments("id");
    table.string("signImport", 50).comment('Признак импорта');
    table.string("firstName", 255).comment('Имя');
    table.string("secondName", 255).comment('Фамилия');
    table.string("thirdName", 255).comment('Отчество');
    table.string("sex", 10).notNullable().comment('Пол');
    table.string("family", 100).notNullable().comment('Семейное положение');
    table.string("snils", 20).comment('№ СНИЛС');
    table.string("inn", 20).comment('№ ИНН');
    table.string("organization", 255).notNullable().comment('Организация');
    table.string("department", 255).comment('Подразделение (если организация не ГХК)');
    table.integer("departmentMCCKey").comment('Подразделение ГХК (если организация ГХК)');
    table.foreign("departmentMCCKey").references("department.id").onDelete("restrict");
    //table.string("job", 255).notNullable().comment('Должность');
    table.integer("jobCodeKey", 255).notNullable().comment('Код должности');
    table.foreign("jobCodeKey").references("profession.id").onDelete("restrict");
    table.string("tabNum", 20).comment('Табельный номер');
    table.string("accNum", 20).notNullable().unique().comment('номер учёта в АС');
    table.integer("id_kadr").comment('ключ.физ.лица alfa');
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
  return knex.schema.dropTable("FL");
};
