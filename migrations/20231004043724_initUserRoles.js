//Миграция создаёт 
//Таблицу назначения ролей пользователям
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("userAssignRole", (table) => {
    table.increments("id");
    table.integer("userKey").notNullable().comment('id пользователя');
    table.foreign("userKey").references("users.id").onDelete("cascade");
    table.integer("roleKey").notNullable().comment('id роли');
    table.foreign("roleKey").references("roles.id").onDelete("cascade");
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();
})
.then( async ()=> {
    const userAdminId = await knex('users').first('id').where('username', 'admin'.toUpperCase())
    const userAlekseevaId = await knex('users').first('id').where('username', 'AnVlAlekseeva'.toUpperCase())
    const userPigolevId = await knex('users').first('id').where('username', 'TVPigolev'.toUpperCase())
    const roleAdminId = await knex('roles').first('id').where('name_short', 'administrator')
    //console.log(userAdminId)
    //console.log(roleAdminId)
    return knex('userAssignRole').insert([
        {
            userKey: userAdminId.id,
            roleKey: roleAdminId.id,
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            userKey: userAlekseevaId.id,
            roleKey: roleAdminId.id,
            createdBy: 'migrations',
            updatedBy: 'migrations',
        },
        {
            userKey: userPigolevId.id,
            roleKey: roleAdminId.id,
            createdBy: 'migrations',
            updatedBy: 'migrations',
        }
    ])
})
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("userAssignRole");
};
