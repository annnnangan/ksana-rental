"use client";
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const StudioSort = () => {
  const router = useRouter();
  const pathname = usePathname(); // Ensure we use the correct base path
  const searchParams = useSearchParams();

  function handleChange(selectedItem: string): void {
    const params = new URLSearchParams(searchParams.toString()); // Convert to a mutable object
    if (selectedItem === "rating-high-to-low") {
      params.delete("orderBy");
    } else {
      params.set("orderBy", selectedItem);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center">
      <p className="text-gray-500">排序：</p>
      <Select onValueChange={handleChange} value={searchParams.get("orderBy") || "rating-high-to-low"}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating-high-to-low">評價最高至低</SelectItem>
          <SelectItem value="completed-booking-high-to-low">完成預約數量最高至低</SelectItem>
          <SelectItem value="min-price-low-to-high">價錢最低至最高</SelectItem>
          <SelectItem value="min-price-high-to-low">價錢最高至最低</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StudioSort;
