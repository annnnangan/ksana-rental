"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

const ToastMessage = () => {
  // Deleting the cookie after use
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  useEffect(() => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith("error="));
    console.log(cookies);

    if (cookies) {
      toast("你所選擇的Studio不存在。", {
        position: "top-right",
        type: "error",
        autoClose: 1000,
      });

      setTimeout(() => {
        deleteCookie("error");
      }, 0);
    }
  }, []);
  return <></>;
};

export default ToastMessage;
