import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Building2, User } from "lucide-react";
import clsx from "clsx";

interface Props {
  size?: "xs" | "sm" | "md" | "lg";
  avatarUrl: string | null;
  type: "user" | "studio";
}

const AvatarWithFallback = ({ size = "sm", avatarUrl, type }: Props) => {
  const avatarSize = clsx({
    "h-10 w-10": size === "xs",
    "h-12 w-12": size === "sm",
    "h-16 w-16": size === "md",
    "h-20 w-20": size === "lg",
  });

  return (
    <Avatar className={avatarSize}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} className="object-cover" />
      ) : (
        <AvatarFallback>
          {type === "user" ? <User /> : <Building2 />}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default AvatarWithFallback;
