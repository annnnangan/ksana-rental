import React, { PropsWithChildren } from "react";
import { Text } from "@radix-ui/themes";

const ErrorMessage = ({ children }: PropsWithChildren) => {
  if (!children) return null;
  return <p className="text-sm mt-1 text-red-600 ">{children}</p>;
};

export default ErrorMessage;
