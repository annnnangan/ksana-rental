/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio_photo").del();
  await knex("studio_photo").insert([
    // Soul Yogi
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: 1,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-gallery-${
        i + 1
      }.jpg`,
    })),

    // Olivia Studio
    ...Array.from({ length: 6 }, (_, i) => ({
      studio_id: 2,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/olivia/olivia-gallery-${
        i + 1
      }.jpg`,
    })),

    // Zen Oasis
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: 3,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zen-oasis/zen-oasis-gallery-${
        i + 1
      }.jpg`,
    })),

    // Larana Yoga
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: 4,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/larana/larana-gallery-${
        i + 1
      }.jpg`,
    })),

    // Acro Yoga
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: 5,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/acro/acro-yoga-gallery-${
        i + 1
      }.jpg`,
    })),

    // Nala Studio
    ...Array.from({ length: 5 }, (_, i) => ({
      studio_id: 6,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/nala/nala-gallery-${
        i + 1
      }.jpg`,
    })),

    // Venus Moon
    ...Array.from({ length: 5 }, (_, i) => ({
      studio_id: 7,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/venus-moon/venus-moon-gallery-${
        i + 1
      }.jpg`,
    })),

    // Yoga Delight
    ...Array.from({ length: 5 }, (_, i) => ({
      studio_id: 8,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/yoga-delight/yoga-delight-gallery-${
        i + 1
      }.jpg`,
    })),
  ]);
};
