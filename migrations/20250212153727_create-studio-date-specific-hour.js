/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "studio_date_specific_hour";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("studio_id").unsigned();
    table.foreign("studio_id").references("studio.id").onDelete("CASCADE");
    table.date("date").notNullable();
    table.boolean("is_closed").notNullable().defaultTo(false);
    table.time("from");
    table.time("to");
    table.integer("price_type_id").unsigned();
    table.foreign("price_type_id").references("studio_price.id");
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
