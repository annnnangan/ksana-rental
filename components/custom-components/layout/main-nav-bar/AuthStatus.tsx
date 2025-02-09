"use client";
import { Button } from "@/components/shadcn/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/shadcn/menubar";

import Link from "next/link";
import React from "react";

import { LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Skeleton } from "@/components/shadcn/skeleton";
import AvatarWithFallback from "@/components/custom-components/AvatarWithFallback";

const AuthStatus = () => {
  const { status, data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  if (status === "loading") return <Skeleton className="w-[100px] h-[20px]" />;

  if (status === "unauthenticated")
    return (
      <div className="gap-3">
        <Button type="button" variant="link">
          <Link className="nav-link" href="/auth/login">
            登入
          </Link>
        </Button>

        <Button type="button">
          <Link className="nav-link" href="/auth/register">
            註冊
          </Link>
        </Button>
      </div>
    );

  return (
    <div className="flex items-center gap-3">
      <Button variant="link" type="button" className="hidden md:flex">
        <Link href="/bookings">我的預約</Link>
      </Button>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <AvatarWithFallback
              avatarUrl={session!.user!.image!}
              type={"user"}
              size="xs"
            />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <div className="flex flex-row gap-2 items-center">
                <AvatarWithFallback
                  avatarUrl={session!.user!.image!}
                  type={"user"}
                  size="xs"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{session!.user.name}</p>
                  <p className="text-sm">{session!.user.email}</p>
                </div>
              </div>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href="/manage-bookings">我的預約</Link>
            </MenubarItem>
            <MenubarItem>
              <Link href="/bookmarks">我的收藏</Link>
            </MenubarItem>
            <MenubarItem>
              <Link href="/account-settings">帳號管理</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href="/studio-owner/studios"> 管理場地</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Button
                variant="link"
                onClick={handleLogout}
                className="p-0 text-black"
                type="button"
              >
                <LogOut />
                Log out
              </Button>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default AuthStatus;
