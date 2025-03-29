"use client";
import { bookmarkStudio, removeBookmarkStudio } from "@/actions/studio";
import { useSessionUser } from "@/hooks/use-session-user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "react-toastify";

const BookmarkButton = ({ studioSlug, needRouterRefresh = false }: { studioSlug: string; needRouterRefresh: boolean }) => {
  const router = useRouter();
  const user = useSessionUser();
  const queryClient = useQueryClient();
  const [, startTransition] = useTransition();
  const [isBookmark, setBookmark] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isLoading, isError } = useStudioBookmark(studioSlug);

  useEffect(() => {
    if (data !== undefined) {
      setBookmark(data);
    }
  }, [data]);

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      toast("請先登入後才可收藏場地。", {
        position: "top-right",
        type: "error",
        autoClose: 1000,
      });
    } else {
      startTransition(() => {
        if (isBookmark === false) {
          bookmarkStudio(studioSlug).then((data) => {
            if (!data.success) {
              toast("無法收藏場地", {
                position: "top-right",
                type: "error",
                autoClose: 1000,
              });
            } else {
              toast("收藏成功", {
                position: "top-right",
                type: "success",
                autoClose: 1000,
              });
              setBookmark(!isBookmark);
              queryClient.invalidateQueries({ queryKey: ["bookmark", studioSlug] });
            }
          });
        } else {
          removeBookmarkStudio(studioSlug).then((data) => {
            if (!data.success) {
              toast("無法移除收藏", {
                position: "top-right",
                type: "error",
                autoClose: 1000,
              });
            } else {
              toast("移除收藏成功", {
                position: "top-right",
                type: "success",
                autoClose: 1000,
              });
              setBookmark(!isBookmark);
              queryClient.invalidateQueries({ queryKey: ["bookmark", studioSlug] });
            }
          });
        }
      });

      if (needRouterRefresh) {
        router.refresh();
      }
    }
  };

  return (
    <button onClick={handleBookmark}>
      <Bookmark size={30} fill={isBookmark ? "#01a2c7" : "#FFF"} strokeWidth={isBookmark ? "0" : "1"} />
    </button>
  );
};

export default BookmarkButton;

// React Query
const useStudioBookmark = (studioSlug: string) => {
  const user = useSessionUser();
  const isLoggedIn = user ? true : false; // Check if user is logged in

  return useQuery({
    queryKey: ["bookmark", studioSlug],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch(`/api/studio/${studioSlug}/bookmark`);
      if (!res.ok) {
        throw new Error("Failed to fetch bookmark");
      }
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data.isBookmarked as boolean;
    },
    staleTime: 5 * 60 * 1000,
    enabled: isLoggedIn && !!studioSlug, // Only fetch if user is logged in and studioSlug exists
  });
};
