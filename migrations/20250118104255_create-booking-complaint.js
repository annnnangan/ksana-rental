/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "booking_complaint";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("review_id").unsigned();
    table.foreign("review_id").references("review.id");
    table
      .enu("status", ["open", "in-progress", "resolved"])
      .notNullable()
      .defaultTo("open");
    table.boolean("is_refund");
    table.enu("refund_method", ["credit", "cash"]).defaultTo("credit");
    table.integer("refund_amount").checkPositive();
    table.text("remarks");
    table.timestamp("resolved_at");
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
