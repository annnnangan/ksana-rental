/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio_contact").del();
  await knex("studio_contact").insert([
    {
      studio_id: 1,
      type: "phone",
      contact: "+85298761234",
    },
    {
      studio_id: 1,
      type: "website",
      contact: "https://www.soul-yogi.com",
    },
    {
      studio_id: 1,
      type: "instagram",
      contact: "https://www.instagram.com/soul-yogi",
    },
  ]);
};
