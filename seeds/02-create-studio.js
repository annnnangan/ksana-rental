/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio").del();
  await knex("studio").insert([
    {
      user_id: 1,
      logo: "fR9ZWwHw0xQS/logo.png",
      cover_photo: "fQaHPor9fZYB/cover_photo.png",
      name: "Soul Yogi Studio",
      slug: "soul-yogi-studio",
      status: "active",
      is_approved: true,
      area: "Kowloon",
      district: "Sham Shui Po",
      address: "荔枝角金百盛大廈20樓20室",
      description: "xxxxxxxxx",
      is_reveal_door_password: true,
      door_password: "859304#",
    },
  ]);
};
