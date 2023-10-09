//Миграция модифицирует таблицу пользователей
// удаляет поле role

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('role')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('users', (table) => {
        table.integer("role");
        table.foreign("role").references("roles.id").onDelete("cascade");
      })
};
