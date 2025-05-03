"use client";

import { getSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function UserID({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();

      if (session?.user?.id) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "fetch_user_id",
          user_id: session.user.id,
        });
      }
    };

    fetchSession();
  }, [pathname, searchParams]);

  return <>{children}</>;
}
