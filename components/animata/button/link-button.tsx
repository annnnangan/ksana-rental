import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

interface Props {
  href: string;
  children: string;
}

export default function LinkButton({ children, href }: Props) {
  return (
    <Link href={href}>
      <Button
        variant="link"
        className="text-sm group flex items-center justify-center gap-1 rounded-md py-0 px-0 hover:cursor-pointer hover:text-brand-800"
      >
        {children}
        <MoveUpRight
          height={20}
          width={20}
          className="opacity-75 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:scale-110 group-hover:text-brand-800 group-hover:opacity-100"
        />
      </Button>
    </Link>
  );
}
