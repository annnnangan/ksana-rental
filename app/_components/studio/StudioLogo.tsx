import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import clsx from "clsx"; // Utility for conditionally combining class names

interface Props {
  logo: string;
  size?: "sm" | "md" | "lg";
}

const StudioLogo = ({ logo, size = "sm" }: Props) => {
  return (
    <Avatar
      className={clsx("rounded-full", {
        "h-16 w-16": size === "sm",
        "h-20 w-20": size === "md",
        "h-24 w-24": size === "lg",
      })}
    >
      <AvatarImage src={logo} className="object-cover" />
    </Avatar>
  );
};

export default StudioLogo;
