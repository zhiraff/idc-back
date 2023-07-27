// миграция создаёт справочник "Должностей и профессий"
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const profFile = 'prof.json'
const doljFile = 'dolj.json'
exports.up = function(knex) {
    return knex.schema
    .createTable("profession", (table) => {
    table.increments("id");
    //table.primary("id");
    table.enu("division", ['Профессии рабочих', 'Должности служащих']).comment('Должность/Профессия');
    table.integer("code").notNullable().unique().comment('Код');
    table.string("name", 255).notNullable().comment('Название');
    table.integer("controlNumber").comment('Контрольное число');
    table.string('etks_category', 2).comment('Код ЕТКС/Категории');
    table.string('okz', 4).comment('Код по ОКЗ');
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();
})
.then(() => {
    try {
        const prof = require(`./OKDPTR/${profFile}`) //список профессий
        const dolj = require(`./OKDPTR/${doljFile}`) //список должностей
        prof.forEach(element => {
        element['division'] = "Профессии рабочих"
        element['code'] = Number(element.KOD)
        element['name'] = element.NAME
        element['controlNumber'] = Number(element.KC)
        element['etks_category'] = element.ETKS
        element['okz'] = element.OKZ
        element['createdBy'] = "migrations"
        element['updatedBy'] = "migrations"
        delete element.global_id
        delete element.OKZ
        delete element.KC
        delete element.NAME
        delete element.ETKS
        delete element.KOD
    });
        dolj.forEach(element => {
        element['division'] = "Должности служащих"
        element['code'] = Number(element.KOD)
        element['name'] = element.NAME
        element['controlNumber'] = Number(element.KC)
        element['etks_category'] = element.CATEGORY
        element['okz'] = element.OKZ
        element['createdBy'] = "migrations"
        element['updatedBy'] = "migrations"
        delete element.global_id
        delete element.OKZ
        delete element.KC
        delete element.NAME
        delete element.CATEGORY
        delete element.KOD
    });
    return knex("profession").insert(prof.concat(dolj))

    } catch {
        console.error(`Ошибка импорта данных проверьте файлы: \n ../OKDPTR/${profFile} \n ../OKDPTR/${doljFile} `)
    }

});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("profession");
};
