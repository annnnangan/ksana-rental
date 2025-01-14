"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { payoutMethod, PayoutMethod } from "@/services/model";

const paymentMethod: { label: string; value?: PayoutMethod }[] = [
  { label: "All" },
  ...payoutMethod,
];

const PaymentMethodFilter = () => {
  return (
    <Select>
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

export default PaymentMethodFilter;
