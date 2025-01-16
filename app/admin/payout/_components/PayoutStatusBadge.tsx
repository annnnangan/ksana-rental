import { cn } from "@/lib/utils/tailwind-utils";
import React from "react";
import { statuses } from "./filter/StatusFilter";
import { PayoutStatus } from "@/services/model";
import { CircleCheck, CircleX } from "lucide-react";

interface Props {
  payoutStatus: PayoutStatus;
}

const PayoutStatusBadge = ({ payoutStatus }: Props) => {
  return (
    <div
      className={cn(
        "font-bold",
        statuses.find((status) => status.value === payoutStatus)?.color
      )}
    >
      <div className="flex gap-1 items-center">
        {payoutStatus === "complete" ? (
          <CircleCheck size={18} />
        ) : (
          <CircleX size={18} />
        )}
        {statuses.find((status) => status.value === payoutStatus)?.label}
      </div>
    </div>
  );
};

export default PayoutStatusBadge;
