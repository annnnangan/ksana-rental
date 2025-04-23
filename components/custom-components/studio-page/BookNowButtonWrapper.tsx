import React from "react";
import BookNowButton from "./BookNowButton";
import { auth } from "@/lib/next-auth-config/auth";

const BookNowButtonWrapper = async () => {
  const session = await auth();
  const isLoggedIn = session?.user.id ? true : false;
  return <BookNowButton isLoggedIn={isLoggedIn} />;
};

export default BookNowButtonWrapper;
