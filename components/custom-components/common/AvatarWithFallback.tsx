import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import React from "react";
import { Building2, User } from "lucide-react";
import clsx from "clsx";

interface Props {
  size?: "xxs" | "xs" | "sm" | "md" | "lg";
  avatarUrl: string | null;
  type: "user" | "studio";
  shape?: "circle" | "square";
}

const AvatarWithFallback = ({ size = "sm", avatarUrl, type, shape = "circle" }: Props) => {
  const avatarSize = clsx({
    "h-8 w-8": size === "xxs",
    "h-10 w-10": size === "xs",
    "h-12 w-12": size === "sm",
    "h-16 w-16": size === "md",
    "h-20 w-20": size === "lg",
    "rounded-full": shape === "circle", // Circle shape by default
    "rounded-none rounded-md": shape === "square", // Square shape
  });

  return (
    <Avatar className={avatarSize}>
      {avatarUrl ? <AvatarImage src={avatarUrl} className="object-cover" /> : <AvatarFallback className={avatarSize}>{type === "user" ? <User /> : <Building2 />}</AvatarFallback>}
    </Avatar>
  );
};

export default AvatarWithFallback;
