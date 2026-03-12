export type ImagePosition = {
  x: number;
  y: number;
};

const DEFAULT_IMAGE_POSITION = 50;

export function normalizeImagePosition(
  value: unknown,
  fallback = DEFAULT_IMAGE_POSITION,
): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0, Math.min(100, Number(parsed.toFixed(2))));
}

export function normalizeImagePositionPair(
  x: unknown,
  y: unknown,
  fallbackX = DEFAULT_IMAGE_POSITION,
  fallbackY = DEFAULT_IMAGE_POSITION,
): ImagePosition {
  return {
    x: normalizeImagePosition(x, fallbackX),
    y: normalizeImagePosition(y, fallbackY),
  };
}

export function toImageObjectPosition(
  x: unknown,
  y: unknown,
  fallbackX = DEFAULT_IMAGE_POSITION,
  fallbackY = DEFAULT_IMAGE_POSITION,
): string {
  const normalized = normalizeImagePositionPair(x, y, fallbackX, fallbackY);
  return `${normalized.x}% ${normalized.y}%`;
}
