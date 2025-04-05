import { cn } from "@/lib/utils/tailwind-utils";
import React from "react";
import { type LucideIcon } from "lucide-react";

import { PayoutStatus } from "@/services/model";
import { CircleCheck, CircleX } from "lucide-react";

interface Props {
  payoutStatus: PayoutStatus;
}

const statusMap: Record<
  PayoutStatus,
  { label: string; color: "text-red-500" | "text-green-500"; icon: LucideIcon }
> = {
  pending: { label: "Pending", color: "text-red-500", icon: CircleX },
  complete: { label: "Complete", color: "text-green-500", icon: CircleCheck },
};

const PayoutStatusBadge = ({ payoutStatus }: Props) => {
  const { color, label, icon: Icon } = statusMap[payoutStatus];
  return (
    <div className={cn("font-bold", color)}>
      <div className="flex gap-1 items-center">
        <Icon size={18} />
        {label}
      </div>
    </div>
  );
};

export default PayoutStatusBadge;
