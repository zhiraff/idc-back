/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("roleAssignPermission", (table) => {
    table.increments("id");
    table.integer("roleKey").notNullable().comment('id пользователя');
    table.foreign("roleKey").references("roles.id").onDelete("cascade");
    table.integer("permKey").notNullable().comment('id роли');
    table.foreign("permKey").references("permission.id").onDelete("cascade");
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();
})
.then(() => {
    return knex("permission").insert([
        {
            name: 'Добавить запись в таблицу roleAssignPermission',
            codeName: 'add_roleAssignPermission',
            tableName: 'roleAssignPermission',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            name: 'Обновить запись в таблице roleAssignPermission',
            codeName: 'update_roleAssignPermission',
            tableName: 'roleAssignPermission',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            name: 'Удалить запись в таблице roleAssignPermission',
            codeName: 'delete_roleAssignPermission',
            tableName: 'roleAssignPermission',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            name: 'Посмотреть запись в таблице roleAssignPermission',
            codeName: 'read_roleAssignPermission',
            tableName: 'roleAssignPermission',
            createdBy: 'migrations',
            updatedBy: 'migrations',
        }
    ])
    .then( async () => {
        const roleAdminId = await knex('roles').first('id').where('name_short', 'administrator')
        let allPermissions = await knex('permission').select('id as permKey', 'createdBy', 'updatedBy')
        for (let i = 0; i < allPermissions.length; i++){
            allPermissions[i]['roleKey'] = roleAdminId.id
        }
        //console.log(allPermissions)
        return knex("roleAssignPermission").insert(allPermissions)
    })
})
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("roleAssignPermission")
    .then(() => {
        return knex("permission")
        .where('tableName', 'roleAssignPermission').del()
    })
};
