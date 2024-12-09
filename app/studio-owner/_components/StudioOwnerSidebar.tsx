"use client";

import { LucideIcon } from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface NavItems {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface Props extends React.ComponentProps<typeof Sidebar> {
  user?: User;
  navItems: NavItems[];
}

export function StudioOwnerSidebar({ user, navItems, ...props }: Props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {user && (
        <SidebarHeader>
          <NavUser user={user} />
        </SidebarHeader>
      )}
      <SidebarContent className="mt-10">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
