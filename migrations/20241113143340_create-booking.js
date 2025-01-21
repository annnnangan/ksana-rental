/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "booking";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table
      .text("reference_no")
      .notNullable()
      .unique()
      .defaultTo(knex.raw("nanoid('')"));
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.integer("studio_id").unsigned();
    table.foreign("studio_id").references("studio.id");
    table.date("date").notNullable();
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
    table.integer("price").unsigned().notNullable();
    table.text("whatsapp").notNullable();
    table.text("remarks");
    table.boolean("is_accept_tnc").defaultTo(false).notNullable();
    table
      .enu("status", [
        "confirmed",
        "canceled",
        "pending for payment",
        "expired",
      ])
      .notNullable();
    table.boolean("is_complaint").notNullable().defaultTo(false);
    table.text("stripe_payment_id");
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
