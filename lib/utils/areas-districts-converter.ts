import { districts } from "@/services/model";

export const findAreaByDistrictValue = (districtValue: string | null) => {
  if (districtValue === null) return;
  for (const areas of districts) {
    for (const district of areas.district) {
      if (district.value === districtValue) {
        return areas.area; // Return the area value
      }
    }
  }
  return null; // Return null if no match is found
};

export function getDistrictLabelByDistrictValue(value: string | null) {
  for (const region of districts) {
    for (const district of region.district) {
      if (district.value === value) {
        return district.label;
      }
    }
  }
  return null; // Return null if the value is not found
}
