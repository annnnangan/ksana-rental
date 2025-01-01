"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  type: "error" | "success";
  message: string;
  redirectPath: string;
}

const ToastMessageWithRedirect = ({ type, message, redirectPath }: Props) => {
  const router = useRouter();

  useEffect(() => {
    toast(message, {
      position: "top-right",
      type: type,
      autoClose: 1000,
    });

    router.push(redirectPath);
  }, [message, type, router, redirectPath]);

  return null;
};

export default ToastMessageWithRedirect;
