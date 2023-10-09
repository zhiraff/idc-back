// миграция создаёт справочник "перечень радионуклидов"
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.up = function(knex) {
    return knex.schema
    .createTable("radionuclide", (table) => {
    table.increments("id");
    //table.primary("id");
    table.string("symbol", 50).notNullable().unique();
    table.string("name", 255).notNullable();
    table.string("htmlcode", 255);
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();
})
.then(() => {
  return knex('radionuclide').insert([
    {
      symbol: "Pu",
      name: "Плутоний",
      htmlcode: "Pu",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      symbol: "U",
      name: "Уран",
      htmlcode: "U",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      symbol: "Am",
      name: "Америций",
      htmlcode: "Am",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      symbol: "U238",
      name: "Изотоп урана 238",
      htmlcode: "<sup>238</sup>U",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      symbol: "Am241",
      name: "Изотоп америция 241",
      htmlcode: "<sup>241</sup>Am",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      symbol: "Pu238",
      name: "Изотоп плутония 238",
      htmlcode: "<sup>238</sup>Pu",
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      symbol: "Pu239",
      name: "Изотоп плутония 239",
      htmlcode: "<sup>239</sup>Pu",
      createdBy: "migrations",
      updatedBy: "migrations"
    }
  ])
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("radionuclide");
};
