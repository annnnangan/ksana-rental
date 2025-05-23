"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavItems {
  [key: string]: NavItem[];
}

export function SidebarNavItems({ navItems }: { navItems: NavItems }) {
  const currentPath = usePathname();

  const checkActivePath = (itemUrl: string) => {
    if (currentPath.startsWith("/admin/payout/studio") && itemUrl === "/admin/payout") {
      return true;
    } else if (itemUrl === "/admin/payout-history") {
      return currentPath === itemUrl;
    } else if (itemUrl === "/admin/payout") {
      return currentPath === itemUrl;
    }

    return currentPath.startsWith(itemUrl);
  };

  return (
    <>
      {Object.keys(navItems).map((section: string) => (
        <SidebarGroup key={section}>
          {section && <SidebarGroupLabel>{section}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems[section]?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={checkActivePath(item.url)}
                    className="h-full [&>svg]:size-4"
                  >
                    <Link href={item.url} className="h-full">
                      <item.icon />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
