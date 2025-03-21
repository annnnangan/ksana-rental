import { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/shadcn/dropdown-menu";
import { equipmentMap } from "@/lib/constants/studio-details";
import { ChevronDown } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import { useSearchParams } from "next/navigation";

interface Props {
  isModal: boolean;
  updateQueryString: (type: string, value: string) => void;
}

const EquipmentPicker = ({ isModal, updateQueryString }: Props) => {
  const searchParams = useSearchParams();
  //@ts-ignore
  const [selectedEquipment, setSelectedEquipment] = useState<string[] | []>(searchParams.get("equipment") ? searchParams.get("equipment")?.split(",") : []);
  //@ts-ignore
  const [debouncedSelectedEquipment, setDebouncedSelectedEquipment] = useState<string[] | []>(searchParams.get("equipment") ? searchParams.get("equipment")?.split(",") : []);

  const debounced = useDebounceCallback(setDebouncedSelectedEquipment, 2000);

  useEffect(() => {
    if (debouncedSelectedEquipment.length > 0) {
      updateQueryString("equipment", debouncedSelectedEquipment.join(","));
    } else {
      updateQueryString("equipment", "");
    }
  }, [debouncedSelectedEquipment]);

  const handleSelectEquipment = (selectedItem: string, value: string) => {
    const updatedSelection = selectedEquipment?.some((selected) => selected === value) ? selectedEquipment.filter((item) => item !== value) : [...selectedEquipment, value];

    setSelectedEquipment(updatedSelection);
    debounced(updatedSelection);
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
            <span className="truncate">{selectedEquipment.length > 0 ? selectedEquipment.map((val) => equipmentMap.find((item) => item.value === val)?.label).join(", ") : "設備"}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full" side={isModal ? "top" : "right"} align="start">
          {equipmentMap.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.value}
              checked={selectedEquipment?.some((selected) => selected === item.value)}
              onCheckedChange={() => handleSelectEquipment(item.label, item.value)} // Pass the label and value
              onSelect={(e) => {
                e.preventDefault();
              }}
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
