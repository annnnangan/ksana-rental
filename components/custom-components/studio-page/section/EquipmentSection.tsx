import React from "react";

import { CircleCheck } from "lucide-react";

import Section from "./Section";
import { equipmentMap } from "@/lib/constants/studio-details";

interface Props {
  equipments: string[];
}

const EquipmentSection = ({ equipments }: Props) => {
  return (
    <Section title={"場地設施"}>
      <div className="flex flex-wrap gap-5">
        {equipments.map((equipment) => {
          const matchedResult = equipmentMap.find((item) => item.value === equipment);
          if (!matchedResult) return null;
          return (
            <p key={equipment} className="flex items-center">
              <CircleCheck size={20} className="me-1 content-center text-primary" />
              {matchedResult?.label}
            </p>
          );
        })}
      </div>
    </Section>
  );
};

export default EquipmentSection;
