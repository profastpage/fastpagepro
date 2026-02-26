"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { normalizeVertical, persistVerticalChoice, verticalToSignupHref } from "@/lib/vertical";

function routeByVertical(vertical: ReturnType<typeof normalizeVertical>) {
  if (vertical === "restaurant") return "/linkhub";
  if (vertical === "ecommerce") return "/store";
  return "/builder";
}

function normalizeDemoValue(value: string | null) {
  const safe = String(value || "").trim();
  if (!safe) return "";
  return safe.replace(/[^\w-]/g, "");
}

export default function AppNewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const vertical = normalizeVertical(params?.get("vertical"));
    const demoSlug = normalizeDemoValue(params?.get("demoSlug") || null);
    const demoTheme = normalizeDemoValue(params?.get("demoTheme") || null);
    persistVerticalChoice(vertical);

    if (!user) {
      router.replace(verticalToSignupHref(vertical, { demoSlug, demoTheme }));
      return;
    }

    const nextParams = new URLSearchParams();
    if (demoSlug) nextParams.set("demoSlug", demoSlug);
    if (demoTheme) nextParams.set("demoTheme", demoTheme);
    const targetBase = routeByVertical(vertical);
    const target = nextParams.size ? `${targetBase}?${nextParams.toString()}` : targetBase;
    router.replace(target);
  }, [loading, router, user]);

  return (
    <div className="grid min-h-screen place-items-center bg-black">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-300 border-t-transparent" />
    </div>
  );
}
