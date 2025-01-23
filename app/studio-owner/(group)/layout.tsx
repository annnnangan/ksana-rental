"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shadcn/sidebar";
import { CircleGauge, House, Settings2 } from "lucide-react";
import { NavBar } from "../../../components/side-bar/NavBar";

const userData = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

const navItems = {
  Core: [
    {
      title: "Dashboard",
      url: "/studio-owner/dashboard",
      icon: CircleGauge,
    },
    {
      title: "Studios",
      url: "/studio-owner/studios",
      icon: House,
    },
    {
      title: "Settings",
      url: "/studio-owner/settings",
      icon: Settings2,
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <NavBar user={userData} navItems={navItems} />
      <SidebarInset>
        <SidebarTrigger className="-ml-1" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
