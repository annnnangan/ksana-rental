import { Button } from "@/components/shadcn/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/next-auth-config/routes";

interface Props {
  callbackUrl?: string;
}

export const SocialLogin = ({ callbackUrl }: Props) => {
  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div>
      <Button className="w-full flex items-center gap-1" variant="outline" size="lg" onClick={() => onClick("google")}>
        <FcGoogle />
        使用Google繼續
      </Button>
    </div>
  );
};
