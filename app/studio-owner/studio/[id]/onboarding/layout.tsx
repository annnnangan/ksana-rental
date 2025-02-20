"use client";

import { NavMain } from "@/components/custom-components/layout/backend-panel-nav-bar/NavMain";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/shadcn/breadcrumb";
import { Separator } from "@/components/shadcn/separator";
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/shadcn/sidebar";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, CircleChevronLeft, CircleGauge, Contact, Dumbbell, HandCoins, House, ImageUp, KeyRound } from "lucide-react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id: string }>();
  const studioId = params.id;
  const pathname = usePathname();
  const navItems = [
    {
      title: "基本資料",
      url: `/studio-owner/studio/${studioId}/onboarding/basic-info`,
      icon: CircleGauge,
      completed: true,
    },
    {
      title: "營業時間及價格",
      url: `/studio-owner/studio/${studioId}/onboarding/business-hour-and-price`,
      icon: House,
    },
    {
      title: "設備",
      url: `/studio-owner/studio/${studioId}/onboarding/equipment`,
      icon: Dumbbell,
    },
    {
      title: "場地照片",
      url: `/studio-owner/studio/${studioId}/onboarding/gallery`,
      icon: ImageUp,
    },
    {
      title: "大門密碼",
      url: `/studio-owner/studio/${studioId}/onboarding/door-password`,
      icon: KeyRound,
    },
    {
      title: "社交媒體",
      url: `/studio-owner/studio/${studioId}/onboarding/social`,
      icon: Contact,
    },
    {
      title: "收帳資料",
      url: `/studio-owner/studio/${studioId}/onboarding/payout-info`,
      icon: HandCoins,
    },
    {
      title: "確認申請",
      url: `/studio-owner/studio/${studioId}/onboarding/confirmation`,
      icon: CalendarCheck,
    },
  ];

  // Find the current nav item based on the URL
  const currentNavItem = navItems.find((item) => item.url === pathname);
  const currentTitle = currentNavItem?.title || "";
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent className="mt-4">
          {navItems.map((item) => (
            <NavMain key={item.title} items={[item]} />
          ))}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <div className="px-5 lg:px-10 w-full">
        <SidebarInset>
          <Link className="mt-5 flex gap-x-2 items-center text-sm text-gray-500 ms-auto hover:-translate-x-3 transition-transform duration-200 ease-in-out" href="/studio-owner/studios">
            <CircleChevronLeft size={20} />
            返回所有場地
          </Link>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/studio-owner/studios">你的所有場地</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink>場地建立</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="pb-10">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
