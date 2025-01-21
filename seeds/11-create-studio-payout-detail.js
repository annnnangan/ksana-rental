/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio_payout_detail").del();
  await knex("studio_payout_detail").insert([
    {
      studio_id: 1,
      method: "fps",
      account_name: "Chan Tai Man",
      account_number: "98765432",
    },
    {
      studio_id: 2,
      method: "fps",
      account_name: "Man Tai",
      account_number: "98352643",
    },
    {
      studio_id: 3,
      method: "bank-transfer",
      account_name: "Ng Tai Wai",
      account_number: "012-324-242242-25325",
    },
    {
      studio_id: 4,
      method: "bank-transfer",
      account_name: "Wong Mei",
      account_number: "012-324-2434242-223425",
    },
    {
      studio_id: 5,
      method: "payme",
      account_name: "Sze Ching",
      account_number: "87651234",
    },
    {
      studio_id: 6,
      method: "payme",
      account_name: "Cheng Man",
      account_number: "94532738",
    },
    {
      studio_id: 7,
      method: "payme",
      account_name: "Lo Hoi Sim",
      account_number: "54638142",
    },
    {
      studio_id: 8,
      method: "fps",
      account_name: "Lo Sum",
      account_number: "175893025",
    },
  ]);
};
