import { auth } from "./auth";

//Get session information for server component
export const sessionUser = async () => {
  const session = await auth();
  return session?.user;
};

export const sessionUserRole = async () => {
  const session = await auth();
  return session?.user.role;
};
