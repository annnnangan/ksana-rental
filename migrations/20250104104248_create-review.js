/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "review";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("booking_id").unsigned();
    table.foreign("booking_id").references("booking.id");
    table.boolean("anonymous").notNullable();
    table.integer("rating").notNullable().checkBetween([1, 5]);
    table.text("review");
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
