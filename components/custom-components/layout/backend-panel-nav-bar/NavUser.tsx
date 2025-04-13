"use client";

import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/shadcn/sidebar";
import AvatarWithFallback from "../../common/AvatarWithFallback";

interface Props {
  userName: string;
  userEmail: string;
  userImage?: string;
  children?: React.ReactNode;
}

export function NavUserMenu({ userName, userEmail, userImage, children }: Props) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <AvatarWithFallback
                size="xxs"
                avatarUrl={userImage || ""}
                type={"user"}
                shape="square"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userName}</span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              {children && <ChevronsUpDown className="ml-auto size-4" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {children && (
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">{children}</DropdownMenuLabel>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
