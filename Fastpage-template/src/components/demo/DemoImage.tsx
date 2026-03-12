"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useMemo, useState } from "react";

type DemoImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackLabel?: string;
};

function buildFallbackSvg(label: string): string {
  const safeLabel = String(label || "FastPage Demo").slice(0, 38);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#1f2937"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)"/>
  <text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" fill="#fbbf24" font-family="Arial, sans-serif" font-size="56" font-weight="700">
    ${safeLabel}
  </text>
  <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" fill="#e5e7eb" font-family="Arial, sans-serif" font-size="28">
    Demo FastPage
  </text>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function DemoImage({
  src,
  alt,
  fallbackLabel,
  onError,
  ...rest
}: DemoImageProps) {
  const fallbackSrc = useMemo(
    () => buildFallbackSvg(fallbackLabel || alt || "FastPage"),
    [alt, fallbackLabel],
  );
  const [imageSrc, setImageSrc] = useState<string>(
    String(src || "").trim() || fallbackSrc,
  );

  useEffect(() => {
    const nextSrc = String(src || "").trim();
    setImageSrc(nextSrc || fallbackSrc);
  }, [fallbackSrc, src]);

  return (
    <Image
      {...rest}
      alt={alt}
      src={imageSrc}
      onError={(event) => {
        if (imageSrc !== fallbackSrc) setImageSrc(fallbackSrc);
        onError?.(event);
      }}
    />
  );
}

