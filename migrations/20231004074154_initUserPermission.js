//Миграция создаёт 
//Таблицу назначения прав пользователям
//оздает права CRUD для новой таблицы
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("userAssignPermission", (table) => {
    table.increments("id");
    table.integer("userKey").notNullable().comment('id пользователя');
    table.foreign("userKey").references("users.id").onDelete("cascade");
    table.integer("permKey").notNullable().comment('id роли');
    table.foreign("permKey").references("permission.id").onDelete("cascade");
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();
})
.then(() => {
    return knex("permission").insert([
        {
            name: 'Добавить запись в таблицу userAssignPermission',
            codeName: 'add_userAssignPermission',
            tableName: 'userAssignPermission',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            name: 'Обновить запись в таблице userAssignPermission',
            codeName: 'update_userAssignPermission',
            tableName: 'userAssignPermission',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            name: 'Удалить запись в таблице userAssignPermission',
            codeName: 'delete_userAssignPermission',
            tableName: 'userAssignPermission',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            name: 'Посмотреть запись в таблице userAssignPermission',
            codeName: 'read_userAssignPermission',
            tableName: 'userAssignPermission',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        }
    ])
})
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("userAssignPermission")
    .then(() => {
        return knex("permission")
        .where('tableName', 'userAssignPermission').del()
    })
};
