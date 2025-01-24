"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { string } from "zod";

export function NavMain({
  items,
  groupLabel,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;

    items?: {
      title: string;
      url: string;
    }[];
  }[];
  groupLabel: string;
}) {
  const currentPath = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items?.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={item.url === currentPath}
                className="text-lg"
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
