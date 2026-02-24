"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface SubscriptionExpiryBannerProps {
  visible: boolean;
  daysRemaining: number;
}

export default function SubscriptionExpiryBanner({
  visible,
  daysRemaining,
}: SubscriptionExpiryBannerProps) {
  if (!visible) return null;

  return (
    <div className="rounded-2xl border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-semibold">
            Tu plan vence en {daysRemaining} {daysRemaining === 1 ? "día" : "días"}.
          </p>
          <p className="mt-0.5 text-amber-100/80">
            Renueva para evitar bloqueo de funciones premium.
            {" "}
            <Link href="/dashboard/billing" className="underline underline-offset-2">
              Ir a facturación
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
