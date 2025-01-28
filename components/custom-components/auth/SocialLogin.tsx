import { Button } from "@/components/shadcn/button";
import { FcGoogle } from "react-icons/fc";
import React from "react";

const SocialLogin = () => {
  return (
    <div>
      <Button
        className="w-full flex items-center gap-1"
        variant="outline"
        size="lg"
      >
        <FcGoogle />
        使用Google繼續
      </Button>
    </div>
  );
};

export default SocialLogin;
