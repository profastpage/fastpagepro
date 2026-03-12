"use client";

import { useRef, type PointerEvent } from "react";
import {
  normalizeImagePositionPair,
  toImageObjectPosition,
  type ImagePosition,
} from "@/lib/imagePosition";

type DraggableImagePositionEditorProps = {
  src: string;
  alt: string;
  x: number;
  y: number;
  onChange: (next: ImagePosition) => void;
  className?: string;
  imageClassName?: string;
  disabled?: boolean;
};

export default function DraggableImagePositionEditor({
  src,
  alt,
  x,
  y,
  onChange,
  className,
  imageClassName,
  disabled = false,
}: DraggableImagePositionEditorProps) {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const node = surfaceRef.current;
    if (!node) return;
    event.preventDefault();
    node.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: x,
      startY: y,
    };
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const node = surfaceRef.current;
    const drag = dragStateRef.current;
    if (!node || !drag) return;
    if (drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - drag.startClientX;
    const dy = event.clientY - drag.startClientY;
    const next = normalizeImagePositionPair(
      drag.startX + (dx / Math.max(1, rect.width)) * 100,
      drag.startY + (dy / Math.max(1, rect.height)) * 100,
    );
    onChange(next);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const node = surfaceRef.current;
    const drag = dragStateRef.current;
    if (!node || !drag) return;
    if (drag.pointerId !== event.pointerId) return;
    if (node.hasPointerCapture(event.pointerId)) {
      node.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;
  };

  return (
    <div
      ref={surfaceRef}
      className={`relative overflow-hidden touch-none select-none ${className || ""}`}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
      role="slider"
      aria-label="Posicion de imagen"
      aria-valuetext={`Horizontal ${Math.round(x)}%, vertical ${Math.round(y)}%`}
      aria-disabled={disabled}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${imageClassName || ""}`}
        style={{ objectPosition: toImageObjectPosition(x, y) }}
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 border border-white/20" />
      <div className="pointer-events-none absolute bottom-1 right-1 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-bold text-white">
        {Math.round(x)}% · {Math.round(y)}%
      </div>
    </div>
  );
}
