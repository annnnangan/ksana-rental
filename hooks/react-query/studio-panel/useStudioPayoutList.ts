import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useStudioPayoutList = (
  page: number,
  limit: number,
  studioId: string,
  options = {},
  startDate?: string
) => {
  return useQuery({
    queryKey: ["payout-list", studioId, page, limit, startDate],

    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const params = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(studioId && { studioId }),
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/studio/${studioId}/payout-list?${params.toString()}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch payout data.");
      }

      const result = await res.json();

      return result.data;
    },

    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    ...options,
  });
};

export default useStudioPayoutList;
