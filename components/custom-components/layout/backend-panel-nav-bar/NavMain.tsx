import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/shadcn/sidebar";
import { Check, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
  groupLabel,
  showTick,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    completed?: boolean;
  }[];
  groupLabel?: string;
  showTick?: boolean;
}) {
  const currentPath = usePathname();

  return (
    <SidebarGroup>
      {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items?.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.url === currentPath} className="text-xl h-full [&>svg]:size-6">
                <Link href={item.url} className="h-full">
                  {showTick ? (
                    <div className="bg-green-500 rounded-full">
                      <Check className="text-white" />
                    </div>
                  ) : (
                    item.icon && <item.icon />
                  )}
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
