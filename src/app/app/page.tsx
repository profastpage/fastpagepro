"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { normalizeVertical } from "@/lib/vertical";

export default function AppEntryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const vertical = normalizeVertical(params?.get("vertical"));
      router.replace(`/auth?vertical=${vertical}`);
      return;
    }
    router.replace("/hub");
  }, [loading, router, user]);

  return (
    <div className="grid min-h-screen place-items-center bg-black">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
    </div>
  );
}
