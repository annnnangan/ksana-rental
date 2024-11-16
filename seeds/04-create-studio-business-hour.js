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
  await knex("studio_business_hour").del();
  await knex("studio_business_hour").insert([
    {
      studio_id: 1,
      day_of_week: "Monday",
      is_closed: false,
      open_time: formatTime("00:00"),
      end_time: formatTime("18:00"),
      price_type_id: 1,
    },
    {
      studio_id: 1,
      day_of_week: "Monday",
      is_closed: false,
      open_time: formatTime("18:00"),
      end_time: formatTime("23:59"),
      price_type_id: 2,
    },
    {
      studio_id: 1,
      day_of_week: "Tuesday",
      is_closed: false,
      open_time: formatTime("00:00"),
      end_time: formatTime("18:00"),
      price_type_id: 1,
    },
    {
      studio_id: 1,
      day_of_week: "Tuesday",
      is_closed: false,
      open_time: formatTime("22:00"),
      end_time: formatTime("23:59"),
      price_type_id: 2,
    },
    {
      studio_id: 1,
      day_of_week: "Wednesday",
      is_closed: false,
      open_time: formatTime("00:00"),
      end_time: formatTime("17:00"),
      price_type_id: 1,
    },
    {
      studio_id: 1,
      day_of_week: "Thursday",
      is_closed: false,
      open_time: formatTime("00:00"),
      end_time: formatTime("17:00"),
      price_type_id: 1,
    },
    {
      studio_id: 1,
      day_of_week: "Thursday",
      is_closed: false,
      open_time: formatTime("19:00"),
      end_time: formatTime("23:59"),
      price_type_id: 2,
    },
    {
      studio_id: 1,
      day_of_week: "Friday",
      is_closed: false,
      open_time: formatTime("00:00"),
      end_time: formatTime("18:00"),
      price_type_id: 1,
    },
    {
      studio_id: 1,
      day_of_week: "Saturday",
      is_closed: true,
      price_type_id: 1,
    },
    {
      studio_id: 1,
      day_of_week: "Sunday",
      is_closed: false,
      open_time: formatTime("00:00"),
      end_time: formatTime("10:00"),
      price_type_id: 2,
    },
    {
      studio_id: 1,
      day_of_week: "Sunday",
      is_closed: false,
      open_time: formatTime("16:00"),
      end_time: formatTime("23:59"),
      price_type_id: 2,
    },
  ]);
};
