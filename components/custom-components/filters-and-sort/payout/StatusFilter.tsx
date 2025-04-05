"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { PayoutStatus } from "@/services/model";
import { useRouter, useSearchParams } from "next/navigation";

const statuses: {
  label: string;
  value?: PayoutStatus;
  color?: string;
}[] = [
  { label: "All" },
  { label: "Pending", value: "pending" },
  { label: "Complete", value: "complete" },
];

const StatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(status: string): void {
    const currentParams = new URLSearchParams(searchParams?.toString() || "");
    currentParams.set("payoutStatus", status);
    if (status === "All") currentParams.delete("payoutStatus");
    router.push(`?${currentParams.toString()}`);
  }

  return (
    <Select
      onValueChange={handleChange}
      value={searchParams.get("payoutStatus") || ""}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((item) => (
          <SelectItem value={item.value || "All"} key={item.label}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
