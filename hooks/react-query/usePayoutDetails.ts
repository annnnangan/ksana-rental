import { useQuery } from "@tanstack/react-query";

const usePayoutDetails = (startDate: string, endDate: string, slug: string) => {
  return useQuery({
    queryKey: ["payout-details", startDate, endDate, slug],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const params = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const res = await fetch(`/api/admin/studio/${slug}/payout-details?${params.toString()}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch payout data.");
      }

      const result = await res.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!startDate && !!endDate && !!slug,
  });
};

export default usePayoutDetails;
