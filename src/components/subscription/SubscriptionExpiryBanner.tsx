"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface SubscriptionExpiryBannerProps {
  visible: boolean;
  daysRemaining: number;
  isBusinessTrial?: boolean;
}

export default function SubscriptionExpiryBanner({
  visible,
  daysRemaining,
  isBusinessTrial = false,
}: SubscriptionExpiryBannerProps) {
  if (!visible) return null;
  const isCritical = daysRemaining <= 3;

  return (
    <div
      className={`rounded-2xl px-4 py-3 text-sm ${
        isCritical
          ? "border border-red-400/40 bg-red-500/10 text-red-100"
          : "border border-amber-300/40 bg-amber-400/10 text-amber-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-semibold">
            {isBusinessTrial ? "Tu prueba Business vence" : "Tu plan vence"} en {daysRemaining}{" "}
            {daysRemaining === 1 ? "dia" : "dias"}.
          </p>
          <p className={`mt-0.5 ${isCritical ? "text-red-100/90" : "text-amber-100/80"}`}>
            {isCritical
              ? "Al finalizar se bloquearan funciones y tu pagina publicada hasta renovar."
              : "Renueva para evitar bloqueo de funciones premium."}{" "}
            <Link href="/dashboard/billing" className="underline underline-offset-2">
              Ir a facturacion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
