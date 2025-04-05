import { AdminPanelNavItems } from "@/components/custom-components/layout/backend-panel-nav-bar/nav-items/AdminPanelNavItems";
import { NavUserMenu } from "@/components/custom-components/layout/backend-panel-nav-bar/NavUser";
import LogoutButton from "@/components/custom-components/layout/main-nav-bar/LogoutButton";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";

import { Sidebar, SidebarContent, SidebarFooter, SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/shadcn/sidebar";
import { auth } from "@/lib/next-auth-config/auth";

import { Calendar1 } from "lucide-react";
import Link from "next/link";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) return <ToastMessageWithRedirect type={"error"} message={"請先登入"} redirectPath={"/auth/login"} />;
  if (session && session.user.role === "user") return <ToastMessageWithRedirect type={"error"} message={"你沒有此權限"} redirectPath={"/"} />;
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent className="mt-4">
          <AdminPanelNavItems />
        </SidebarContent>
        <SidebarRail />
        <SidebarFooter className="mb-4">
          <NavUserMenu userName={session.user.name!} userEmail={session.user.email!} userImage={session.user.image || ""}>
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/" className="flex items-center gap-1 w-full">
                <Calendar1 size={20} />
                切換回租場模式
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <LogoutButton />
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
