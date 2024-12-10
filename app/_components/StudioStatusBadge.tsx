import { Badge } from "@/components/ui/badge";
import { StudioStatus } from "@/services/model";

import React from "react";

const statusMap: Record<StudioStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-stone-500" },
  reviewing: { label: "Reviewing", color: "bg-cyan-500" },
  suspended: { label: "Suspended", color: "bg-rose-600" },
  active: { label: "Active", color: "bg-green-600" },
  closed: { label: "Closed", color: "bg-gray-300" },
};

const IssueStatusBadge = ({ status }: { status: StudioStatus }) => {
  return (
    <Badge className={`${statusMap[status].color} pointer-events-none`}>
      {statusMap[status].label}
    </Badge>
  );
};

export default IssueStatusBadge;
