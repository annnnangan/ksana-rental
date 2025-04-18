import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useAdminStudioPayoutList = (
  startDate: string,
  endDate: string,
  page: number,
  limit: number,
  slug?: string,
  orderBy?: string,
  orderDirection?: string,
  payoutMethod?: string,
  payoutStatus?: string
) => {
  return useQuery({
    queryKey: [
      "payout",
      startDate,
      endDate,
      page,
      limit,
      slug,
      orderBy,
      orderDirection,
      payoutMethod,
      payoutStatus,
    ],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const params = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(slug && { slug }),
        ...(payoutMethod && { payoutMethod }),
        ...(payoutStatus && { payoutStatus }),
        ...(orderBy && { orderBy }),
        ...(orderDirection && { orderDirection }),
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`/api/admin/payout?${params.toString()}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch payout data.");
      }

      const result = await res.json();
      return result.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!startDate && !!endDate,
    placeholderData: keepPreviousData,
  });
};

export default useAdminStudioPayoutList;
