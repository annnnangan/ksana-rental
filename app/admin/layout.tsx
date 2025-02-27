"use client";
// import { NavBar } from "@/components/custom-components/layout/side-bar/NavBar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/shadcn/sidebar";

import { CircleGauge, ClipboardMinus, Contact, FileClock, Flag, HandCoins, House, Landmark, Settings2 } from "lucide-react";

const userData = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

const navItems = {
  Core: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: CircleGauge,
    },
    {
      title: "Report",
      url: "/admin/report",
      icon: ClipboardMinus,
    },
    {
      title: "Settings",
      url: "/studio-owner/settings",
      icon: Settings2,
    },
  ],
  Finance: [
    {
      title: "Payout",
      url: "/admin/payout",
      icon: HandCoins,
    },
    {
      title: "Booking Transactions",
      url: "/admin/booking-transactions",
      icon: Landmark,
    },
    {
      title: "Payout History",
      url: "/admin/payout-history",
      icon: FileClock,
    },
  ],
  "User and Studio Management": [
    {
      title: "Complaint",
      url: "/admin/complaint",
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <NavBar user={userData} navItems={navItems} />
      <SidebarInset className="md:-mx-5">
        <SidebarTrigger className="-ml-1" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
