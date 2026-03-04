"use client";

import Image from "next/image";
import { memo } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { optimizeCloudinaryDeliveryUrl } from "@/lib/cloudinaryDelivery";

export type ProductCardBadge = string;

type ProductCardProps = {
  title: string;
  description?: string;
  salesCopy?: string;
  imageUrl?: string;
  galleryImageUrls?: string[];
  price: string;
  oldPrice?: string;
  badge?: string;
  priorityBadge?: ProductCardBadge | null;
  emojiFallback?: string;
  onAdd: () => void;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  addButtonLabel?: string;
  removeUnitAriaLabel?: string;
  addUnitAriaLabel?: string;
  className?: string;
};

const ProductCard = memo(function ProductCard({
  title,
  description,
  salesCopy,
  imageUrl,
  galleryImageUrls = [],
  price,
  oldPrice,
  badge,
  priorityBadge,
  emojiFallback,
  onAdd,
  quantity = 0,
  onIncrement,
  onDecrement,
  addButtonLabel = "Agregar",
  removeUnitAriaLabel,
  addUnitAriaLabel,
  className,
}: ProductCardProps) {
  const useStepper = Boolean(onIncrement && onDecrement);
  const uniqueGallery = galleryImageUrls
    .map((url) => String(url || "").trim())
    .filter(Boolean)
    .filter((url, index, list) => list.indexOf(url) === index)
    .slice(0, 5);
  const primaryImageSource = imageUrl || uniqueGallery[0] || "";
  const primaryImage = optimizeCloudinaryDeliveryUrl(primaryImageSource, { width: 680 });
  const galleryThumbnails = uniqueGallery
    .filter((url) => url !== primaryImageSource)
    .slice(0, 3)
    .map((url) => optimizeCloudinaryDeliveryUrl(url, { width: 120 }));

  return (
    <article
      className={`rounded-[1.25rem] border p-3.5 md:p-4 ${className || ""}`}
      style={{
        borderColor: "var(--carta-border)",
        background: "var(--carta-surface-2)",
        boxShadow: "0 16px 28px -22px rgba(15,23,42,0.38)",
      }}
    >
      <div className="flex gap-3.5 md:gap-4.5">
        <div className="relative h-[128px] w-[128px] shrink-0 overflow-hidden rounded-[0.9rem] border border-[color:var(--carta-chip-border)] md:h-[170px] md:w-[170px]">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={title}
              fill
              unoptimized
              loading="lazy"
              sizes="(max-width: 768px) 128px, 170px"
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
            <h4 className="line-clamp-2 text-[1.28rem] font-extrabold leading-tight md:text-[1.45rem]" style={{ color: "var(--carta-text)" }}>
              {title}
            </h4>
            {(priorityBadge || badge) && (
              <span
                className="shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase"
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
            <p className="mt-1 line-clamp-2 text-[13.5px] leading-snug md:text-[14px]" style={{ color: "var(--carta-muted-text)" }}>
              {description}
            </p>
          ) : null}
          {salesCopy ? (
            <p className="mt-1 line-clamp-2 text-[11px] font-semibold md:text-xs" style={{ color: "var(--carta-accent)" }}>
              {salesCopy}
            </p>
          ) : null}
          {galleryThumbnails.length > 0 ? (
            <div className="mt-2 flex items-center gap-1.5">
              {galleryThumbnails.map((url) => (
                <span
                  key={url}
                  className="relative h-7 w-7 overflow-hidden rounded-md border border-[color:var(--carta-chip-border)]"
                >
                  <Image src={url} alt={title} fill unoptimized sizes="28px" className="object-cover" />
                </span>
              ))}
              <span className="text-[10px] font-semibold" style={{ color: "var(--carta-muted-text)" }}>
                +{galleryThumbnails.length}
              </span>
            </div>
          ) : null}

          <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
            <div className="flex items-end gap-2">
              {oldPrice ? (
                <span className="text-xs line-through" style={{ color: "var(--carta-placeholder)" }}>
                  S/{oldPrice}
                </span>
              ) : null}
              <span className="text-[1.46rem] font-black leading-none md:text-[1.62rem]" style={{ color: "var(--carta-price-color, var(--carta-accent))" }}>
                S/{price}
              </span>
            </div>

            {useStepper ? (
              <div
                className="inline-flex items-center gap-1.5 rounded-full border px-1.5 py-1"
                style={{
                  borderColor: "var(--carta-chip-border)",
                  background: "var(--carta-chip-bg)",
                }}
              >
                <button
                  type="button"
                  onClick={onDecrement}
                  disabled={quantity <= 0}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[0.7rem] border transition active:scale-[0.95] disabled:opacity-50"
                  style={{
                    borderColor: "var(--carta-chip-border)",
                    color: "var(--carta-chip-text)",
                    background: "var(--carta-surface-2)",
                  }}
                  aria-label={removeUnitAriaLabel || `Quitar una unidad de ${title}`}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[1.6rem] text-center text-[1.6rem] font-black leading-none" style={{ color: "var(--carta-text)" }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={onIncrement}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-[0.7rem] border transition active:scale-[0.95]"
                  style={{
                    borderColor: "var(--carta-chip-border)",
                    color: "var(--carta-chip-text)",
                    background: "var(--carta-surface-2)",
                  }}
                  aria-label={addUnitAriaLabel || `Agregar una unidad de ${title}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onAdd}
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full border px-4.5 py-2 text-[12px] font-black uppercase tracking-[0.08em] transition active:scale-[0.97] md:text-xs"
                style={{
                  borderColor: "var(--carta-chip-border)",
                  background: "var(--carta-nav-active-bg)",
                  color: "var(--carta-nav-active-text)",
                  boxShadow: "0 10px 20px -18px rgba(15,23,42,0.6)",
                }}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {addButtonLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
