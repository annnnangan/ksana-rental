"use client";
import { Button } from "@/components/shadcn/button";
import { TriangleAlert } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ height: "calc(100vh - 100px)" }}
    >
      <TriangleAlert className="text-red-600" />
      <h2 className="text-red-600 font-bold mb-3">Something went wrong!</h2>
      <Button variant="ghost" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
