"use client";

import ButtonLink from "@/components/custom-components/common/buttons/ButtonLink";
import { TriangleAlert } from "lucide-react";

const error = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-10 md:mt-28">
      <TriangleAlert className="text-red-600" />
      <h2 className="text-red-600 font-bold mb-3">發生錯誤</h2>
      <ButtonLink href="/" variant="ghost">
        返回主頁
      </ButtonLink>
    </div>
  );
};

export default error;
