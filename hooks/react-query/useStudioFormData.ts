import { keepPreviousData, useQuery } from "@tanstack/react-query";

const useStudioFormData = (studioId: string) => {
  return useQuery({
    queryKey: ["studioFormData", studioId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const res = await fetch(`/api/studio/${studioId}/all-form-details`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch payout data.");
      }

      const result = await res.json();
      return result.data;
    },
    staleTime: 60 * 60 * 1000, // data is fresh for 1 hour
    enabled: !!studioId, // only run the query if `studioId` is available
    placeholderData: keepPreviousData,
  });
};

export default useStudioFormData;
