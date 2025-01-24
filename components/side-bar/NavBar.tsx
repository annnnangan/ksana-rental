"use client";

import { LucideIcon } from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/shadcn/sidebar";
import { NavMain } from "./NavMain";
import { NavUserMenu } from "./NavUser";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavItems {
  sectionName: NavItem[];
}

interface Props extends React.ComponentProps<typeof Sidebar> {
  user?: User;
  navItems: Record<string, NavItem[]>;
}

export function NavBar({ user, navItems, ...props }: Props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {user && (
        <SidebarHeader>
          <NavUserMenu user={user} />
        </SidebarHeader>
      )}

      <SidebarContent className="mt-10">
        {(Object.keys(navItems) as string[]).map((section: string) => (
          <NavMain
            key={section}
            items={navItems[section] as NavItem[]}
            groupLabel={section}
          />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
