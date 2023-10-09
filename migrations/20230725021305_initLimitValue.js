//Миграция создаёт справочник 
//Контрольные числовые значения поступления/содержания радионуклида
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("limitValue", (table) => {
    table.increments("id");
    //table.primary("id");
    table.integer("radionuclide_id").notNullable().comment('ID радионуклида');
    table.foreign("radionuclide_id").references("radionuclide.id").onDelete("cascade");
    table.enu("indicator", ['Поступление', 'Содержание']).comment('Тип показателя');
    table.float("value").notNullable().comment('Контрольное значение');
    table.float("gister").comment('Гистерезис');
    table.timestamps(true, true, true);
    table.string("createdBy").notNullable();
    table.string("updatedBy").notNullable();
})
.then( async ()=> {
  const radionU = await knex("radionuclide").first('id').where('symbol', 'U')
  const radionPu = await knex("radionuclide").first('id').where('symbol', 'Pu')
  const radionAm = await knex("radionuclide").first('id').where('symbol', 'Am')
  return knex("limitValue").insert([
    {
      radionuclide_id: radionU.id,
      indicator: "Содержание",
      value: 0.005,
      gister: 0.003,
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      radionuclide_id: radionPu.id,
      indicator: "Содержание",
      value: 0.005,
      gister: 0.003,
      createdBy: "migrations",
      updatedBy: "migrations"
    },
    {
      radionuclide_id: radionAm.id,
      indicator: "Содержание",
      value: 0.005,
      gister: 0.003,
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
  return knex.schema.dropTable("limitValue");
};
