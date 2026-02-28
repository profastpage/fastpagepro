"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CursorBurst = {
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
  const [visible, setVisible] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [bursts, setBursts] = useState<CursorBurst[]>([]);

  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);
  const burstIdRef = useRef(0);

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
      setVisible(false);
      setHoveringInteractive(false);
      setPressing(false);
      return;
    }

    const move = (event: MouseEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
      setVisible(true);
      const target = event.target as HTMLElement | null;
      const isInteractive = Boolean(target?.closest("a, button, input, textarea, select, [role='button']"));
      setHoveringInteractive(isInteractive);
    };

    const down = (event: MouseEvent) => {
      setPressing(true);
      setVisible(true);

      const id = burstIdRef.current + 1;
      burstIdRef.current = id;
      const burst = { id, x: event.clientX, y: event.clientY };
      setBursts((previous) => [...previous.slice(-3), burst]);

      window.setTimeout(() => {
        setBursts((previous) => previous.filter((item) => item.id !== id));
      }, 900);
    };

    const up = () => setPressing(false);
    const leave = () => setVisible(false);

    const animate = () => {
      const target = targetRef.current;
      const current = currentRef.current;
      const nextX = current.x + (target.x - current.x) * 0.24;
      const nextY = current.y + (target.y - current.y) * 0.24;
      currentRef.current = { x: nextX, y: nextY };

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${nextX - 17}px, ${nextY - 17}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${nextX - 3}px, ${nextY - 3}px, 0)`;
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseleave", leave);
    window.addEventListener("blur", leave);

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("blur", leave);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled]);

  const ringClass = useMemo(() => {
    const parts = ["fp-cursor-ring"];
    if (visible) parts.push("is-visible");
    if (hoveringInteractive) parts.push("is-hovering");
    if (pressing) parts.push("is-pressing");
    return parts.join(" ");
  }, [visible, hoveringInteractive, pressing]);

  const dotClass = useMemo(() => {
    const parts = ["fp-cursor-dot"];
    if (visible) parts.push("is-visible");
    if (pressing) parts.push("is-pressing");
    return parts.join(" ");
  }, [visible, pressing]);

  if (!enabled) return null;

  return (
    <div className="fp-cursor-layer" data-luxury-cursor="true" aria-hidden="true">
      <div ref={ringRef} className={ringClass} />
      <div ref={dotRef} className={dotClass} />
      {bursts.map((burst) => (
        <div key={burst.id} className="fp-cursor-burst" style={{ left: burst.x, top: burst.y }}>
          <span className="fp-cursor-burst-ring" />
          <span className="fp-cursor-burst-star">{"\u2726"}</span>
        </div>
      ))}
    </div>
  );
}
