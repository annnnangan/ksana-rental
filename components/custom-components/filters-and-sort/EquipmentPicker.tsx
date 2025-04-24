import { Button } from "@/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { equipmentMap } from "@/lib/constants/studio-details";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  isModal: boolean;
}

const EquipmentPicker = ({ isModal }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  // Keep selectedEquipment in sync with the URL
  useEffect(() => {
    const equipmentFromParams = searchParams.get("equipment");
    const parsed = equipmentFromParams ? equipmentFromParams.split(",") : [];
    setSelectedEquipment(parsed);
  }, [searchParams]);

  const updateSearchParams = (newSelection: string[]) => {
    const params = new URLSearchParams(searchParams);

    if (newSelection.length > 0) {
      params.set("equipment", newSelection.join(","));
    } else {
      params.delete("equipment");
    }
    params.delete("page");

    const query = params.size ? `?${params.toString()}` : "";
    router.push(`/explore-studios${query}`);
  };

  const handleSelectEquipment = (value: string) => {
    const updated = selectedEquipment.includes(value)
      ? selectedEquipment.filter((item) => item !== value)
      : [...selectedEquipment, value];

    setSelectedEquipment(updated);
    updateSearchParams(updated);
  };

  return (
    <div className={isModal ? "" : "max-w-[15rem]"}>
      <p className="text-xs rounded-sm mb-1">場地設備:</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
          >
            <span className="truncate">
              {selectedEquipment.length > 0
                ? selectedEquipment
                    .map((val) => equipmentMap.find((item) => item.value === val)?.label)
                    .join(", ")
                : "設備"}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full" side={isModal ? "top" : "right"} align="start">
          {equipmentMap.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.value}
              checked={selectedEquipment.includes(item.value)}
              onCheckedChange={() => handleSelectEquipment(item.value)}
              onSelect={(e) => e.preventDefault()}
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EquipmentPicker;
