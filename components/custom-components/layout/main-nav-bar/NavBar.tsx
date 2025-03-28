import Image from "next/image";
import Link from "next/link";

import { auth } from "@/lib/next-auth-config/auth";
import { userService } from "@/services/user/UserService";

import ButtonLink from "../../buttons/ButtonLink";
import { Button } from "@/components/shadcn/button";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/shadcn/menubar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/shadcn/sheet";
import AvatarWithFallback from "../../AvatarWithFallback";
import LogoutButton from "./LogoutButton";
import { Menu } from "lucide-react";

const NavBar = async () => {
  const session = await auth();

  //@ts-ignore
  const studioCount = (await userService.countStudioByUserId(session?.user?.id))?.data.studio_count || 0;

  return (
    <div className="flex justify-between bg-white rounded-full px-5 py-1">
      <div className="shrink-0">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width="90" height="50" />
        </Link>
      </div>

      {/* Desktop */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex md:items-center">
          <div>
            <ButtonLink href="/explore-studios">探索所有場地</ButtonLink>
            {!session?.user && <ButtonLink href={"/auth/register?redirect=/studio-owner/dashboard"}>場地註冊</ButtonLink>}
            {session?.user && studioCount === 0 && <ButtonLink href={"/studio-owner/studios"}>建立你的第一個場地</ButtonLink>}
            {session?.user && studioCount > 0 && <ButtonLink href={"/studio-owner/dashboard"}>切換為場主模式</ButtonLink>}
          </div>

          {!session?.user && (
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
          )}

          {session?.user && (
            <div className="flex items-center gap-3">
              <Button variant="link" type="button" className="hidden md:flex">
                <Link href="/manage-bookings">我的預約</Link>
              </Button>
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>
                    <AvatarWithFallback avatarUrl={session?.user?.image!} type={"user"} size="xs" />
                  </MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      <div className="flex flex-row gap-2 items-center">
                        <AvatarWithFallback avatarUrl={session?.user?.image!} type={"user"} size="xs" />
                        <div className="flex flex-col">
                          <p className="font-bold">{session!.user.name}</p>
                          <p className="text-sm">{session!.user.email}</p>
                        </div>
                      </div>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                      <Link href="/manage-bookings" className="w-full">
                        我的預約
                      </Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link href="/bookmarks" className="w-full">
                        我的收藏
                      </Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link href="/account-settings" className="w-full">
                        帳號管理
                      </Link>
                    </MenubarItem>
                    <MenubarItem>
                      <LogoutButton />
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          )}
        </div>
      </div>

      {/* Mobile */}
      <Sheet>
        <SheetTrigger className="block md:hidden">
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>

            <div className="flex flex-col items-center">
              <AvatarWithFallback avatarUrl={session?.user?.image!} type={"user"} size="lg" />
              {session?.user && (
                <>
                  <p className="font-bold">{session!.user.name}</p>
                  <p className="text-sm">{session!.user.email}</p>
                </>
              )}
            </div>

            {!session?.user && (
              <div className="flex justify-center gap-3 flex-wrap">
                <ButtonLink href="/auth/login" className="w-full text-md">
                  登入
                </ButtonLink>

                <ButtonLink href="/auth/register" className="w-full text-md">
                  會員註冊
                </ButtonLink>

                <ButtonLink href={"/auth/register?redirect=/studio-owner/dashboard"} className="w-full text-md">
                  場地註冊
                </ButtonLink>
              </div>
            )}

            <div className="space-y-2">
              <ButtonLink href="/explore-studios" className="w-full text-md">
                探索所有場地
              </ButtonLink>

              {session?.user && (
                <>
                  <ButtonLink href={"/manage-bookings"} className="w-full text-md">
                    我的預約
                  </ButtonLink>

                  <ButtonLink href={"/bookmarks"} className="w-full text-md">
                    我的收藏
                  </ButtonLink>

                  <ButtonLink href={"/bookmarks"} className="w-full text-md">
                    帳號管理
                  </ButtonLink>
                  {studioCount === 0 && (
                    <ButtonLink href={"/studio-owner/studios"} className="w-full text-md">
                      建立你的第一個場地
                    </ButtonLink>
                  )}
                  {studioCount > 0 && (
                    <ButtonLink href={"/studio-owner/dashboard"} className="w-full text-md">
                      切換為場主模式
                    </ButtonLink>
                  )}
                </>
              )}
            </div>

            {session?.user && <LogoutButton />}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavBar;
