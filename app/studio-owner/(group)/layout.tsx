import Link from "next/link";

import { auth } from "@/lib/next-auth-config/auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/shadcn/sidebar";
import { StudioOwnerPanelNavItems } from "@/components/custom-components/layout/backend-panel-nav-bar/nav-items/StudioOwnerPanelNavItems";
import { NavUserMenu } from "@/components/custom-components/layout/backend-panel-nav-bar/NavUser";
import LogoutButton from "@/components/custom-components/layout/main-nav-bar/LogoutButton";
import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { Calendar1 } from "lucide-react";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session)
    return (
      <ToastMessageWithRedirect type={"error"} message={"請先登入"} redirectPath={"/auth/login"} />
    );

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent className="mt-4">
          <StudioOwnerPanelNavItems />
        </SidebarContent>
        <SidebarRail />
        <SidebarFooter className="mb-4">
          <NavUserMenu
            userName={session.user.name!}
            userEmail={session.user.email!}
            userImage={session.user.image || ""}
          >
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/" className="flex items-center gap-1 w-full">
                <Calendar1 size={20} />
                切換回租場模式
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <LogoutButton direction="justify-start" />
            </DropdownMenuItem>
          </NavUserMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="px-5 w-full">
        <SidebarInset>
          <SidebarTrigger />
          {children}
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
