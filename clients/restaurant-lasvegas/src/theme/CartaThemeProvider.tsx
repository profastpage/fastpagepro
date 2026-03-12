"use client";

import { CSSProperties, ReactNode } from "react";
import { buildCartaThemeCssVars, CartaThemeId } from "./cartaThemes";

type CartaThemeProviderProps = {
  themeId?: CartaThemeId | string | null;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export default function CartaThemeProvider({
  themeId,
  className,
  style,
  children,
}: CartaThemeProviderProps) {
  const cssVars = buildCartaThemeCssVars(themeId);

  return (
    <div className={className} style={{ ...(cssVars as CSSProperties), ...style }}>
      {children}
    </div>
  );
}
