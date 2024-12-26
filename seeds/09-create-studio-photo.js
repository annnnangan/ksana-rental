/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio_photo").del();
  await knex("studio_photo").insert([
    {
      studio_id: 1,
      photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/02d86cb049e1e7f20c834d3081ccb8fa478214c92ee78cc237ea7a59e0c98dcc.png",
    },
    {
      studio_id: 1,
      photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/1564db0a0dfd1108746fc916223626cc13b01cf2fc024619f4139670e64cd13f.jpg",
    },
    {
      studio_id: 1,
      photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/1a8860a22d58d884f9d469a42aee291b6ce59e3ff3ecb33c6fd64f36007de9c5.png",
    },
  ]);
};
