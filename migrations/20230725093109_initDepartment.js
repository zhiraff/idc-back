/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const depFile = 'dep.json'

exports.up = function(knex) {
    return knex.schema
    .createTable("department", (table) => {
    table.increments("id");
    //table.primary("id");
    table.integer("historical_id").comment('ID полученный при импорте из исторической системы')
    table.integer("parent_id").comment('Родительский id');
    table.date("begin").notNullable().comment("Дата начала деятельности")
    table.date("end").comment("Дата начала деятельности")
    table.string("code", 255).notNullable().comment('Код подразделения');
    table.string("name", 255).notNullable().comment('Название подразделения');
    table.string("department_item_id", 255);
    table.string("full_name", 1048).comment('Название подразделения полностью');
    table.string("address", 1048).comment('Адрес подразделения');
    table.integer("card_chief_id");
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();
})
.then(() => {

    try {
        const dep = require(`./departments/${depFile}`) //список подразделений
        let depForInsert1 = []
        //1. Импортируем подразделения заменив id на historical_id
        dep.emp_department.forEach(element => {
            const cloneElement = Object.assign({}, element);
            cloneElement['historical_id'] = element.id
            cloneElement['createdBy'] = "migrations"
            cloneElement['updatedBy'] = "migrations"
            delete cloneElement.id
            depForInsert1.push(cloneElement)
        });
        //console.log(depForInsert1)
    return knex("department").insert(depForInsert1)

    } catch {

        console.error(`Ошибка импорта данных проверьте файлы: \n ./OKDPTR/${depFile} `)
   
    }

})
.then( async () => {
    //2. Пройдемся по всем подразделениям и поменяем parent_id на реальный id в базе
    //ф-я поиска реального id по историческому
    const findIdByHistoricalId = async (istorical_id) => {
       const resul = await knex('department').first().where({historical_id: istorical_id})
       return resul.id
    }

    //пройдемся по всем подразделениям в базе
    const items = await knex("department").select()

    items.forEach( async (element) => {
        //если parent_id есть
        if (typeof element.parent_id !== 'undefined' && element.parent_id !== null){
            const new_parent_id = await findIdByHistoricalId(element.parent_id)
            const resul = await knex("department")
        .where({ id: element.id })
        .update({parent_id: new_parent_id});
       // console.log(resul)
        }

    });
    
    //knex('department').update({parent_id: findIdByHistoricalId(parent_id)})

});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("department");
};
