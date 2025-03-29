/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "bookmark";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.uuid("user_id");
    table.foreign("user_id").references("id").on("users");
    table.integer("studio_id").unsigned();
    table.foreign("studio_id").references("studio.id");
    table.timestamps(false, true);
  });

  // Create the trigger for automatic timestamp update (if needed)
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
