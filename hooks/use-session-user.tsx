import { useSession } from "next-auth/react";

export const useSessionUser = () => {
  const session = useSession();
  return session.data?.user;
};
