"use client";

import { AdminPayoutFilters } from "@/app/admin/payout/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { PayoutStatus } from "@/services/model";

const statuses: {
  label: string;
  value?: PayoutStatus;
  color?: string;
}[] = [
  { label: "All" },
  { label: "Pending", value: "pending" },
  { label: "Complete", value: "complete" },
];

const PayoutStatusFilter = ({
  filter,
  setFilter,
}: {
  filter: AdminPayoutFilters;
  setFilter: React.Dispatch<React.SetStateAction<AdminPayoutFilters>>;
}) => {
  function handleChange(status: string): void {
    if (status === "All") {
      setFilter({ ...filter, payoutStatus: "" });
    } else {
      setFilter({ ...filter, payoutStatus: status });
    }
  }

  return (
    <Select onValueChange={handleChange}>
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

export default PayoutStatusFilter;
