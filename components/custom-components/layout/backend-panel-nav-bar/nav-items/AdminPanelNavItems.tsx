"use client";
import { CircleGauge, FileClock, HandCoins, House } from "lucide-react";
import { NavItems, SidebarNavItems } from "./SidebarNavItems";

const navItems: NavItems = {
  Core: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: CircleGauge,
    },
    {
      title: "Studios",
      url: "/admin/studio",
      icon: House,
    },
  ],
  Finance: [
    {
      title: "Payout",
      url: "/admin/payout",
      icon: HandCoins,
    },
    {
      title: "Payout History",
      url: "/admin/payout-history",
      icon: FileClock,
    },
  ],
};

export function AdminPanelNavItems() {
  return (
    <>
      <SidebarNavItems navItems={navItems} />
    </>
  );
}
