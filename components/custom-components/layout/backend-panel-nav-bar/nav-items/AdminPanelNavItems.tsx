"use client";
import { CircleGauge, ClipboardMinus, Contact, FileClock, Flag, HandCoins, House, Landmark, LucideIcon, Settings2 } from "lucide-react";
import { NavItems, SidebarNavItems } from "./SidebarNavItems";

const navItems: NavItems = {
  Core: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: CircleGauge,
    },
    {
      title: "Report",
      url: "report",
      icon: ClipboardMinus,
    },
    {
      title: "Settings",
      url: "settings",
      icon: Settings2,
    },
  ],
  Finance: [
    {
      title: "Payout",
      url: "payout",
      icon: HandCoins,
    },
    {
      title: "Booking Transactions",
      url: "booking-transactions",
      icon: Landmark,
    },
    {
      title: "Payout History",
      url: "payout-history",
      icon: FileClock,
    },
  ],
  "User and Studio Management": [
    {
      title: "Complaint",
      url: "complaint",
      icon: Flag,
    },

    {
      title: "Studios",
      url: "/admin/studios",
      icon: House,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Contact,
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
