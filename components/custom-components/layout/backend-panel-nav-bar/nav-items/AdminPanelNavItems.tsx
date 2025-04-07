"use client";
import { CircleGauge, ClipboardMinus, Contact, FileClock, Flag, HandCoins, House, Landmark, LucideIcon, Settings2 } from "lucide-react";
import { NavItems, SidebarNavItems } from "./SidebarNavItems";

// const navItems: NavItems = {
//   Core: [
//     {
//       title: "Dashboard",
//       url: "/admin/dashboard",
//       icon: CircleGauge,
//     },
//     {
//       title: "Report",
//       url: "/admin/report",
//       icon: ClipboardMinus,
//     },
//     {
//       title: "Settings",
//       url: "/admin/settings",
//       icon: Settings2,
//     },
//   ],
//   Finance: [
//     {
//       title: "Payout",
//       url: "/admin/payout",
//       icon: HandCoins,
//     },
//     {
//       title: "Payout History",
//       url: "/admin/payout-history",
//       icon: FileClock,
//     },
//   ],
//   "User and Studio Management": [
//     {
//       title: "Complaint",
//       url: "/admin/complaint",
//       icon: Flag,
//     },

//     {
//       title: "Studios",
//       url: "/admin/studio",
//       icon: House,
//     },
//     {
//       title: "Users",
//       url: "/admin/users",
//       icon: Contact,
//     },
//   ],
// };

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
