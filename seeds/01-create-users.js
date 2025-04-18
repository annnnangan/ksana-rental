/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      name: "Anna Ngan",
      email: "anna_ngan@test.com",
      password: "$2a$10$wzatem4BK9VkIBs4UgKrfuBQEW48mx4.LXikZuvcVZM/bSDuP8w9S",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-female-6.jpg",
    },
    {
      name: "Mary Chan",
      email: "mary_test@test.com",
      password: "$2a$10$S2aWHsvnDAM84psjrM/qy.AqtGp0IQFQaxvu7D.qbhSjhNmOHdvtW",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-female-7.jpg",
    },
    {
      name: "Ken Lam",
      email: "ken_lam@test.com",
      password: "$2a$10$sTW5hbkEWGDrmro1Nuh26uESh3dlCf139VrFfRDvWGg5yD/8YOlnW",
      email_verified: new Date(),
    },
    {
      name: "Yoyo Or",
      email: "yoyo_or@test.com",
      password: "$2a$10$5dPaVyTWW6ITz.FTC938DuOdWBV06fcW8YcRIxgr0.souJFwCPeWK",
      email_verified: new Date(),
    },
    {
      name: "Ma Ming Tai",
      email: "ma_ming_tai@test.com",
      password: "$2a$10$ZvJVFdPcdzHy1YqTblqCBe8fVhJCLXPfrgKPifg3ry7RiC1PAJ01q",
      email_verified: new Date(),
    },
    {
      name: "Fa Lam",
      email: "fa_lam@test.com",
      password: "$2a$10$l1gsFYwNyL8x0c4r.bNbQuDaCP4.Yiem/pAwDZ8OWa4CV2vdvBdFK",
      email_verified: new Date(),
    },
    {
      name: "Mama Chan",
      email: "mamachan@test.com",
      password: "$2a$10$7eKOQM3VvWFngLHypPDmJeEc9QsUkkxRxlFw3qsUiWl/1j0NBE6qW",
      email_verified: new Date(),
    },
    {
      name: "Apple Fung",
      email: "applefung@test.com",
      password: "$2a$10$AxH1CvYHjtFSQAmfpRTe8.AxMDt3.0kN.1JHKs.bCMG6L5vqp7vLC",
      email_verified: new Date(),
    },
    {
      name: "Lo Lo",
      email: "lolo@test.com",
      password: "$2a$10$9Gyl/nHD38zrz9YS5uKZ5Oh0QFVQJyBrgezCZ3MAyJJZ4GIma/Oqi",
      email_verified: new Date(),
    },
    {
      name: "Jason Wong",
      email: "jason_wong@test.com",
      password: "$2a$10$eyNWjP92Syo14ndU2m2jKOFpfZTf6yuQf9.cPayMM2ZmsZVzJjQxm",
      email_verified: new Date(),
    },
    {
      name: "Emily Chan",
      email: "emily_chan@test.com",
      password: "$2a$10$YJmuKMNR6gQkULEubXtLK.Ca5.Y35kMb0ig8/KVOJ7FjKAH6a36uq",
      email_verified: new Date(),
    },
    {
      name: "Daniel Lee",
      email: "daniel_lee@test.com",
      password: "$2a$10$km5ikvmDNp9k5zaB.JYQTuZyDkdRXDDGwAoLmWLNfU4ungy/su9V6",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-cat-2.jpg",
    },
    {
      name: "Sophia Lam",
      email: "sophia_lam@test.com",
      password: "$2a$10$vyV3IMPQm2SF5upM34dknOd0JgKxy8B8kuMjwaSCi2IVvq809udLe",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-female-1.jpg",
    },
    {
      name: "Kevin Lau",
      email: "kevin_lau@test.com",
      password: "$2a$10$.d8UM9HdTlmiaZn7Uzz9TOR7IwqtJLc9Sc7gXMrA8dj9RTjvdAtLy",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-male-3.jpg",
    },
    {
      name: "Michelle Ho",
      email: "michelle_ho@test.com",
      password: "$2a$10$b7NhQrxoT9bRvGMNlQuNleVTiHgz82ND.TR5xvAGuF5JYqyNRfd7K",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-cat-1.jpg",
    },
    {
      name: "Vincent Cheng",
      email: "vincent_cheng@test.com",
      password: "$2a$10$KtPOWBDOn8P40cilZSBAsO9Y043GkuC7BDYGrvy8EJQH7GRvYjXPK",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-male-2.jpg",
    },
    {
      name: "Olivia Kwok",
      email: "olivia_kwok@test.com",
      password: "$2a$10$sWMiqYtB4jW0u53nNYHWaefW/nOmFSFeZQbmCWNzfKDb7RWknDYrS",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-female-3.jpg",
    },
    {
      name: "Ryan Yip",
      email: "ryan_yip@test.com",
      password: "$2a$10$8ZY0AOaygM/CFUIkvIgVWOBdngvTjFZ1EFBdOzGg1qII.5WE0zXh2",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-female-4.jpg",
    },
    {
      name: "Teresa Fung",
      email: "teresa_fung@test.com",
      password: "$2a$10$hO0guhsG2wzFQWTJiUFsz.BHAJO7cI4EpahAz2NWQr4IGOAlDP/rG",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-female-5.jpg",
    },
    {
      name: "Anna(Admin)",
      email: "annangan1998@gmail.com",
      password: "$2a$10$hO0guhsG2wzFQWTJiUFsz.BHAJO7cI4EpahAz2NWQr4IGOAlDP/rG",
      email_verified: new Date(),
      image: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/icon/icon-female-5.jpg",
      role: "admin",
    },
  ]);
};
