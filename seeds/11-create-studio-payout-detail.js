/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  let payoutDetailsList = [];

  [1, 2, 3].map((studio) =>
    payoutDetailsList.push({
      studio_id: studio,
      method: "fps",
      account_name: "Ngan Tai Man",
      account_number: "98765432",
    })
  );

  [4, 5].map((studio) =>
    payoutDetailsList.push({
      studio_id: studio,
      method: "fps",
      account_name: "Chan Ma Lai",
      account_number: "96124536",
    })
  );

  [6].map((studio) =>
    payoutDetailsList.push({
      studio_id: studio,
      method: "bank-transfer",
      account_name: "Lam Shu Hua",
      account_number: "012-324-242242-25325",
    })
  );

  [7, 8].map((studio) =>
    payoutDetailsList.push({
      studio_id: studio,
      method: "bank-transfer",
      account_name: "Or Chi Lo",
      account_number: "012-125-874566-23053",
    })
  );

  [9, 10].map((studio) =>
    payoutDetailsList.push({
      studio_id: studio,
      method: "bank-transfer",
      account_name: "Ma Ming Tai",
      account_number: "012-125-874566-23053",
    })
  );

  [11, 12].map((studio) =>
    payoutDetailsList.push({
      studio_id: studio,
      method: "payme",
      account_name: "Fa Lam",
      account_number: "65431234",
    })
  );

  [13].map((studio) =>
    payoutDetailsList.push({
      studio_id: studio,
      method: "payme",
      account_name: "Mama Chan",
      account_number: "54321234",
    })
  );

  [14, 15].map((studio) =>
    payoutDetailsList.push({
      studio_id: studio,
      method: "payme",
      account_name: "Apple Fung",
      account_number: "57892345",
    })
  );

  [16, 17].map((studio) =>
    payoutDetailsList.push({
      studio_id: studio,
      method: "fps",
      account_name: "Lo Ka Lo",
      account_number: "56149875",
    })
  );

  [18, 19].map((studio) =>
    payoutDetailsList.push({
      studio_id: studio,
      method: "payme",
      account_name: "Jason Wong",
      account_number: "98451236",
    })
  );

  const userOnePayoutDetail = {};
  // Deletes ALL existing entries
  await knex("studio_payout_detail").del();
  await knex("studio_payout_detail").insert(payoutDetailsList);
};
