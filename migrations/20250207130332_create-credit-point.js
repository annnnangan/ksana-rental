/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "credit_audit_log";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.uuid("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.text("description").notNullable();
    table.text("booking_reference_no").unsigned();
    table.foreign("booking_reference_no").references("booking.reference_no");
    table.enu("action", ["add", "deduct"]).notNullable().defaultTo("add");
    table.integer("credit_amount").unsigned().notNullable().defaultTo(0);
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
