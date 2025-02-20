export function formatDateSpecificHours(data: any[]) {
  const groupedData: Record<string, any[]> = {};

  data.forEach(({ date, from, to, price_type }) => {
    const formattedDate = new Date(date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD

    if (!groupedData[formattedDate]) {
      groupedData[formattedDate] = [];
    }

    groupedData[formattedDate].push({ from, to, price_type });
  });

  // Convert grouped object into an array
  return Object.entries(groupedData).map(([date, timeslots]) => ({
    date,
    timeslots,
  }));
}
