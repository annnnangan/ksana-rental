import { useQuery } from "@tanstack/react-query";

const useStudioDashboard = (studioId: string, timeframe: string, options = {}) => {
  return useQuery({
    queryKey: ["dashboard", "studio", studioId, timeframe],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const res = await fetch(`/api/studio/${studioId}/dashboard?dateRange=${timeframe ?? "last-6-months"}`);

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

export default useStudioDashboard;
