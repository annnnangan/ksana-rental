export type PriceType = "peak" | "non-peak";

export type daysOfWeekType = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export const daysOfWeek: daysOfWeekType[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export type StudioStatus = "draft" | "active" | "suspended" | "reviewing" | "closed";

export type BookingStatus = "confirmed" | "canceled" | "pending for payment" | "expired";

export type PayoutStatus = "pending" | "complete";

export const districts = [
  {
    area: { label: "香港", value: "hong-kong" },
    district: [
      { label: "中西區", value: "central-and-western" },
      { label: "灣仔", value: "wan-chai" },
      { label: "東區", value: "eastern" },
      { label: "南區", value: "southern" },
    ],
  },
  {
    area: { label: "九龍", value: "kowloon" },
    district: [
      { label: "油尖旺", value: "yau-tsim-mong" },
      { label: "深水埗", value: "sham-shui-po" },
      { label: "九龍城", value: "kowloon-city" },
      { label: "黃大仙", value: "wong-tai-sin" },
      { label: "觀塘", value: "kwun-tong" },
    ],
  },
  {
    area: { label: "新界", value: "new-territories" },
    district: [
      { label: "葵青", value: "kwai-tsing" },
      { label: "元朗", value: "yuen-long" },
      { label: "荃灣", value: "tsuen-wan" },
      { label: "屯門", value: "tuen-mun" },
      { label: "北區", value: "north" },
      { label: "大埔", value: "tai-po" },
      { label: "沙田", value: "sha-tin" },
      { label: "西貢", value: "sai-kung" },
      { label: "離島", value: "islands" },
    ],
  },
];

export const districtValues = districts.flatMap((item) => item.district).map((location) => location.value) as [string, ...string[]];

export interface BasicInfo {
  cover_photo?: string | null;
  logo?: string | null;
  name: string | null;
  slug: string | null;
  status: StudioStatus;
  district: string | null;
  address: string | null;
  description: string | null;
}

export interface DayBusinessHour {
  day_of_week: daysOfWeekType;
  is_closed: boolean;
  open_time: string | null;
  end_time: string | null;
  price_type: PriceType;
}

export interface Price {
  price_type: PriceType;
  price: number;
}

//Social Platform
export type SocialPlatform = "website" | "instagram" | "facebook" | "youtube";
export type SocialLinks = Partial<Record<SocialPlatform, string>>;

//Payout Method
export type PayoutMethod = "fps" | "payme" | "bank-transfer";
