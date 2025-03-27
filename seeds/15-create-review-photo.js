/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("review_photo").del();

  const bookings = await knex("booking").select("reference_no");

  if (bookings.length === 0) {
    console.error("No booking found! Ensure you have booking in the database.");
    return;
  }

  const bookingList = bookings.map((booking) => booking.reference_no);

  const positivePhoto = [
    "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/review-image/positive-image-1.jpg",
    "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/review-image/positive-image-2.jpg",
    "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/review-image/positive-image-3.png",
    "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/review-image/positive-image-4.png",
  ];
  const negativePhoto = [
    "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/review-image/negative-image-1.jpg",
    "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/review-image/negative-image-2.png",
  ];

  await knex("review_photo").insert([
    {
      review_id: 1,
      photo: positivePhoto[0],
    },
    {
      review_id: 2,
      photo: positivePhoto[1],
    },
    {
      review_id: 3,
      photo: positivePhoto[2],
    },
    {
      review_id: 8,
      photo: positivePhoto[3],
    },
    {
      review_id: 5,
      photo: negativePhoto[0],
    },
    {
      review_id: 5,
      photo: negativePhoto[1],
    },
  ]);
};
