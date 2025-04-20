import { useQuery } from "@tanstack/react-query";

const useStudioPayoutList = (studioId: string) => {
  return useQuery({
    queryKey: ["studio-status", studioId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch(`/api/studio/${studioId}/status`);

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

export default useStudioPayoutList;
