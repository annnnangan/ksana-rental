import { useQuery } from "@tanstack/react-query";

const useAdminPayoutHistory = () => {
  return useQuery({
    queryKey: ["admin", "payout-history"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch(`/api/admin/payout-history`);

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

export default useAdminPayoutHistory;
