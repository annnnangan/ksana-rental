/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "users";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.text("first_name").notNullable();
    table.text("last_name").notNullable();
    table.text("email").notNullable();
    table.text("password").notNullable();
    table.text("image");
    table.enu("status", ["active", "suspend by admin"]).notNullable();
    table.enu("role", ["admin", "rental user", "studio owner"]).notNullable();
    table.enu("login_method", ["credential", "google"]).notNullable();
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
