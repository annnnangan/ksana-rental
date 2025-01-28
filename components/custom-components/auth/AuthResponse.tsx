import { cn } from "@/lib/utils/tailwind-utils";
import { CheckCircleIcon } from "lucide-react";
import { BsExclamationTriangle } from "react-icons/bs";
import React from "react";

interface Props {
  type: "success" | "error";
  message?: string;
}

const AuthResponse = ({ type, message }: Props) => {
  if (!message) return null;
  return (
    <div
      className={cn(
        "p-3 rounded-md flex items-center gap-x-2 text-sm",
        type === "success"
          ? "text-emerald-500 bg-emerald-500/15"
          : "text-destructive bg-destructive/15"
      )}
    >
      {type === "success" ? (
        <CheckCircleIcon className="h-4 w-4" />
      ) : (
        <BsExclamationTriangle className="h-4 w-4" />
      )}

      <p>{message}</p>
    </div>
  );
};

export default AuthResponse;
