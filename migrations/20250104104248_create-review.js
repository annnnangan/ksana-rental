/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "review";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.text("booking_reference_no").unsigned();
    table.foreign("booking_reference_no").references("booking.reference_no");
    table.integer("rating").notNullable().checkBetween([1, 5]);
    table.text("review");
    table.boolean("is_anonymous").defaultTo(false).notNullable();
    table.boolean("is_hide_from_public").defaultTo(false).notNullable();
    table.boolean("is_complaint").defaultTo(false).notNullable();
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
