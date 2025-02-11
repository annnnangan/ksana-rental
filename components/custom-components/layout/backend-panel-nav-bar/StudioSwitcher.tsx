import { ChevronsUpDown } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/shadcn/sidebar";
import { useEffect, useState } from "react";
import AvatarWithFallback from "../../AvatarWithFallback";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Studio {
  id: string;
  name: string;
  logo: string;
}

interface Props {
  availableStudios: Studio[];
  currentStudioId: string;
}

export function StudioSwitcher({ availableStudios, currentStudioId }: Props) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  const [activeStudio, setActiveStudio] = useState<Studio | null>({ id: "", name: "", logo: "" });

  useEffect(() => {
    const studio = availableStudios.find((studio) => studio.id == currentStudioId);
    if (studio) {
      setActiveStudio(studio);
    }
  }, [currentStudioId, availableStudios]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <AvatarWithFallback size="xxs" avatarUrl={activeStudio?.logo || ""} type={"studio"} shape="square" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeStudio?.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start" side={isMobile ? "bottom" : "right"} sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">所有場地</DropdownMenuLabel>
            {availableStudios.map((studio) => (
              <Link href={pathname.replace(/\/studio-owner\/studio\/\d+\/manage\//, `/studio-owner/studio/${studio.id}/manage/`)} key={studio.id}>
                <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                  <AvatarWithFallback size="xs" avatarUrl={studio.logo || ""} type={"studio"} />
                  <span className="font-bold">{studio.name}</span>
                </DropdownMenuItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
