# UI Guardrails (Mandatory)

Apply NON-DESTRUCTIVE, minimal-diff changes only. Do not refactor or alter unrelated UI. Preserve existing layout and behavior.

## Scope and Layout Integrity
- Mobile: NO horizontal scroll.
- NO element overlaps.
- Preserve current structure and spacing unless task explicitly asks redesign.
- Prefer normal flow (flex/grid + gap) over absolute positioning.
- Avoid `position: absolute/fixed` except intentional overlays and documented fixed bars.

## Responsive Rules
- Mobile-first implementation.
- Wrappers: `w-full max-w-full min-w-0`.
- Ensure `html, body` do not create x-scroll (`overflow-x: hidden` when required).
- Images/media: `max-width: 100%`, `height: auto`, and container-safe sizing.
- Long text must wrap safely (`break-words`/equivalent when needed).

## Fixed or Sticky Bars
- If using fixed/sticky bottom UI, reserve space so content is never covered.
- Include safe-area support on mobile (`env(safe-area-inset-bottom)` when applicable).
- Verify forms and CTA remain visible when virtual keyboard opens.

## Accessibility Baseline
- Keep visible `focus-visible` states on interactive controls.
- Minimum touch target around `44x44` for primary actions on mobile.
- Keep labels/aria for forms and icon-only buttons.
- Maintain readable contrast in text and action buttons.

## Validation (Required)
Check at `320px`, `375px`, `768px`, and `1440px`:
- no x-scroll
- no overlaps
- layout intent preserved
- fixed bars not covering content
- primary CTA reachable and visible

## Git and Terminal
- Do not commit/push automatically unless explicitly requested by the user.
- If an audible terminal bell is requested in PowerShell, prefer `[console]::beep()` over `printf '\a'`.
