import React from "react";

import Link from "next/link";
import { Button } from "@/components/shadcn/button";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
}

const ButtonLink = ({ href, children, className, variant = "link" }: Props) => {
  return (
    <Button variant={variant} type="button" className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
};

export default ButtonLink;
