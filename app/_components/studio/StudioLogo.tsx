import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface Props {
  logo: string;
}

const StudioLogo = ({ logo }: Props) => {
  return (
    <Avatar className="h-16 w-16">
      <AvatarImage src={logo} className="object-cover" />
    </Avatar>
  );
};

export default StudioLogo;
