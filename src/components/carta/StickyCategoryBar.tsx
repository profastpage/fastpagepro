"use client";

import { memo } from "react";

export type StickyCategoryItem = {
  id: string;
  name: string;
  emoji?: string;
};

type StickyCategoryBarProps = {
  categories: StickyCategoryItem[];
  activeId: string;
  onSelect: (categoryId: string) => void;
  buttonShapeClass: string;
  getButtonRef?: (categoryId: string, node: HTMLButtonElement | null) => void;
};

const StickyCategoryBar = memo(function StickyCategoryBar({
  categories,
  activeId,
  onSelect,
  buttonShapeClass,
  getButtonRef,
}: StickyCategoryBarProps) {
  return (
    <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          ref={(node) => getButtonRef?.(category.id, node)}
          onClick={() => onSelect(category.id)}
          className={`shrink-0 border px-3 py-2 text-xs font-bold transition hover:-translate-y-0.5 active:scale-[0.98] ${buttonShapeClass}`}
          style={
            activeId === category.id
              ? {
                  borderColor: "var(--carta-chip-border)",
                  background: "var(--carta-chip-active-bg)",
                  color: "var(--carta-chip-active-text)",
                  boxShadow: "var(--carta-shadow)",
                }
              : {
                  borderColor: "var(--carta-chip-border)",
                  background: "var(--carta-chip-bg)",
                  color: "var(--carta-chip-text)",
                }
          }
          aria-label={`Ir a categoria ${category.name}`}
        >
          <span className="mr-1">{category.emoji || category.name.slice(0, 1).toUpperCase()}</span>
          {category.name}
        </button>
      ))}
    </div>
  );
});

export default StickyCategoryBar;
