"use client";
import { CircleGauge, House, NotepadText } from "lucide-react";
import { NavItems, SidebarNavItems } from "./SidebarNavItems";

const navItems: NavItems = {
  Core: [
    {
      title: "儀表板",
      url: "/studio-owner/dashboard",
      icon: CircleGauge,
    },
    {
      title: "所有場地",
      url: "/studio-owner/studios",
      icon: House,
    },
    {
      title: "幫助中心",
      url: "/studio-owner/helps",
      icon: NotepadText,
    },
  ],
};

export function StudioOwnerPanelNavItems() {
  return (
    <>
      <SidebarNavItems navItems={navItems} />
    </>
  );
}
