"use client";
import { StudioOwnerSidebar } from "@/app/studio-owner/_components/StudioOwnerSidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import {
  CalendarCheck,
  CircleChevronLeft,
  CircleGauge,
  Contact,
  Dumbbell,
  HandCoins,
  House,
  KeyRound,
} from "lucide-react";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id: string }>();
  const studioId = params.id;
  const pathname = usePathname();
  const navItems = [
    {
      title: "基本資料",
      url: `/studio-owner/studio/${studioId}/onboarding/basic-info`,
      icon: CircleGauge,
    },
    {
      title: "營業時間及價錢",
      url: `/studio-owner/studio/${studioId}/onboarding/business-hour-and-price`,
      icon: House,
    },
    {
      title: "設備",
      url: `/studio-owner/studio/${studioId}/onboarding/equipment`,
      icon: Dumbbell,
    },
    {
      title: "大門密碼",
      url: `/studio-owner/studio/${studioId}/onboarding/door-password`,
      icon: KeyRound,
    },
    {
      title: "聯絡資料",
      url: `/studio-owner/studio/${studioId}/onboarding/contact`,
      icon: Contact,
    },
    {
      title: "收帳資料",
      url: `/studio-owner/studio/${studioId}/onboarding/payout-info`,
      icon: HandCoins,
    },
    {
      title: "確認申請",
      url: `/studio-owner/studio/${studioId}/onboarding/summary`,
      icon: CalendarCheck,
    },
  ];

  // Find the current nav item based on the URL
  const currentNavItem = navItems.find((item) => item.url === pathname);
  const currentTitle = currentNavItem?.title || "";
  return (
    <SidebarProvider>
      <StudioOwnerSidebar navItems={navItems} />

      <div className="w-full">
        <SidebarInset>
          <Link
            className="flex gap-x-2 items-center text-sm text-gray-500 ms-auto hover:-translate-x-3 transition-transform duration-200 ease-in-out"
            href="/studio-owner/studios"
          >
            <CircleChevronLeft size={20} />
            返回所有場地
          </Link>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/studio-owner/studios">
                    你的所有場地
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">場地建立</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="mx-auto w-full"> {children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
