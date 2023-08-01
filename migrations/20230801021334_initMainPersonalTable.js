/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("mainPersonalTable", (table) => {
    table.increments("id");
    table.integer("flKey").notNullable().comment('ссылка на физ.лицо');
    table.foreign("flKey").references("FL.id").onDelete("cascade");
    table.date("beginDate").notNullable().comment('Дата постановки на учёт');
    table.date("endDate").comment('Дата снятия с учёта');
    table.integer("beKey").comment('ссылка на последнее БФО');
    //table.foreign("beKey").references("be.id").onDelete("set null");
    table.integer("hrsKey").comment('ссылка на последнее исследование СИЧ');
    //table.foreign("hrsKey").references("hrs.id").onDelete("set null");
    table.integer("ctcKey").comment('ссылка на последнее прохождение курса Хелатотерапии');
    //table.foreign("ctcKey").references("ctc.id").onDelete("set null");
    table.integer("erdInKey").comment('ссылка на последние результаты расчёта ОЭД');
    //table.foreign("erdInKey").references("erdIn.id").onDelete("set null");
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
  return knex.schema.dropTable("mainPersonalTable");
};
