"use client";

import { getThemesByVertical, type ThemeToken } from "@/lib/themes";
import type { BusinessVertical } from "@/lib/vertical";

type ThemePickerProps = {
  vertical: BusinessVertical;
  value: string;
  onChange: (themeId: string) => void;
};

export default function ThemePicker({ vertical, value, onChange }: ThemePickerProps) {
  const themes = getThemesByVertical(vertical);
  return (
    <section className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-300">Tema dinamico</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {themes.map((theme: ThemeToken) => {
          const isActive = theme.id === value;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              className={`rounded-xl border px-3 py-2 text-left transition ${
                isActive
                  ? "border-amber-300 bg-amber-300/15 text-amber-100"
                  : "border-white/15 bg-white/[0.03] text-zinc-200 hover:border-white/30"
              }`}
            >
              <p className="text-sm font-bold">{theme.name}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-4 w-6 rounded" style={{ background: theme.primary }} />
                <span className="h-4 w-6 rounded" style={{ background: theme.secondary }} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
