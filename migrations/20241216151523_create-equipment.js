/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "equipment";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.text("equipment");
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
