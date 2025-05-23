/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio").del();

  // Fetch all user IDs from the users table
  const users = await knex("users").select("id");

  if (users.length === 0) {
    console.error("No users found! Ensure you have users in the database.");
    return;
  }

  // Map users to make assignments easier
  const userIdList = users.map((user) => user.id);

  await knex("studio").insert([
    {
      user_id: userIdList[0],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg",
      name: "Soul Yogi Studio",
      slug: "soul-yogi-studio",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "kowloon",
      district: "sham-shui-po",
      address: "香港長沙灣大南西街609號2樓10室",
      description: `帶來內心平靜與身心和諧的空間，讓你放鬆自我，重拾能量🌱
🧘‍♂️ 空中舞蹈課程｜地面瑜伽課程｜場地租用
🏔️ 4.3米高樓底｜山景落地大玻璃｜800呎課室連獨立內廁
🌟 優雅圓拱門設計｜場地設有多種燈光效果｜高級音響設備`,
      door_password: "859304#",
      approved_at: "2024-11-01 00:49:52.805 +0800",
    },
    {
      user_id: userIdList[0],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/olivia/olivia-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/olivia/olivia-cover.jpg",
      name: "Olivia Studio",
      slug: "olivia-studio",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "kowloon",
      district: "sham-shui-po",
      address: "香港荔枝角永康街63號Global Gateway Tower 2701室",
      description: `💪 瑜伽與普拉提結合課程｜身心靈調理｜個別指導
🪴 可調式瑜伽墊｜大面積綠意戶外空間
🔊 簡約大堂設計｜帶有溫暖氣氛的照明設備｜影像投影系統`,
      door_password: "859304#",
      approved_at: "2024-12-01 00:49:52.805 +0800",
    },
    {
      user_id: userIdList[0],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zen-oasis/zen-oasis-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zen-oasis/zen-oasis-cover.jpg",
      name: "Zen Oasis",
      slug: "zen-oasis",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "kowloon",
      district: "sham-shui-po",
      address: "荔枝角金百盛大廈6樓20室",
      description: `🧘‍♂️ 陶冶身心的瑜伽課程｜動態與靜態練習
🌞 大型落地窗｜早晨的第一道陽光
🎶 簡約明亮設計｜高科技音響與視頻設備｜氛圍燈光效果`,
      door_password: "859304#",
      approved_at: "2024-12-01 00:49:52.805 +0800",
    },
    {
      user_id: userIdList[1],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/larana/larana-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/larana/larana-cover.jpg",
      name: "Larana Yoga",
      slug: "larana-yoga",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "sham-shui-po",
      address: "荔枝角金百盛大廈10樓28室",
      description: `🧘‍♂️ 瑜伽冥想課程｜動作與呼吸協調
🏡 開放式設計｜大自然綠化空間｜舒適的瑜伽墊
🎶 溫暖木質設計｜柔和燈光與香薰氣氛｜影音互動設施`,
      door_password: "859304#",
      approved_at: "2024-12-01 00:49:52.805 +0800",
    },
    {
      user_id: userIdList[1],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/acro/acro-yoga-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/acro/acro-yoga-cover.jpg",
      name: "Acro Yoga",
      slug: "acro-yoga",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "yau-tsim-mong",
      address: "尖沙咀彌敦道123號3樓",
      description:
        "🤸‍♀️ 空中瑜伽與雜技練習｜動態伸展與體力訓練\n🎯 多功能訓練空間｜適合小組活動\n💡 具有柔光與多重燈效設置，營造活力氛圍",
      door_password: "627493#",
      approved_at: "2024-12-01 00:49:52.805 +0800",
    },
    {
      user_id: userIdList[2],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/nala/nala-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/nala/nala-cover.jpg",
      name: "Nala Studio",
      slug: "nala-studio",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "kowloon-city",
      address: "九龍城啟德道456號6樓",
      description:
        "🌸 融合瑜伽與冥想｜身心靈深度放鬆\n🏞️ 窗外可見迷人海景｜寧靜的環境讓人心曠神怡\n🪔 現代設計配合燭光效果，創造沉浸式體驗",
      door_password: "384926#",
      approved_at: "2024-12-01 00:49:52.805 +0800",
    },
    {
      user_id: userIdList[3],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/venus-moon/venus-moon-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/venus-moon/venus-moon-cover.jpg",
      name: "Venus Moon",
      slug: "venus-moon",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "kowloon",
      district: "kwun-tong",
      address: "觀塘道789號5樓",
      description:
        "🌙 精緻瑜伽課程｜從身體放鬆到心靈啟發\n💪 互動式課程設計｜適合各種級別\n🏡 開放式設計與多功能空間，靈活變化課程需求",
      door_password: "920384#",
    },
    {
      user_id: userIdList[3],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/yoga-delight/yoga-delight-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/yoga-delight/yoga-delight-cover.jpg",
      name: "Yoga Delight",
      slug: "yoga-delight",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "kowloon",
      district: "tsuen-wan",
      address: "荃灣青山道321號4樓",
      description:
        "🍃 舒適與放鬆並行的瑜伽課程｜專業的瑜伽指導\n🌞 環境簡約，充滿自然光，適合冥想與休息\n🎶 燈光與音響配合，為每一堂課創造和諧氛圍",
      door_password: "834751#",
    },
    {
      user_id: userIdList[4],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zenspace-yoga/zen-space-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zenspace-yoga/zenspace-yoga-cover.jpg",
      name: "ZenSpace Yoga",
      slug: "zen-space-yoga",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298125395",
      area: "new-territories",
      district: "sha-tin",
      address: "石門安群街1號京瑞廣場2期21樓J6",
      description:
        "🧘‍♀️ 寧靜的瑜伽空間，提供多樣的瑜伽課程\n💫 充滿平和氛圍，適合放鬆與冥想\n🌿 激發內在平衡，達成心身的統一",
      door_password: "102938#",
    },
    {
      user_id: userIdList[4],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/flow-flex-studio/flow-flex-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/flow-flex-studio/flow-flex-studio-cover.jpg",
      name: "Flow & Flex Studio",
      slug: "flow-flex-studio",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85265412345",
      area: "new-territories",
      district: "sha-tin",
      address: "石門安群街1號京瑞廣場2期25樓J6",
      description:
        "💪 動態流暢的瑜伽課程，專為提升柔韌性設計\n🌟 充滿活力的環境，幫助你達到最佳狀態\n💥 引導你進入流動的動作中，釋放壓力",
      door_password: "283746#",
    },
    {
      user_id: userIdList[5],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/the-yoga-loft/yoga-loft-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/the-yoga-loft/the-yoga-loft-cover.jpg",
      name: "The Yoga Loft",
      slug: "the-yoga-loft",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85287612563",
      area: "new-territories",
      district: "tuen-mun",
      address: "香港屯門杯渡路99號99Commons 910室",
      description:
        "🏠 寬敞舒適的瑜伽空間，提供多種瑜伽與冥想課程\n🌱 領悟身心的和諧，並深度放鬆\n🌞 在自然光下探索瑜伽的力量",
      door_password: "495730#",
    },
    {
      user_id: userIdList[5],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/serenity-studio/serenity-studio-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/serenity-studio/serenity-studio-cover.jpg",
      name: "Serenity Studio",
      slug: "serenity-studio",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85265431234",
      area: "new-territories",
      district: "tuen-mun",
      address: "香港屯門震寰路好收成工業大廈20樓10室",
      description:
        "🌸 平靜的瑜伽空間，專注於身心的和諧\n🌱 提供放鬆、舒展、冥想課程\n🌿 優雅的環境，幫助你恢復內心的寧靜",
      door_password: "823746#",
    },
    {
      user_id: userIdList[6],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/harmony-yoga-space/harmony-yoga-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/harmony-yoga-space/harmony-yoga-space-cover.jpg",
      name: "Harmony Yoga Space",
      slug: "harmony-yoga-space",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "hong-kong",
      district: "central-and-western",
      address: "香港中環威靈頓街威利大廈4D",
      description:
        "💫 提供平衡和靈活性增強的瑜伽課程\n🌞 舒適的氛圍，讓你重拾和諧的身心狀態\n🧘‍♀️ 釋放緊張感，達到深層放鬆",
      door_password: "984561#",
    },
    {
      user_id: userIdList[7],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/tranquil-vibes-studio/tranquil-vibes-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/tranquil-vibes-studio/tranquil-vibes-studio-cover.jpg",
      name: "Tranquil Vibes Studio",
      slug: "tranquil-vibes-studio",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "hong-kong",
      district: "central-and-western",
      address: "香港中環蘭桂坊13號 5/F",
      description:
        "🌿 安靜、舒緩的瑜伽環境，幫助放鬆與釋放壓力\n🌙 深度冥想和放鬆課程，讓身心完全恢復\n🌱 專注於自我探索與內心的寧靜",
      door_password: "213546#",
    },
    {
      user_id: userIdList[7],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/asana-retreat/asana-retreat-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/asana-retreat/asana-retreat-cover.jpg",
      name: "Asana Retreat",
      slug: "asana-retreat",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "hong-kong",
      district: "wan-chai",
      address: "香港灣仔灣仔道83號15樓",
      description:
        "🧘‍♂️ 瑜伽和冥想的靜修地點，提供深度的放鬆課程\n🌞 探索身心的平衡與能量\n💫 釋放壓力、恢復活力的專業課程",
      door_password: "647382#",
    },
    {
      user_id: userIdList[8],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/inner-balance-studio/inner-balance-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/inner-balance-studio/inner-balance-studio-cover.jpg",
      name: "Inner Balance Studio",
      slug: "inner-balance-studio",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "hong-kong",
      district: "central-and-western",
      address: "香港中環德輔道中140-142號富偉商業大廈9樓",
      description:
        "🌿 提供平衡與靈活性的瑜伽課程，專注於內在的和諧\n💪 促進身體的健康與心靈的放鬆\n🌱 培養正向的心態，達到身心的平衡",
      door_password: "467193#",
    },
    {
      user_id: userIdList[8],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/rediant-yoga-hub/radiant-yoga-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/rediant-yoga-hub/rediant-yoga-hub-cover.jpg",
      name: "Radiant Yoga Hub",
      slug: "radiant-yoga-hub",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "kowloon",
      district: "kwun-tong",
      address: "香港觀塘開源道55號開聯工業中心A座13樓, 1327室",
      description:
        "🌞 提供富有活力與光輝的瑜伽課程，激發身心的能量\n💫 吸引內在的光輝，帶來積極與正能量\n🧘‍♀️ 深度冥想與伸展課程，提升自我意識",
      door_password: "934876#",
    },
    {
      user_id: userIdList[9],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/blissful-bend-studio/blissful-bend-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/blissful-bend-studio/blissful-bend-studio-cover.jpg",
      name: "Blissful Bend Studio",
      slug: "blissful-bend-studio",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "kowloon",
      district: "yau-tsim-mong",
      address: "旺角荷里活商業中心2樓218室",
      description:
        "🧘‍♀️ 提供靜心與力量兼具的瑜伽課程｜個性化的指導方式\n🌿 清新的環境，適合舒展身心\n✨ 專注於提高柔韌度與力量，為你的每一個動作加分",
      door_password: "518736#",
    },
    {
      user_id: userIdList[9],
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/peaceful-stretch-studio/peaceful-stretch-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/peaceful-stretch-studio/peaceful-stretch-studio-cover.jpg",
      name: "Peaceful Stretch Studio",
      slug: "peaceful-stretch-studio",
      status: "active",
      is_approved: true,
      approved_at: "2024-12-01 00:49:52.805 +0800",
      phone: "+85298765432",
      area: "kowloon",
      district: "yau-tsim-mong",
      address: "旺角亞皆老街72號5樓",
      description:
        "🌸 提供深層放鬆與舒展的瑜伽課程\n🌱 釋放日常壓力，恢復身心的活力\n🧘‍♀️ 善用舒適的環境，讓每一次伸展都變成療癒之旅",
      door_password: "634821#",
    },
  ]);
};
