import { auth } from "@/lib/next-auth-config/auth";
import { userService } from "@/services/user/UserService";
import ButtonLink from "@/components/custom-components/ButtonLink";

const BecomeStudioOwner = async () => {
  const session = await auth();

  if (!session?.user)
    return (
      <ButtonLink href={"/auth/register?redirect=/studio-owner/dashboard"}>
        場地註冊
      </ButtonLink>
    );

  const studioCount =
    (await userService.countStudioByUserId(session!.user!.id))?.data
      .studio_count || 0;

  if (session?.user && studioCount === 0)
    return (
      <ButtonLink href={"/studio-owner/studios"}>建立你的第一個場地</ButtonLink>
    );

  if (session?.user && studioCount > 0)
    return (
      <ButtonLink href={"/studio-owner/dashboard"}>切換為場主模式</ButtonLink>
    );
};

export default BecomeStudioOwner;
