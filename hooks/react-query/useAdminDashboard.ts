import { useQuery } from "@tanstack/react-query";

const useAdminDashboard = (timeframe: string) => {
  return useQuery({
    queryKey: ["dashboard", "admin", timeframe],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch(`/api/admin/dashboard?dateRange=${timeframe ?? "last-6-months"}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch data.");
      }
      const result = await res.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export default useAdminDashboard;
