/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "studio";
exports.up = async function (knex) {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.text("logo");
    table.text("cover_photo");
    table.text("name");
    table.text("slug");
    table
      .enu("status", ["active", "suspend", "draft", "reviewing", "closed"])
      .notNullable();
    table.text("phone");
    table.boolean("is_approved").notNullable();
    table.enu("area", ["hong-kong", "kowloon", "new-territories"]);
    table.enu("district", [
      "central-and-western",
      "wan-chai",
      "eastern",
      "southern",
      "yau-tsim-mong",
      "sham-shui-po",
      "kowloon-city",
      "wong-tai-sin",
      "kwun-tong",
      "kwai-tsing",
      "tsuen-wan",
      "tuen-mun",
      "yuen-long",
      "north",
      "tai-po",
      "sha-tin",
      "sai-kung",
      "islands",
    ]);
    table.text("address");
    table.text("description");
    table.boolean("is_reveal_door_password");
    table.text("door_password");
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
