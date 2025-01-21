/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "payout";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("studio_id").unsigned();
    table.foreign("studio_id").references("studio.id");
    table.integer("studio_payout_detail_id").unsigned();
    table
      .foreign("studio_payout_detail_id")
      .references("studio_payout_detail.id");
    table.enu("status", ["complete"]).notNullable();
    table.date("start_date").notNullable();
    table.date("end_date").notNullable();
    table.integer("total_payout_amount").checkPositive();
    table.integer("completed_booking_amount").checkPositive();
    table.integer("dispute_amount").checkPositive();
    table.integer("refund_amount").checkPositive();
    table.text("remarks");
    table.timestamp("payout_at").defaultTo(knex.fn.now());
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
