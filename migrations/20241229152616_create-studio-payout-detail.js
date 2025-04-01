/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "studio_payout_detail";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("studio_id").unsigned();
    table.foreign("studio_id").references("studio.id").onDelete("CASCADE");
    table.enu("method", ["fps", "payme", "bank-transfer"]).notNullable();
    table.text("account_name").notNullable();
    table.text("account_number").notNullable();
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
