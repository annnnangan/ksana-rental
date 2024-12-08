import { districts } from "@/services/model";

export const findAreaByDistrictValue = (districtValue: string | null) => {
  if (districtValue === null) return;
  for (const areas of districts) {
    for (const district of areas.district) {
      if (district.value === districtValue) {
        return areas.area.value; // Return the area value
      }
    }
  }
  return null; // Return null if no match is found
};
