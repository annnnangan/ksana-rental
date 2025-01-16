import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PayoutStatus } from "@/services/model";

export const statuses: {
  label: string;
  value?: PayoutStatus;
  color?: string;
}[] = [
  { label: "All" },
  {
    label: "Pending",
    value: "pending",
    color: "text-red-500",
  },
  {
    label: "Complete",
    value: "complete",
    color: "text-green-500",
  },
];

const StatusFilter = () => {
  return (
    <Select>
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
