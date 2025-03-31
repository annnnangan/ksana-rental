import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="border-gray-300 md:col-span-2">
      <CardHeader className="pb-1 space-y-1 md:space-y-1.5">
        <CardTitle className="text-sm md:text-base text-primary">正在營運之場地</CardTitle>
        <CardDescription className="text-xs md:text-sm "></CardDescription>
      </CardHeader>

      <CardContent className="pt-2 md:pt-1 w-full">{children}</CardContent>
    </Card>
  );
};

export default layout;
