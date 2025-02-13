"use client";

import { Calendar1, CalendarCog, CalendarRange, CircleGauge, HandCoins, House, LogOut, LucideIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/shadcn/sidebar";
import { DropdownMenuItem } from "../../../shadcn/dropdown-menu";
import { NavMain } from "./NavMain";
import { NavUserMenu } from "./NavUser";

import { useSessionUser } from "@/hooks/use-session-user";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { StudioSwitcher } from "./StudioSwitcher";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavItems {
  [key: string]: NavItem[];
}

const navItems = (studioId: string): NavItems => ({
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
      title: "所有預約",
      url: `/studio-owner/studio/${studioId}/manage/booking`,
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
});

interface Studio {
  id: string;
  name: string;
  logo: string;
}

interface Props {
  availableStudios: Studio[];
  currentStudioId: string;
}

export function StudioPanelNavBar({ availableStudios, currentStudioId }: Props) {
  const user = useSessionUser();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="mt-5">
        <StudioSwitcher availableStudios={availableStudios} currentStudioId={currentStudioId} />
      </SidebarHeader>
      <SidebarContent>
        {Object.keys(navItems(currentStudioId)).map((section: string) => (
          <NavMain key={section} items={navItems(currentStudioId)[section]} groupLabel={section} />
        ))}
      </SidebarContent>
      <SidebarRail />
      {user && (
        <SidebarFooter className="mb-4">
          <NavUserMenu userName={user.name!} userEmail={user.email!} userImage={user.image || ""}>
            <Link href="/studio-owner/dashboard">
              <DropdownMenuItem className="cursor-pointer">
                <Calendar1 />
                切換回場主模式
              </DropdownMenuItem>
            </Link>

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
