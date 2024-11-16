/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

function formatTime(time) {
  let date = new Date(`01/01/2022 ${time}`);
  let formattedTime = date.toLocaleTimeString("en-US", { hour12: false });
  return formattedTime;
}

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio_timeblock").del();
  await knex("studio_timeblock").insert([
    {
      studio_id: 1,
      date: new Date("2024-12-02"),
      start_time: formatTime("19:00"),
      end_time: formatTime("20:00"),
    },
    {
      studio_id: 1,
      date: new Date("2024-12-05"),
      start_time: formatTime("14:00"),
      end_time: formatTime("16:00"),
    },
  ]);
};
