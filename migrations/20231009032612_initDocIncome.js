//Миграция создаёт 
//Таблицу Поступления радионуклидов
//создает права CRUD на новую таблицу
//назначает все права роли администратор права на новую таблицу
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("docIncome", (table) => {
    table.increments("id");
    table.integer("docKey").notNullable().comment('ссылка на заголовок документа');
    table.foreign("docKey").references("docHeader.id").onDelete("cascade");
    table.integer("flKey").notNullable().comment('ссылка на физическое лицо');
    table.foreign("flKey").references("FL.id").onDelete("restrict");
    table.integer("radionuclideKey").notNullable().comment('ссылка на радионуклид');
    table.foreign("radionuclideKey").references("radionuclide.id").onDelete("restrict");
    table.date("dateIncome").comment('Дата поступления');
    table.float("value").notNullable().comment('Поступление, Бк');
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();
})
.then(() => {
    return knex("permission").insert([
        {
            name: 'Добавить запись в таблицу docIncome',
            codeName: 'add_docIncome',
            tableName: 'docIncome',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            name: 'Обновить запись в таблице docIncome',
            codeName: 'update_docIncome',
            tableName: 'docIncome',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            name: 'Удалить запись в таблице docIncome',
            codeName: 'delete_docIncome',
            tableName: 'docIncome',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            name: 'Посмотреть запись в таблице docIncome',
            codeName: 'read_docIncome',
            tableName: 'docIncome',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        }
    ])
})
.then( async () => {
    const roleAdminId = await knex('roles').first('id').where('name_short', 'administrator')
    let docIncomePermissions = await knex('permission')
    .select('id as permKey', 'createdBy', 'updatedBy')
    .where('tableName', 'docIncome')
    for (let i = 0; i < docIncomePermissions.length; i++){
        docIncomePermissions[i]['roleKey'] = roleAdminId.id
    }
    //console.log(docIncomePermissions)
    return knex("roleAssignPermission").insert(docIncomePermissions)
})

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("docIncome")
    .then(() => {
       return knex("permission").where('tableName', 'docIncome').del()
    });
};
