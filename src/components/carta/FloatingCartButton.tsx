"use client";

import { memo } from "react";
import { ShoppingCart } from "lucide-react";

type FloatingCartButtonProps = {
  cartCount: number;
  onOpen: () => void;
  buttonShapeClass: string;
  visible?: boolean;
};

const FloatingCartButton = memo(function FloatingCartButton({
  cartCount,
  onOpen,
  buttonShapeClass,
  visible = true,
}: FloatingCartButtonProps) {
  const shouldShow = visible && cartCount > 0;

  return (
    <div
      className={`fixed right-4 z-40 transition-all duration-200 bottom-[calc(env(safe-area-inset-bottom)+5.7rem)] md:bottom-6 ${
        shouldShow ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className={`inline-flex w-[6.15rem] touch-manipulation cursor-pointer flex-col items-center justify-center gap-1.5 border px-2 py-2.5 text-xs font-black uppercase tracking-[0.08em] shadow-xl transition active:scale-[0.97] ${buttonShapeClass}`}
        style={{
          borderColor: "var(--carta-chip-border)",
          background: "var(--carta-nav-active-bg)",
          color: "var(--carta-nav-active-text)",
        }}
        aria-label="Abrir carrito"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-[0.7rem] border" style={{ borderColor: "var(--carta-chip-border)" }}>
          <ShoppingCart className="h-3.5 w-3.5" />
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="text-[10px] font-black leading-none">Mi pedido</span>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-black leading-none"
            style={{
              background: "var(--carta-chip-active-bg)",
              color: "var(--carta-chip-active-text)",
            }}
          >
            {cartCount}
          </span>
        </span>
      </button>
    </div>
  );
});

export default FloatingCartButton;
