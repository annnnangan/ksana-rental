import React from "react";

import Link from "next/link";
import { Button } from "@/components/shadcn/button";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "lg" | "sm";
}

const ButtonLink = ({ href, children, className, variant = "link", size }: Props) => {
  return (
    <Button variant={variant} type="button" className={className} size={size}>
      <Link href={href}>{children}</Link>
    </Button>
  );
};

export default ButtonLink;
