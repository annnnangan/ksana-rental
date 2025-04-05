"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { payoutMethodMap } from "@/lib/constants/studio-details";
import { PayoutMethod } from "@/services/model";
import { useRouter, useSearchParams } from "next/navigation";

const paymentMethod: { label: string; value?: PayoutMethod }[] = [{ label: "All" }, ...payoutMethodMap];

const PayoutMethodFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(method: string): void {
    const currentParams = new URLSearchParams(searchParams?.toString());
    currentParams.set("payoutMethod", method);
    if (method === "All") currentParams.delete("payoutMethod");
    router.push(`?${currentParams.toString()}`);
  }

  return (
    <Select onValueChange={handleChange} value={searchParams.get("payoutMethod") || ""}>
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
