"use client";

import { useState } from "react";
import { useSessionUser } from "@/hooks/use-session-user";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/shadcn/button";
import AuthModal from "../auth/AuthModal";

export default function BookNowButton() {
  const user = useSessionUser();
  const router = useRouter();
  const params = useParams();
  const studioSlug = params.slug;

  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);

  const handleClick = () => {
    if (!user) {
      setIsOpenAuthModal(true);
    } else {
      router.push(`/booking?slug=${studioSlug}`);
    }
  };

  return (
    <>
      <Button onClick={handleClick}>立即預約</Button>
      <AuthModal isOpenModal={isOpenAuthModal} setOpenModal={setIsOpenAuthModal} />
    </>
  );
}
