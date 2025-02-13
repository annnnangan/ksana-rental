/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "studio_date_specific_hour";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("studio_id").unsigned();
    table.foreign("studio_id").references("studio.id");
    table.date("date").notNullable();
    table.json("timeslots").notNullable();
    //[{"from": "20:00", "to": "22:00", price_type: "peak", price_type_id: 2},{"from": "11:00", "to": "16:00",price_type: "non-peak", price_type_id: 1}]
    //[] when unavailable
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
