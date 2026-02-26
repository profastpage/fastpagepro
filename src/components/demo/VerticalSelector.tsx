"use client";

import { BUSINESS_VERTICALS, getVerticalCopy, type BusinessVertical } from "@/lib/vertical";

type VerticalSelectorProps = {
  value: BusinessVertical;
  onChange: (vertical: BusinessVertical) => void;
  className?: string;
};

export default function VerticalSelector({
  value,
  onChange,
  className = "",
}: VerticalSelectorProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {BUSINESS_VERTICALS.map((vertical) => {
        const copy = getVerticalCopy(vertical);
        const active = vertical === value;
        return (
          <button
            key={vertical}
            type="button"
            onClick={() => onChange(vertical)}
            aria-label={`Seleccionar ${copy.label}`}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active
                ? "border-amber-300 bg-amber-300/20 text-amber-100"
                : "border-white/20 bg-white/5 text-zinc-300 hover:border-amber-300/45 hover:text-white"
            }`}
          >
            {copy.emoji} {copy.label}
          </button>
        );
      })}
    </div>
  );
}
