import { useQuery } from "@tanstack/react-query";

const useStudioPayoutDetails = (
  studioId: string,
  startDate: string,
  endDate: string,
  options = {}
) => {
  return useQuery({
    queryKey: ["payout-details", studioId, startDate, endDate],

    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const params = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });
      const res = await fetch(`/api/studio/${studioId}/payout-details?${params.toString()}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch payout data.");
      }

      const result = await res.json();

      return result.data;
    },

    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export default useStudioPayoutDetails;
