"use client";
import { Button, Flex, Spinner } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
  studioSlug: string;
}

const Buttons = ({ studioSlug }: Props) => {
  return (
    <Flex gap="4" style={{ marginTop: "20px" }}>
      <Button size="2">
        <Link
          href={{
            pathname: "/booking/date-time",
            query: { studio: studioSlug },
          }}
          className="px-8"
        >
          繼續預約
        </Link>
      </Button>

      <Button variant="outline">
        <Link className="px-8" href="/studio">
          查看所有預約
        </Link>
      </Button>
    </Flex>
  );
};

export default Buttons;
