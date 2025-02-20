export const generateTimeslots = (type: "from" | "to") => {
  if (type === "from") {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      return `${hour.toString().padStart(2, "0")}:00`;
    });
  }

  if (type === "to") {
    return Array.from({ length: 25 }, (_, i) => {
      const hour = i;
      return `${hour.toString().padStart(2, "0")}:00`;
    });
  }
};
