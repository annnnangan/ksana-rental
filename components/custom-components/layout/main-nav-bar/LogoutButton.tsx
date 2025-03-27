"use client";
import { Button } from "@/components/shadcn/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <Button variant="link" onClick={handleLogout} className="p-0 text-black" type="button">
      <LogOut />
      Log out
    </Button>
  );
};

export default LogoutButton;
