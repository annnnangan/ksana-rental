"use client";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

// From Gordon: What is the purpose of this function except setting the QueryClient ?
const QueryClientProvider = ({ children }: PropsWithChildren) => {
  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>;
};

export default QueryClientProvider;
