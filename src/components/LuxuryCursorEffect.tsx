"use client";

import { useEffect, useRef, useState } from "react";

type CursorClick = {
  id: number;
  x: number;
  y: number;
};

function canEnableLuxuryCursor() {
  if (typeof window === "undefined") return false;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const desktopWidth = window.matchMedia("(min-width: 1024px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return finePointer && desktopWidth && !reducedMotion;
}

export default function LuxuryCursorEffect() {
  const [enabled, setEnabled] = useState(false);
  const [clicks, setClicks] = useState<CursorClick[]>([]);
  const clickIdRef = useRef(0);

  useEffect(() => {
    const updateEnabled = () => setEnabled(canEnableLuxuryCursor());
    updateEnabled();

    const pointer = window.matchMedia("(pointer: fine)");
    const width = window.matchMedia("(min-width: 1024px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    pointer.addEventListener("change", updateEnabled);
    width.addEventListener("change", updateEnabled);
    motion.addEventListener("change", updateEnabled);
    window.addEventListener("resize", updateEnabled);

    return () => {
      pointer.removeEventListener("change", updateEnabled);
      width.removeEventListener("change", updateEnabled);
      motion.removeEventListener("change", updateEnabled);
      window.removeEventListener("resize", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("fp-gold-cursor-enabled");
      return;
    }

    document.documentElement.classList.add("fp-gold-cursor-enabled");

    const down = (event: MouseEvent) => {
      const id = clickIdRef.current + 1;
      clickIdRef.current = id;
      const click = { id, x: event.clientX, y: event.clientY };
      setClicks((previous) => [...previous.slice(-4), click]);

      window.setTimeout(() => {
        setClicks((previous) => previous.filter((item) => item.id !== id));
      }, 520);
    };

    window.addEventListener("mousedown", down);

    return () => {
      window.removeEventListener("mousedown", down);
      document.documentElement.classList.remove("fp-gold-cursor-enabled");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fp-cursor-layer" data-luxury-cursor="true" aria-hidden="true">
      {clicks.map((click) => (
        <div key={click.id} className="fp-cursor-click" style={{ left: click.x, top: click.y }}>
          <span className="fp-cursor-click-bolt">{"\u26A1"}</span>
        </div>
      ))}
    </div>
  );
}
