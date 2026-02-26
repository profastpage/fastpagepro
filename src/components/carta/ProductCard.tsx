"use client";

import Image from "next/image";
import { memo } from "react";
import { ShoppingBag } from "lucide-react";

export type ProductCardBadge = "🔥 Más pedido" | "⭐ Favorito" | "🕒 Se acaba";

type ProductCardProps = {
  title: string;
  description?: string;
  imageUrl?: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  priorityBadge?: ProductCardBadge | null;
  emojiFallback?: string;
  onAdd: () => void;
  className?: string;
};

const ProductCard = memo(function ProductCard({
  title,
  description,
  imageUrl,
  price,
  oldPrice,
  badge,
  priorityBadge,
  emojiFallback,
  onAdd,
  className,
}: ProductCardProps) {
  return (
    <article
      className={`rounded-[1.2rem] border p-3 ${className || ""}`}
      style={{ borderColor: "var(--carta-border)", background: "var(--carta-surface-2)" }}
    >
      <div className="flex gap-3">
        <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl border border-[color:var(--carta-chip-border)]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 104px, 120px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-[10px] font-black uppercase tracking-[0.08em] text-[color:var(--carta-chip-text)]">
              {emojiFallback || "menu"}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="line-clamp-2 text-lg font-extrabold leading-tight md:text-xl" style={{ color: "var(--carta-text)" }}>
              {title}
            </h4>
            {(priorityBadge || badge) && (
              <span
                className="shrink-0 rounded-full border px-2 py-1 text-[10px] font-black uppercase"
                style={{
                  borderColor: "var(--carta-chip-border)",
                  background: "var(--carta-badge-bg)",
                  color: "var(--carta-badge-text)",
                }}
              >
                {priorityBadge || badge}
              </span>
            )}
          </div>

          {description ? (
            <p className="mt-1 line-clamp-2 text-sm" style={{ color: "var(--carta-muted-text)" }}>
              {description}
            </p>
          ) : null}

          <div className="mt-2 flex items-end gap-2">
            {oldPrice ? (
              <span className="text-xs line-through" style={{ color: "var(--carta-placeholder)" }}>
                S/{oldPrice}
              </span>
            ) : null}
            <span className="text-2xl font-black leading-none" style={{ color: "var(--carta-accent)" }}>
              S/{price}
            </span>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 border px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition active:scale-[0.97]"
            style={{
              borderColor: "var(--carta-chip-border)",
              background: "var(--carta-nav-active-bg)",
              color: "var(--carta-nav-active-text)",
            }}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;

