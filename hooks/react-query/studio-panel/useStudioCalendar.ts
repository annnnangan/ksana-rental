import { useQuery } from "@tanstack/react-query";

const useStudioCalendar = (studioId: string, startDate: string, endDate: string, options = {}) => {
  return useQuery({
    queryKey: ["calendar", "studio", studioId, startDate, endDate],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const res = await fetch(
        `/api/studio/${studioId}/calendar?startDate=${startDate}&endDate=${endDate}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "無法取得資料");
      }
      const result = await res.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export default useStudioCalendar;
