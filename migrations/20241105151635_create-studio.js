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
    table.enu("status", ["active", "suspend by admin"]).notNullable();
    table.boolean("is_approved").notNullable();
    table.enu("area", ["Kowloon", "Hong Kong", "New Territories"]);
    table.enu("district", [
      "Central and Western",
      "Wan Chai",
      "Eastern",
      "Southern",
      "Yau Tsim Mong",
      "Sham Shui Po",
      "Kowloon City",
      "Wong Tai Sin",
      "Kwun Tong",
      "Kwai Tsing",
      "Tsuen Wan",
      "Tuen Mun",
      "Yuen Long",
      "North",
      "Tai Po",
      "Sha Tin",
      "Sai Kung",
      "Islands",
    ]);
    table.text("address");
    table.text("description");
    table.boolean("is_reveal_door_password").notNullable();
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
