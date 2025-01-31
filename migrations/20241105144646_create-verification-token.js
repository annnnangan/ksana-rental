/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const tableName = "verification_token";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.uuid("id").defaultTo(knex.fn.uuid());
    table.text("email").notNullable();
    table.string("token").notNullable();
    table.timestamp("expires");
    table.unique(["token", "email"]);
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
