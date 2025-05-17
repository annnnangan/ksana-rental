"use client";
import {
  CalendarCog,
  CalendarRange,
  CircleGauge,
  ClipboardList,
  HandCoins,
  House,
} from "lucide-react";
import { useParams } from "next/navigation";
import { NavItems, SidebarNavItems } from "./SidebarNavItems";

export function StudioPanelNavItems() {
  const params = useParams();
  const studioId = params.id;

  const navItems: NavItems = {
    Core: [
      {
        title: "儀表板",
        url: `/studio-owner/studio/${studioId}/manage/dashboard`,
        icon: CircleGauge,
      },
      {
        title: "可預約時間及價錢",
        url: `/studio-owner/studio/${studioId}/manage/business-hour-and-price`,
        icon: CalendarCog,
      },
      {
        title: "管理預約",
        url: `/studio-owner/studio/${studioId}/manage/booking`,
        icon: ClipboardList,
      },
      {
        title: "預約日曆",
        url: `/studio-owner/studio/${studioId}/manage/calendar`,
        icon: CalendarRange,
      },
      {
        title: "場地資料",
        url: `/studio-owner/studio/${studioId}/manage/information`,
        icon: House,
      },
      {
        title: "結算",
        url: `/studio-owner/studio/${studioId}/manage/payout`,
        icon: HandCoins,
      },
    ],
  };
  return (
    <>
      <SidebarNavItems navItems={navItems} />
    </>
  );
}
