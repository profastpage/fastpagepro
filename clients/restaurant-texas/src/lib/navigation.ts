export function navigateBackWithFallback(fallbackHref: string) {
  if (typeof window === "undefined") return false;

  const currentHref = window.location.href;
  const referrer = String(document.referrer || "").trim();
  const sameOriginReferrer =
    referrer.length > 0 &&
    referrer.startsWith(window.location.origin) &&
    referrer !== currentHref;

  if (sameOriginReferrer) {
    window.location.assign(referrer);
    return true;
  }

  if (window.history.length > 1) {
    window.history.back();
    // If history back gets stuck in certain webviews/PWA stacks, force fallback.
    window.setTimeout(() => {
      if (window.location.href === currentHref) {
        window.location.assign(fallbackHref);
      }
    }, 550);
    return true;
  }

  window.location.assign(fallbackHref);
  return true;
}
