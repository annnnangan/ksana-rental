/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("payout_proof").del();
  await knex("payout_proof").insert([
    {
      payout_id: 1,
      proof_image_url:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/studio/1/payout/dbc65f36855b25efe236fdbad4702f80b6b3f414f1ed565d96c279d60e7149ef.png",
    },
    {
      payout_id: 2,
      proof_image_url:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/studio/2/payout/b51035a172b3b6bdf1ddb155719b7088c8d82558c8a3de726ade46bd402ea592.png",
    },
    {
      payout_id: 3,
      proof_image_url:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/studio/3/payout/02860baad2f224f8b73285684a790232decb2222e7f183600c1a04133b7846f9.png",
    },
    {
      payout_id: 4,
      proof_image_url:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/studio/4/payout/2c38731e30ea129ce2e03bb38192c4df8c0d30affc6aefdfe60ad605df5d4a03.png",
    },
    {
      payout_id: 5,
      proof_image_url:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/studio/1/payout/209a3b37d42621c976b02d87d85bb1c0b524520842b8008c6aa49165116e0b4d.png",
    },
    {
      payout_id: 6,
      proof_image_url:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/studio/2/payout/8cdd620f30812deac0abe3aba24c857b7ad9fc6d2b0e49956cd1abc87ca66115.png",
    },
  ]);
};
