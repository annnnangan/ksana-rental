"use client";
import { login, register } from "@/actions/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { LoginSchema, RegisterSchema } from "@/lib/validations/zod-schema/auth";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AuthForm from "./AuthForm";

interface Props {
  isOpenModal: boolean;
  setOpenModal: (response: boolean) => void;
}

const AuthModal = ({ isOpenModal, setOpenModal }: Props) => {
  const pathname = usePathname();
  const [authType, setAuthType] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSwitchForm = () => {
    setAuthType((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN"));
  };

  return (
    <Dialog open={isOpenModal}>
      <DialogContent hideClose className="p-0 max-h-[90vh] overflow-y-auto">
        <X
          onClick={handleCloseModal}
          className="cursor-pointer w-5 h-5 text-gray-500 absolute top-0 right-0 me-5 mt-5"
        />
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        <div className="px-5 py-8">
          {authType === "LOGIN" && (
            <AuthForm
              type="LOGIN"
              schema={LoginSchema}
              defaultValues={{
                email: "",
                password: "",
              }}
              onSubmit={login}
              isModal={true}
              handleSwitchForm={handleSwitchForm}
              callbackUrl={pathname}
            />
          )}

          {authType === "REGISTER" && (
            <AuthForm
              type="REGISTER"
              schema={RegisterSchema}
              defaultValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              onSubmit={register}
              isModal={true}
              handleSwitchForm={handleSwitchForm}
              callbackUrl={pathname}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
