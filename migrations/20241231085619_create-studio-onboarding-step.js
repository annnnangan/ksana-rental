/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "studio_onboarding_step";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("studio_id").unsigned();
    table.foreign("studio_id").references("studio.id");
    table
      .enu("step", [
        "basic-info",
        "business-hour-and-price",
        "equipment",
        "gallery",
        "door-password",
        "contact",
        "payout-info",
        "confirmation",
      ])
      .notNullable();
    table.boolean("is_complete").defaultTo(false).notNullable();
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
