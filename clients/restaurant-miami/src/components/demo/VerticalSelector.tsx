"use client";

import { BUSINESS_VERTICALS, getVerticalCopy, type BusinessVertical } from "@/lib/vertical";
import { useLanguage } from "@/context/LanguageContext";

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
  const { language } = useLanguage();
  const isEn = language === "en";

  return (
    <div className={`grid w-full grid-cols-3 gap-2 ${className}`}>
      {BUSINESS_VERTICALS.map((vertical) => {
        const copy = getVerticalCopy(vertical, language);
        const active = vertical === value;
        return (
          <button
            key={vertical}
            type="button"
            onClick={() => onChange(vertical)}
            aria-label={`${isEn ? "Select" : "Seleccionar"} ${copy.label}`}
            className={`w-full min-w-0 rounded-full border px-2 py-2 text-[13px] font-semibold leading-none transition sm:px-4 sm:text-sm ${
              active
                ? "border-amber-300 bg-amber-300/20 text-amber-100"
                : "border-white/20 bg-white/5 text-zinc-300 hover:border-amber-300/45 hover:text-white"
            }`}
          >
            <span className="inline-flex w-full items-center justify-center gap-1 whitespace-nowrap">
              <span>{copy.emoji}</span>
              <span>{copy.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
