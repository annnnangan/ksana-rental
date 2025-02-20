import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/shadcn/sidebar";

import { StudioOwnerPanelNavBar } from "@/components/custom-components/layout/backend-panel-nav-bar/StudioOwnerPanelNavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <StudioOwnerPanelNavBar />
      <main className="p-5 lg:p-10 w-full">
        <SidebarInset>
          <SidebarTrigger />
          {children}
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
