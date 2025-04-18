"use client";
import { AdminPayoutFilters } from "@/app/admin/payout/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { payoutMethodMap } from "@/lib/constants/studio-details";
import { PayoutMethod } from "@/services/model";

const paymentMethod: { label: string; value?: PayoutMethod }[] = [
  { label: "All" },
  ...payoutMethodMap,
];

const PayoutMethodFilter = ({
  filter,
  setFilter,
}: {
  filter: AdminPayoutFilters;
  setFilter: React.Dispatch<React.SetStateAction<AdminPayoutFilters>>;
}) => {
  function handleChange(method: string): void {
    if (method === "All") {
      setFilter({ ...filter, payoutMethod: "" });
    } else {
      setFilter({ ...filter, payoutMethod: method });
    }
  }

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Payment Method" />
      </SelectTrigger>
      <SelectContent>
        {paymentMethod.map((item) => (
          <SelectItem value={item.value || "All"} key={item.label}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PayoutMethodFilter;
