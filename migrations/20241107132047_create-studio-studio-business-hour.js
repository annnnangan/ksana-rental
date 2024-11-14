/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "studio_business_hour";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("studio_id").unsigned();
    table.foreign("studio_id").references("studio.id");
    table
      .enu("day_of_week", [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ])
      .notNullable();
    table.boolean("is_closed").notNullable().defaultTo(false);
    table.time("open_time");
    table.time("end_time");
    table.integer("price_type_id").unsigned();
    table.foreign("price_type_id").references("studio_price.id");
    table.timestamps(false, true);
  });
  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable(tableName);
};
