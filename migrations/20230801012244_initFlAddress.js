//Миграция создаёт справочник 
//адресов физического лица
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("fl_address", (table) => {
    table.increments("id");
    table.integer("flKey").notNullable().comment('ссылка на физ.лицо');
    table.foreign("flKey").references("FL.id").onDelete("cascade");
    table.enu("type", ['Прописка', 'Фактический']).comment('Тип адреса');
    table.integer("zipCode").comment('Индекс');
    table.string("country", 255).notNullable().comment('Страна');
    table.string("region", 255).notNullable().comment('Регион');
    table.string("area", 255).comment('Район');
    table.string("city", 255).notNullable().comment('Населенный пункт');
    table.string("street", 255).notNullable().comment('Улица');
    table.string("home", 255).notNullable().comment('Дом');
    table.string("struct", 255).comment('Строение');
    table.string("build", 255).comment('Корпус');
    table.string("appart", 255).notNullable().comment('Квартира');
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
  return knex.schema.dropTable("fl_address");
};
