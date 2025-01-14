/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

function convertStringToTime(time) {
  let date = new Date(`01/01/2022 ${time}`);
  let formattedTime = date.toLocaleTimeString("en-US", { hour12: false });
  return formattedTime;
}

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("booking").del();
  await knex("booking").insert([
    {
      user_id: 2,
      studio_id: 1,
      date: new Date("2024-12-02"),
      start_time: convertStringToTime("10:00"),
      end_time: convertStringToTime("11:00"),
      status: "complete",
      price: 120,
      whatsapp: "+85298765432",
      remarks: "可唔可以幫我set up一條Hammock。",
      is_complaint: false,
      stripe_payment_id: "pi_3QOf4WE9TWOIiP7J007pRGwF",
    },
    {
      user_id: 2,
      studio_id: 1,
      date: new Date("2024-12-02"),
      start_time: convertStringToTime("11:00"),
      end_time: convertStringToTime("12:00"),
      status: "complete",
      price: 120,
      whatsapp: "+85298765432",
      remarks: "可唔可以幫我set up一條Hammock。",
      is_complaint: false,
      stripe_payment_id: "pi_3QOf4WE9TWOIiP7J007pRGwF",
    },
    {
      user_id: 2,
      studio_id: 1,
      date: new Date("2024-12-02"),
      start_time: convertStringToTime("12:00"),
      end_time: convertStringToTime("13:00"),
      price: 120,
      status: "complete",
      whatsapp: "+85298765432",
      remarks: "可唔可以幫我set up一條Hammock。",
      is_complaint: false,
    },
    {
      user_id: 2,
      studio_id: 2,
      date: new Date("2024-12-02"),
      start_time: convertStringToTime("12:00"),
      end_time: convertStringToTime("13:00"),
      price: 120,
      status: "complete",
      whatsapp: "+85298765432",
      remarks: "可唔可以幫我set up一條Hammock。",
      is_complaint: false,
    },
  ]);
};
