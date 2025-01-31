import React from "react";
import { Button } from "../shadcn/button";
import Link from "next/link";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const ButtonLink = ({ href, children, className }: Props) => {
  return (
    <Button variant="link" type="button" className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
};

export default ButtonLink;
