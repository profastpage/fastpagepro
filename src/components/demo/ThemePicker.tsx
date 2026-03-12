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
    <section className="fp-demo-panel p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--fp-muted)]">
        Tema dinamico
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {themes.map((theme: ThemeToken) => {
          const isActive = theme.id === value;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              className={`rounded-[1.15rem] border px-3 py-3 text-left transition duration-300 hover:-translate-y-0.5 ${
                isActive
                  ? "text-[var(--fp-text)]"
                  : "bg-[var(--fp-card)] text-[var(--fp-text)]"
              }`}
              style={
                isActive
                  ? {
                      borderColor: "color-mix(in srgb, var(--fp-primary) 36%, transparent)",
                      background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--fp-primary) 11%, var(--fp-card)), var(--fp-card))",
                      boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
                    }
                  : { borderColor: "var(--fp-border)" }
              }
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
