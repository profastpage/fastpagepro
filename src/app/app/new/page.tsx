"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { normalizeVertical, persistVerticalChoice } from "@/lib/vertical";

function routeByVertical(vertical: ReturnType<typeof normalizeVertical>) {
  if (vertical === "restaurant") return "/linkhub";
  if (vertical === "ecommerce") return "/store";
  return "/builder";
}

export default function AppNewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const vertical = normalizeVertical(params?.get("vertical"));
    persistVerticalChoice(vertical);

    if (!user) {
      router.replace(`/signup?vertical=${vertical}`);
      return;
    }
    router.replace(routeByVertical(vertical));
  }, [loading, router, user]);

  return (
    <div className="grid min-h-screen place-items-center bg-black">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
    </div>
  );
}
