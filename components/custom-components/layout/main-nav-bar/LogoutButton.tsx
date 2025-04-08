"use client";
import { Button } from "@/components/shadcn/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const LogoutButton = ({ direction = "justify-center" }: { direction?: string }) => {
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <Button variant="ghost" onClick={handleLogout} className={`p-0 h-5 w-full flex text-black hover:bg-transparent ${direction}`} type="button">
      <LogOut />
      Log out
    </Button>
  );
};

export default LogoutButton;
