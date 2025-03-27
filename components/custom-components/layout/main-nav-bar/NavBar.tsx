import Image from "next/image";
import Link from "next/link";

import { auth } from "@/lib/next-auth-config/auth";
import { userService } from "@/services/user/UserService";

import ButtonLink from "../../buttons/ButtonLink";
import { Button } from "@/components/shadcn/button";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/shadcn/menubar";
import AvatarWithFallback from "../../AvatarWithFallback";
import LogoutButton from "./LogoutButton";

const NavBar = async () => {
  const session = await auth();

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
        <div className="hidden md:flex">
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
              <Link href="/bookings">我的預約</Link>
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
                    <LogoutButton />
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        )}
      </div>

      {/* Mobile */}
    </div>
  );
};

export default NavBar;
