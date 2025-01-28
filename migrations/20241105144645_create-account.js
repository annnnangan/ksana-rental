/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const tableName = "account";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.uuid("id").defaultTo(knex.fn.uuid());
    table.uuid("user_id");
    table.foreign("user_id").references("id").on("users");
    table.text("type").notNullable();
    table.text("provider").notNullable();
    table.text("provider_account_id").notNullable();
    table.text("refresh_token");
    table.text("access_token");
    table.bigInteger("expires_at");
    table.text("token_type");
    table.text("scope");
    table.text("id_token");
    table.text("session_state");
    table.primary("id");
    table.unique(["provider", "provider_account_id"]);
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
