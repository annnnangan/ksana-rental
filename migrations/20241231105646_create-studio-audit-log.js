/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "studio_audit_log";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("studio_id").unsigned();
    table.foreign("studio_id").references("studio.id");
    table.uuid("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.enu("operation", ["create", "delete", "update"]).notNullable();
    table.enu("type", ["status", "timeblock", "studio_details"]).notNullable();
    table.text("field_name").notNullable();
    table.text("old_value").notNullable();
    table.text("new_value").notNullable();
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
