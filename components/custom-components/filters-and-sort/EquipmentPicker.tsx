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
import { useDebounceCallback } from "usehooks-ts";

interface Props {
  isModal: boolean;
}

const EquipmentPicker = ({ isModal }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedEquipment, setSelectedEquipment] = useState<string[] | []>(
    //@ts-expect-error expected
    searchParams.get("equipment") ? searchParams.get("equipment")?.split(",") : []
  );

  const [debouncedSelectedEquipment, setDebouncedSelectedEquipment] = useState<string[] | []>(
    //@ts-expect-error expected
    searchParams.get("equipment") ? searchParams.get("equipment")?.split(",") : []
  );

  useEffect(() => {
    const newEquipment = searchParams.get("equipment")
      ? searchParams.get("equipment")?.split(",")
      : [];
    //@ts-expect-error expected
    setSelectedEquipment(newEquipment);
  }, [searchParams]);

  const debounced = useDebounceCallback(setDebouncedSelectedEquipment, 2000);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSelectedEquipment.length > 0) {
      params.set("equipment", debouncedSelectedEquipment.join(","));
    } else {
      params.delete("equipment");
    }
    params.delete("page");
    const query = params.size ? "?" + params.toString() : "";
    router.push("/explore-studios" + query);
  }, [debouncedSelectedEquipment, searchParams, router]);

  const handleSelectEquipment = (selectedItem: string, value: string) => {
    const updatedSelection = selectedEquipment?.some((selected) => selected === value)
      ? selectedEquipment.filter((item) => item !== value)
      : [...selectedEquipment, value];
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
