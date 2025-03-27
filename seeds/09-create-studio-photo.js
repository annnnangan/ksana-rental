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
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-gallery-${i + 1}.jpg`,
    })),

    // Olivia Studio
    ...Array.from({ length: 6 }, (_, i) => ({
      studio_id: 2,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/olivia/olivia-gallery-${i + 1}.jpg`,
    })),

    // Zen Oasis
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: 3,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zen-oasis/zen-oasis-gallery-${i + 1}.jpg`,
    })),

    // Larana Yoga
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: 4,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/larana/larana-gallery-${i + 1}.jpg`,
    })),

    // Acro Yoga
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: 5,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/acro/acro-yoga-gallery-${i + 1}.jpg`,
    })),

    // Nala Studio
    ...Array.from({ length: 5 }, (_, i) => ({
      studio_id: 6,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/nala/nala-gallery-${i + 1}.jpg`,
    })),

    // Venus Moon
    ...Array.from({ length: 5 }, (_, i) => ({
      studio_id: 7,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/venus-moon/venus-moon-gallery-${i + 1}.jpg`,
    })),

    // Yoga Delight
    ...Array.from({ length: 5 }, (_, i) => ({
      studio_id: 8,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/yoga-delight/yoga-delight-gallery-${i + 1}.jpg`,
    })),
    // Asana Retreat
    ...Array.from({ length: 7 }, (_, i) => ({
      studio_id: 15,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/asana-retreat/asana-retreat-gallery-${i + 1}.jpg`,
    })),

    // Blissful Bend Studio
    ...Array.from({ length: 7 }, (_, i) => ({
      studio_id: 18,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/blissful-bend-studio/blissful-bend-studio-gallery-${i + 1}.jpg`,
    })),

    // Flow Flex Studio
    ...Array.from({ length: 6 }, (_, i) => ({
      studio_id: 10,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/flow-flex-studio/flow-flex-studio-gallery-${i + 1}.jpg`,
    })),
    // Harmony Yoga Space
    ...Array.from({ length: 6 }, (_, i) => ({
      studio_id: 13,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/harmony-yoga-space/harmony-yoga-space-gallery-${i + 1}.jpg`,
    })),
    // Inner balance
    ...Array.from({ length: 6 }, (_, i) => ({
      studio_id: 16,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/inner-balance-studio/inner-balance-studio-gallery-${i + 1}.jpg`,
    })),
    // Peaceful Stretch
    ...Array.from({ length: 6 }, (_, i) => ({
      studio_id: 19,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/peaceful-stretch-studio/peaceful-stretch-studio-gallery-${i + 1}.jpg`,
    })),
    // Rediant Yoga Hub
    ...Array.from({ length: 6 }, (_, i) => ({
      studio_id: 17,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/rediant-yoga-hub/rediant-yoga-hub-gallery-${i + 1}.jpg`,
    })),
    // Serenity Studio
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: 12,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/serenity-studio/serenity-studio-gallery-${i + 1}.jpg`,
    })),
    // The yoga loft
    ...Array.from({ length: 7 }, (_, i) => ({
      studio_id: 11,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/the-yoga-loft/the-yoga-loft-gallery-${i + 1}.jpg`,
    })),
    // Tranquil Vibes
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: 14,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/tranquil-vibes-studio/tranquil-vibes-studio-gallery-${i + 1}.jpg`,
    })),
    // Zenspace Yoga
    ...Array.from({ length: 7 }, (_, i) => ({
      studio_id: 9,
      photo: `https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zenspace-yoga/zenspace-yoga-gallery-${i + 1}.jpg`,
    })),
  ]);
};
