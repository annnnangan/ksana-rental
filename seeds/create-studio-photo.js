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
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/f2c5a9c4a3a2b6c6529e320969b087d8484573f92eabdc57f93f562aa8e6beeb.png",
    },
    {
      studio_id: 1,
      photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/15740c472df24fde1d3f9b4fefcbdced743bf57acd26ed8c820c56a887d663d2.png",
    },
    {
      studio_id: 1,
      photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/4985652dd4a61121fad51d0774464874bf02edaeb17b84f6e477be831b7bd8ac.png",
    },
  ]);
};
