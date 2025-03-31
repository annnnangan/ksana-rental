"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/shadcn/sidebar";
import { Calendar1, CircleGauge, House, LogOut, LucideIcon, NotepadText } from "lucide-react";
import { DropdownMenuItem } from "../../../shadcn/dropdown-menu";
import { NavMain } from "./NavMain";
import { NavUserMenu } from "./NavUser";

import { useSessionUser } from "@/hooks/use-session-user";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavItems {
  [key: string]: NavItem[];
}

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

export function StudioOwnerPanelNavBar() {
  const user = useSessionUser();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="mt-4">
        {Object.keys(navItems).map((section: string) => (
          <NavMain key={section} items={navItems[section]} groupLabel={section} />
        ))}
      </SidebarContent>
      <SidebarRail />
      {user && (
        <SidebarFooter className="mb-4">
          <NavUserMenu userName={user.name!} userEmail={user.email!} userImage={user.image || ""}>
            <Link href="/">
              <DropdownMenuItem className="cursor-pointer">
                <Calendar1 />
                切換回租場模式
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </NavUserMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
