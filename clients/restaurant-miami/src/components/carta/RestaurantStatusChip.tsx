"use client";

import { memo } from "react";

type RestaurantStatusChipProps = {
  isOpen: boolean;
  etaMinutes?: number;
  className?: string;
};

const RestaurantStatusChip = memo(function RestaurantStatusChip({
  isOpen,
  etaMinutes = 25,
  className,
}: RestaurantStatusChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${className || ""}`}
      style={{
        borderColor: "var(--carta-chip-border)",
        background: "var(--carta-chip-bg)",
        color: "var(--carta-chip-text)",
      }}
      aria-live="polite"
    >
      <span>{isOpen ? "🟢 Abierto" : "🔴 Cerrado"}</span>
      <span aria-hidden="true">•</span>
      <span>⏱️ Entrega {etaMinutes} min</span>
    </div>
  );
});

export default RestaurantStatusChip;

