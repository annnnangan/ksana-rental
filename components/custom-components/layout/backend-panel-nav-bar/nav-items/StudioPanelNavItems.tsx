"use client";
import { CalendarCog, CalendarRange, CircleGauge, HandCoins, House } from "lucide-react";
import { NavItems, SidebarNavItems } from "./SidebarNavItems";

const navItems: NavItems = {
  Core: [
    {
      title: "儀表板",
      url: `dashboard`,
      icon: CircleGauge,
    },
    {
      title: "可預約時間及價錢",
      url: `business-hour-and-price`,
      icon: CalendarCog,
    },
    {
      title: "所有預約",
      url: `booking`,
      icon: CalendarRange,
    },
    {
      title: "場地資料",
      url: `information`,
      icon: House,
    },
    {
      title: "結算",
      url: `payout`,
      icon: HandCoins,
    },
  ],
};

export function StudioPanelNavItems() {
  return (
    <>
      <SidebarNavItems navItems={navItems} />
    </>
  );
}
