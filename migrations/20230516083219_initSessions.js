
exports.up = function(knex) {
    return knex.schema
    .createTable("sessions", (table) => {
      table.increments("id");
      table.integer("userId", 255).notNullable()
      table.foreign("userId").references("users.id");
      table.string("sessionId", 255);
 
    });
};


exports.down = function(knex) {
    return knex.schema.dropTable("sessions");
};
