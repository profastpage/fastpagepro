# UI Guardrails (Mandatory)

Apply NON-DESTRUCTIVE, minimal-diff changes only. Do not refactor or alter unrelated UI. Preserve existing layout.

## Layout
- Mobile: NO horizontal scroll.
- NO element overlaps.
- Prefer normal flow (flex/grid + gap).
- Avoid absolute/fixed except intentional overlays.

## Responsive
- Mobile-first.
- Wrappers: w-full max-w-full.
- html, body: overflow-x hidden.
- Images: max-width 100%, height auto.

## Fixed bars
If using fixed bottom elements, add enough padding-bottom to prevent covering content.

## Validation (required)
Check at 375px and 1440px:
- no x-scroll
- no overlaps
- layout unchanged

## Git
After success: commit, push, terminal bell (printf '\a').