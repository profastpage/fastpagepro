"use client";

import { memo } from "react";
import { ShoppingBag } from "lucide-react";

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
      className={`fixed bottom-24 right-4 z-40 transition-all duration-200 ${
        shouldShow ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-3 scale-95 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className={`inline-flex min-h-[44px] items-center gap-2 border px-4 py-3 text-xs font-black uppercase tracking-[0.08em] shadow-xl transition active:scale-[0.97] ${buttonShapeClass}`}
        style={{
          borderColor: "var(--carta-chip-border)",
          background: "var(--carta-nav-active-bg)",
          color: "var(--carta-nav-active-text)",
        }}
        aria-label="Abrir carrito"
      >
        <ShoppingBag className="h-4 w-4" />
        Pedido
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-black"
          style={{
            background: "var(--carta-chip-active-bg)",
            color: "var(--carta-chip-active-text)",
          }}
        >
          {cartCount}
        </span>
      </button>
    </div>
  );
});

export default FloatingCartButton;

