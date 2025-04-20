"use client";
import { bookmarkStudio, removeBookmarkStudio } from "@/actions/studio";
import { useSessionUser } from "@/hooks/use-session-user";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "react-toastify";

const BookmarkButton = ({
  studioSlug,
  needRouterRefresh = false,
  currentIsBookmark = false,
}: {
  studioSlug: string;
  needRouterRefresh: boolean;
  currentIsBookmark: boolean;
}) => {
  const router = useRouter();
  const user = useSessionUser();
  const [, startTransition] = useTransition();
  const [isBookmark, setBookmark] = useState(currentIsBookmark ?? false);

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
      <Bookmark
        size={30}
        fill={isBookmark ? "#01a2c7" : "#FFF"}
        strokeWidth={isBookmark ? "0" : "1"}
      />
    </button>
  );
};

export default BookmarkButton;
