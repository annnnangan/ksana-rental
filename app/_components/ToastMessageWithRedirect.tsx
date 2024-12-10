"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  type: "error" | "success";
  errorMessage: string;
  redirectPath: string;
}

const ToastMessageWithRedirect = ({
  type,
  errorMessage,
  redirectPath,
}: Props) => {
  const router = useRouter();

  useEffect(() => {
    toast(errorMessage, {
      position: "top-right",
      type: type,
      autoClose: 1000,
    });

    router.push(redirectPath);
  }, [router]);

  return null;
};

export default ToastMessageWithRedirect;
