"use client";
import ButtonLink from "@/components/custom-components/common/buttons/ButtonLink";
import SectionFallback from "@/components/custom-components/common/SectionFallback";
import { Button } from "@/components/shadcn/button";
import { House } from "lucide-react";

const error = ({ reset }: { reset: () => void }) => {
  return (
    <div className="space-y-3 flex flex-col items-center justify-center mt-32">
      <SectionFallback icon={House} fallbackText={"無法取得場地"} />
      <div className="flex gap-2 justify-center">
        <Button variant={"outline"} size="sm" onClick={() => reset()}>
          重試
        </Button>
        <ButtonLink href="/" variant="outline" size="sm">
          返回主頁
        </ButtonLink>
      </div>
    </div>
  );
};

export default error;
