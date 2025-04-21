"use client";
import { Suspense, useCallback, useEffect, useState } from "react";

import { newVerification, resendVerification } from "@/actions/auth";
import AuthResponse from "@/components/custom-components/auth/AuthResponse";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import LoadingSpinner from "@/components/custom-components/common/loading/LoadingSpinner";
const NewVerificationPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <NewVerificationContent />
    </Suspense>
  );
};

const NewVerificationContent = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const redirectUrl = searchParams.get("redirect");

  const handleResend = () => {
    if (!token) {
      setError("找不到驗證碼，無法驗證。");
      return;
    }

    resendVerification(token)
      .then((data) => {
        setSuccess(data.data?.message);
        setError(data.error?.message);
      })
      .catch(() => {
        setError("系統發生錯誤。");
      });
  };

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("找不到驗證碼，無法驗證。");
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.data?.message);
        setError(data.error?.message);
      })
      .catch(() => {
        setError("系統發生錯誤。");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex justify-center items-center px-5">
      <Card className="shadow-md w-[400px] flex flex-col items-center text-center">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle>確認你的驗證碼</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-2">
          {!success && !error && <BeatLoader />}
          {!success && <AuthResponse message={error} type={"error"} />}
          {success && <AuthResponse message={success} type={"success"} />}
          {error === "驗證碼已過期，無法驗證。" && (
            <Button variant="link" className="font-normal w-full" size="lg" onClick={handleResend}>
              重新發送驗證碼
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="link" className="font-normal w-full" size="sm">
            {!redirectUrl && <Link href={`/auth/login`}>返回登入頁面</Link>}
            {redirectUrl && <Link href={`/auth/login?redirect=${redirectUrl}`}>返回登入頁面</Link>}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewVerificationPage;
