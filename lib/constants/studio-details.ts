import { PayoutMethod } from "@/services/model";

export const onBoardingRequiredSteps = ["basic-info", "business-hour-and-price", "equipment", "gallery", "door-password", "social", "payout-info"];
export const onBoardingStepsMap = [
  { label: "基本資料", value: "basic-info" },
  { label: "營業時間及價格", value: "business-hour-and-price" },
  { label: "設備", value: "equipment" },
  { label: "場地照片", value: "gallery" },
  { label: "大門密碼", value: "door-password" },
  { label: "社交媒體", value: "social" },
  { label: "收款資料", value: "payout-info" },
  { label: "確認申請", value: "confirmation" },
];

export const equipmentMap: { label: string; value: string }[] = [
  {
    label: "瑜伽墊",
    value: "yoga-mat",
  },
  {
    label: "瑜伽磚",
    value: "yoga-block",
  },
  {
    label: "瑜伽輪",
    value: "yoga-wheel",
  },
  {
    label: "空中吊床 / Hammock",
    value: "hammock",
  },
  {
    label: "空中吊床旋轉 / Spinning Hammock",
    value: "spinning-hammock",
  },
  {
    label: "空中呼拉圈 / Hoop",
    value: "hoop",
  },
  {
    label: "空中絲帶 / Silk",
    value: "silk",
  },
  {
    label: "保護墊",
    value: "safety-mat",
  },
  {
    label: "獨立洗手間",
    value: "individual-washroom",
  },
  {
    label: "場地外共用洗手間",
    value: "shared-washroom-outside-studio",
  },
  {
    label: "場地內更衣室",
    value: "changing-room-in-studio",
  },
  {
    label: "燈光效果",
    value: "lighting",
  },
  {
    label: "腳架",
    value: "tripod",
  },
] as const;

export const payoutMethodMap: { label: string; value: PayoutMethod }[] = [
  {
    label: "FPS",
    value: "fps",
  },
  {
    label: "Payme",
    value: "payme",
  },
  {
    label: "銀行過數",
    value: "bank-transfer",
  },
] as const;
