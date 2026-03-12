(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/firebase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "app",
    ()=>app,
    "auth",
    ()=>auth,
    "db",
    ()=>db,
    "storage",
    ()=>storage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/storage/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/index.esm.js [app-client] (ecmascript)");
;
;
;
;
const DEFAULT_FIREBASE_AUTH_DOMAIN = "fastpage-7ceb3.firebaseapp.com";
const DEFAULT_ALLOWED_AUTH_DOMAINS = [
    "www.fastpagepro.com",
    "fastpagepro.com",
    "fastpage-7ceb3.firebaseapp.com",
    "fastpage-7ceb3.web.app",
    "localhost",
    "127.0.0.1"
];
function normalizeDomain(raw) {
    return String(raw || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}
function stripPort(host) {
    return String(host || "").trim().toLowerCase().replace(/:\d+$/, "");
}
function readAllowedDomains() {
    const raw = String(("TURBOPACK compile-time value", "www.fastpagepro.com,fastpagepro.com,fastpage-7ceb3.firebaseapp.com,fastpage-7ceb3.web.app,localhost,127.0.0.1") || "").trim();
    const entries = raw ? raw.split(",").map((entry)=>normalizeDomain(entry)) : DEFAULT_ALLOWED_AUTH_DOMAINS.map((entry)=>normalizeDomain(entry));
    return new Set(entries.filter(Boolean));
}
function canUseAsAuthDomain(host, allowedDomains) {
    const normalizedHost = normalizeDomain(host);
    if (!normalizedHost) return false;
    if (allowedDomains.has(normalizedHost)) return true;
    const hostWithoutPort = stripPort(normalizedHost);
    return allowedDomains.has(hostWithoutPort);
}
function resolveFirebaseAuthDomain() {
    const fallback = DEFAULT_FIREBASE_AUTH_DOMAIN;
    const configured = normalizeDomain(String(("TURBOPACK compile-time value", "fastpage2-db56b.firebaseapp.com") || ""));
    const forceSameOrigin = String(("TURBOPACK compile-time value", "0") || "0").trim().toLowerCase() === "1";
    const allowedDomains = readAllowedDomains();
    // Enable same-origin only when explicitly requested by env, since it requires
    // OAuth redirect URIs to be configured for every runtime host.
    if ("TURBOPACK compile-time truthy", 1) {
        const currentHost = normalizeDomain(window.location.host);
        if (forceSameOrigin && canUseAsAuthDomain(currentHost, allowedDomains)) {
            return currentHost;
        }
    }
    if (configured && canUseAsAuthDomain(configured, allowedDomains)) {
        return configured;
    }
    return fallback;
}
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "tu_api_key") || "AIzaSyAkb9GtjFXt2NPjuM_-M41Srd6aUK7Ch2Y",
    authDomain: resolveFirebaseAuthDomain(),
    projectId: ("TURBOPACK compile-time value", "fastpage2-db56b") || "fastpage-7ceb3",
    storageBucket: ("TURBOPACK compile-time value", "fastpage2-db56b.appspot.com") || "fastpage-7ceb3.firebasestorage.app",
    messagingSenderId: ("TURBOPACK compile-time value", "tu_sender_id") || "812748660444",
    appId: ("TURBOPACK compile-time value", "tu_app_id") || "1:812748660444:web:4bf4184a13a377bc26de19"
};
// Initialize Firebase
const app = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])();
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(app);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
const storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStorage"])(app);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/vertical.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BUSINESS_VERTICALS",
    ()=>BUSINESS_VERTICALS,
    "VERTICAL_COOKIE_KEY",
    ()=>VERTICAL_COOKIE_KEY,
    "VERTICAL_STORAGE_KEY",
    ()=>VERTICAL_STORAGE_KEY,
    "getVerticalCopy",
    ()=>getVerticalCopy,
    "normalizeVertical",
    ()=>normalizeVertical,
    "persistVerticalChoice",
    ()=>persistVerticalChoice,
    "readVerticalFromClient",
    ()=>readVerticalFromClient,
    "readVerticalFromCookieValue",
    ()=>readVerticalFromCookieValue,
    "resolveVerticalFromSearchParams",
    ()=>resolveVerticalFromSearchParams,
    "verticalToCreateHref",
    ()=>verticalToCreateHref,
    "verticalToDemoHref",
    ()=>verticalToDemoHref,
    "verticalToSignupHref",
    ()=>verticalToSignupHref
]);
const VERTICAL_COOKIE_KEY = "fp_vertical";
const VERTICAL_STORAGE_KEY = "fp_vertical";
const BUSINESS_VERTICALS = [
    "restaurant",
    "ecommerce",
    "services"
];
const FALLBACK_VERTICAL = "restaurant";
const VERTICAL_COPY_ES = {
    restaurant: {
        label: "Restaurante",
        emoji: "\u{1F37D}\uFE0F",
        headline: "Tu carta digital + pedidos por WhatsApp en 1 dia",
        subheadline: "Activa menu, categorias y pedido directo sin comisiones para vender mas.",
        demoCta: "Ver demo de restaurante",
        signupCta: "Crear mi carta digital gratis"
    },
    ecommerce: {
        label: "Tienda Online",
        emoji: "\u{1F6CD}\uFE0F",
        headline: "Tu tienda lista para vender + carrito directo a WhatsApp",
        subheadline: "Publica catalogo, ofertas y checkout rapido para convertir trafico en ventas.",
        demoCta: "Ver demo de tienda online",
        signupCta: "Crear mi tienda gratis"
    },
    services: {
        label: "Servicios",
        emoji: "\u{1F9E9}",
        headline: "Landing que convierte + contacto inmediato",
        subheadline: "Captura leads calificados con mensajes claros y CTA de conversion.",
        demoCta: "Ver demo de servicios",
        signupCta: "Crear mi landing gratis"
    }
};
const VERTICAL_COPY_EN = {
    restaurant: {
        label: "Restaurant",
        emoji: "\u{1F37D}\uFE0F",
        headline: "Your digital menu + WhatsApp orders in 1 day",
        subheadline: "Activate menu, categories, and direct ordering with no commissions to sell more.",
        demoCta: "See restaurant demo",
        signupCta: "Create my digital menu free"
    },
    ecommerce: {
        label: "Online Store",
        emoji: "\u{1F6CD}\uFE0F",
        headline: "Your store ready to sell + cart connected to WhatsApp",
        subheadline: "Publish catalog, offers, and fast checkout to turn traffic into sales.",
        demoCta: "See online store demo",
        signupCta: "Create my store free"
    },
    services: {
        label: "Services",
        emoji: "\u{1F9E9}",
        headline: "Landing that converts + instant contact",
        subheadline: "Capture qualified leads with clear messaging and conversion-focused CTAs.",
        demoCta: "See services demo",
        signupCta: "Create my landing free"
    }
};
const VERTICAL_COPY_BY_LANGUAGE = {
    es: VERTICAL_COPY_ES,
    en: VERTICAL_COPY_EN,
    pt: VERTICAL_COPY_ES
};
function normalizeVertical(value) {
    const input = String(value || "").trim().toLowerCase();
    if (input === "store") return "ecommerce";
    if (BUSINESS_VERTICALS.includes(input)) {
        return input;
    }
    return FALLBACK_VERTICAL;
}
function getVerticalCopy(vertical, language = "es") {
    const safeLanguage = language in VERTICAL_COPY_BY_LANGUAGE ? language : "es";
    return VERTICAL_COPY_BY_LANGUAGE[safeLanguage][normalizeVertical(vertical)];
}
function normalizeDemoQueryValue(value) {
    const safe = String(value || "").trim();
    if (!safe) return "";
    return safe.replace(/[^\w-]/g, "");
}
function buildVerticalQueryString(vertical, demo) {
    const normalized = normalizeVertical(vertical);
    const params = new URLSearchParams({
        vertical: normalized
    });
    const safeDemoSlug = normalizeDemoQueryValue(demo?.demoSlug);
    const safeDemoTheme = normalizeDemoQueryValue(demo?.demoTheme);
    if (safeDemoSlug) params.set("demoSlug", safeDemoSlug);
    if (safeDemoTheme) params.set("demoTheme", safeDemoTheme);
    return params.toString();
}
function verticalToSignupHref(vertical, demo) {
    return `/signup?${buildVerticalQueryString(vertical, demo)}`;
}
function verticalToDemoHref(vertical) {
    const normalized = normalizeVertical(vertical);
    return `/demo?vertical=${normalized}`;
}
function verticalToCreateHref(vertical, demo) {
    return `/app/new?${buildVerticalQueryString(vertical, demo)}`;
}
function resolveVerticalFromSearchParams(params) {
    if (!params) return FALLBACK_VERTICAL;
    if (params instanceof URLSearchParams) {
        return normalizeVertical(params.get("vertical"));
    }
    const raw = params.vertical;
    if (Array.isArray(raw)) return normalizeVertical(raw[0]);
    return normalizeVertical(raw);
}
function persistVerticalChoice(vertical) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const normalized = normalizeVertical(vertical);
    try {
        window.localStorage.setItem(VERTICAL_STORAGE_KEY, normalized);
    } catch  {
    // ignore
    }
    document.cookie = `${VERTICAL_COOKIE_KEY}=${normalized}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
}
function readVerticalFromClient() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const fromUrl = new URLSearchParams(window.location.search).get("vertical");
    if (fromUrl) return normalizeVertical(fromUrl);
    try {
        const fromStorage = window.localStorage.getItem(VERTICAL_STORAGE_KEY);
        if (fromStorage) return normalizeVertical(fromStorage);
    } catch  {
    // ignore
    }
    const cookieMatch = document.cookie.split(";").map((item)=>item.trim()).find((item)=>item.startsWith(`${VERTICAL_COOKIE_KEY}=`));
    if (cookieMatch) {
        return normalizeVertical(cookieMatch.split("=")[1]);
    }
    return FALLBACK_VERTICAL;
}
function readVerticalFromCookieValue(cookieValue) {
    return normalizeVertical(cookieValue || FALLBACK_VERTICAL);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/analytics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getStoredUtmContext",
    ()=>getStoredUtmContext,
    "persistUtmFromUrl",
    ()=>persistUtmFromUrl,
    "trackGrowthEvent",
    ()=>trackGrowthEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const UTM_STORAGE_KEY = "fp_utm_context";
const UTM_COOKIE_KEY = "fp_utm_context";
function cleanValue(value, max = 120) {
    return String(value || "").trim().replace(/\s+/g, " ").slice(0, max);
}
function safeWindow() {
    return ("TURBOPACK compile-time truthy", 1) ? window : "TURBOPACK unreachable";
}
function encodeCookieValue(value) {
    try {
        return encodeURIComponent(JSON.stringify(value));
    } catch  {
        return "";
    }
}
function decodeCookieValue(value) {
    try {
        const parsed = JSON.parse(decodeURIComponent(value));
        return {
            utm_source: cleanValue(parsed?.utm_source, 80) || undefined,
            utm_campaign: cleanValue(parsed?.utm_campaign, 120) || undefined,
            utm_content: cleanValue(parsed?.utm_content, 120) || undefined
        };
    } catch  {
        return {};
    }
}
function getStoredUtmContext() {
    const win = safeWindow();
    if (!win) return {};
    try {
        const fromStorage = win.localStorage.getItem(UTM_STORAGE_KEY);
        if (fromStorage) {
            const parsed = JSON.parse(fromStorage);
            return {
                utm_source: cleanValue(parsed?.utm_source, 80) || undefined,
                utm_campaign: cleanValue(parsed?.utm_campaign, 120) || undefined,
                utm_content: cleanValue(parsed?.utm_content, 120) || undefined
            };
        }
    } catch  {
    // ignore
    }
    const cookieMatch = document.cookie.split(";").map((entry)=>entry.trim()).find((entry)=>entry.startsWith(`${UTM_COOKIE_KEY}=`));
    if (!cookieMatch) return {};
    return decodeCookieValue(cookieMatch.slice(`${UTM_COOKIE_KEY}=`.length));
}
function persistUtmFromUrl(searchParams) {
    const win = safeWindow();
    if (!win) return;
    const params = searchParams || new URLSearchParams(win.location.search);
    const next = {
        utm_source: cleanValue(params.get("utm_source"), 80) || undefined,
        utm_campaign: cleanValue(params.get("utm_campaign"), 120) || undefined,
        utm_content: cleanValue(params.get("utm_content"), 120) || undefined
    };
    if (!next.utm_source && !next.utm_campaign && !next.utm_content) return;
    try {
        win.localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(next));
    } catch  {
    // ignore
    }
    const encoded = encodeCookieValue(next);
    if (encoded) {
        document.cookie = `${UTM_COOKIE_KEY}=${encoded}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    }
}
async function trackGrowthEvent(event, payload = {}) {
    const win = safeWindow();
    if (!win) return;
    const utm = getStoredUtmContext();
    const body = {
        event,
        ...utm,
        ...payload,
        path: win.location.pathname,
        href: win.location.href,
        ts: Date.now()
    };
    if ("TURBOPACK compile-time truthy", 1) {
        // eslint-disable-next-line no-console
        console.log("[growth-event]", body);
    }
    const dataLayerWindow = win;
    dataLayerWindow.dataLayer?.push(body);
    try {
        await fetch("/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            keepalive: true
        });
    } catch  {
    // ignore
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/auth/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AuthPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/LanguageContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/vertical.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const DEFAULT_AUTH_CANONICAL_HOST = "www.fastpagepro.com";
const CANONICAL_AUTH_HOST = (("TURBOPACK compile-time value", "www.fastpagepro.com") || DEFAULT_AUTH_CANONICAL_HOST).trim().toLowerCase();
const DEFAULT_AUTH_ALIAS_HOSTS = "fastpagepro.com";
const AUTH_ALIAS_HOSTS = (("TURBOPACK compile-time value", "fastpagepro.com") || DEFAULT_AUTH_ALIAS_HOSTS).split(",").map((host)=>host.trim().toLowerCase()).filter(Boolean);
_c = AUTH_ALIAS_HOSTS;
const RECOMMENDED_FIREBASE_AUTH_DOMAINS = Array.from(new Set([
    CANONICAL_AUTH_HOST,
    ...AUTH_ALIAS_HOSTS
].filter(Boolean)));
const GOOGLE_AUTH_INTENT_KEY = "fp_google_auth_intent";
const REFERRAL_INTENT_CODE_KEY = "fp_referral_code_intent";
const REFERRAL_INTENT_LOCK_KEY = "fp_referral_lock_intent";
const FORCE_GOOGLE_REDIRECT = String(("TURBOPACK compile-time value", "0") || "0").trim().toLowerCase() !== "0";
function isStandaloneMode() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
function isPwaAuthContext() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (isStandaloneMode()) return true;
    try {
        const currentUrl = new URL(window.location.href);
        return String(currentUrl.searchParams.get("source") || "").trim().toLowerCase() === "pwa";
    } catch  {
        return false;
    }
}
function normalizeReferralInput(rawValue) {
    return String(rawValue || "").trim().replace(/\s+/g, "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 32);
}
function AuthPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid min-h-screen place-items-center bg-black text-sm font-semibold text-zinc-300",
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/src/app/auth/page.tsx",
            lineNumber: 87,
            columnNumber: 9
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContent, {}, void 0, false, {
            fileName: "[project]/src/app/auth/page.tsx",
            lineNumber: 92,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/auth/page.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_c1 = AuthPage;
function AuthContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { language, setLanguage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"])();
    const errorParam = searchParams.get("error");
    const isEnglish = language === "en";
    const i18n = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuthContent.useMemo[i18n]": ()=>isEnglish ? {
                loading: "Loading...",
                suspended: "Your account has been temporarily suspended.",
                disabled: "Your account has been disabled by the administrator.",
                redirectingSecure: "Redirecting to secure domain:",
                signupWelcome: "Start building your",
                signupEmpire: "digital business",
                loginWelcome: "Welcome back,",
                creator: "creator",
                selectedVertical: "Selected category:",
                loginTab: "Sign In",
                registerTab: "Create Account",
                labelName: "Name",
                labelEmail: "Email",
                labelPassword: "Password",
                labelReferral: "Referral code or alias (optional)",
                placeholderName: "Your name",
                placeholderEmail: "you@domain.com",
                placeholderReferral: "Example: FASTAB12 or gozustrike",
                referralLockedHint: "Referral locked from invitation link.",
                forgotPassword: "Forgot your password?",
                submitLogin: "Enter",
                submitRegister: "Create account",
                fillAllFields: "Complete all fields",
                accountCreated: "Account created successfully!",
                emailInUse: "This email is already registered",
                weakPassword: "Password is too weak (minimum 6 characters)",
                authNotEnabled: "Configuration error: Enable Authentication in Firebase Console",
                genericError: "Error:",
                enterCredentials: "Enter email and password",
                useGoogle: "Use Google. Your account is linked to Google.",
                invalidCredentials: "Invalid credentials. If you used Google, use the button below.",
                loginError: "Login error:",
                redirectGoogle: "Redirecting to sign in with Google...",
                unauthorizedDomainGoogle: "Unauthorized domain for Google. Redirecting...",
                unauthorizedDomainFirebase: "Unauthorized domain in Firebase. Add in Authorized domains:",
                popupBlocked: "The browser blocked the popup window. Please enable it.",
                loginCancelled: "Sign-in cancelled.",
                browserSecurityError: "Browser security error. Please try again.",
                unknownError: "Unknown error",
                typeEmailForRecovery: "Type your email and then click Recover.",
                recoverySent: "We sent you an email to reset your password.",
                invalidEmail: "The email is not valid.",
                accountNotFound: "No account exists with that email.",
                recoveryFailed: "Could not send recovery email.",
                continueWith: "Or continue with",
                continueGoogle: "Continue with Google",
                recoverButton: "Forgot your password? Recover",
                rights: "All rights reserved."
            } : {
                loading: "Cargando...",
                suspended: "Tu cuenta ha sido suspendida temporalmente.",
                disabled: "Tu cuenta ha sido desactivada por el administrador.",
                redirectingSecure: "Redirigiendo al dominio seguro:",
                signupWelcome: "Comienza a construir tu",
                signupEmpire: "imperio digital",
                loginWelcome: "Bienvenido de nuevo,",
                creator: "creador",
                selectedVertical: "Rubro seleccionado:",
                loginTab: "Iniciar Sesión",
                registerTab: "Registrarse",
                labelName: "Nombre",
                labelEmail: "Email",
                labelPassword: "Contraseña",
                labelReferral: "Código o alias de referido (opcional)",
                placeholderName: "Tu nombre",
                placeholderEmail: "tucorreo@dominio.com",
                placeholderReferral: "Ejemplo: FASTAB12 o gozustrike",
                referralLockedHint: "Referido bloqueado desde enlace de invitación.",
                forgotPassword: "¿Olvidaste tu contraseña?",
                submitLogin: "Entrar",
                submitRegister: "Crear cuenta",
                fillAllFields: "Completa todos los campos",
                accountCreated: "¡Cuenta creada exitosamente!",
                emailInUse: "El email ya está registrado",
                weakPassword: "La contraseña es muy débil (mínimo 6 caracteres)",
                authNotEnabled: "Error de configuración: habilita Authentication en Firebase Console",
                genericError: "Error:",
                enterCredentials: "Ingresa email y contraseña",
                useGoogle: "Usa Google. Tu cuenta está vinculada a Google.",
                invalidCredentials: "Credenciales inválidas. Si usaste Google, usa el botón de abajo.",
                loginError: "Error al iniciar sesión:",
                redirectGoogle: "Redirigiendo para iniciar sesión con Google...",
                unauthorizedDomainGoogle: "Dominio no autorizado para Google. Redirigiendo...",
                unauthorizedDomainFirebase: "Dominio no autorizado en Firebase. Agrega en Authorized domains:",
                popupBlocked: "El navegador bloqueó la ventana emergente. Por favor, habilítala.",
                loginCancelled: "Inicio de sesión cancelado.",
                browserSecurityError: "Error de seguridad del navegador. Intenta de nuevo.",
                unknownError: "Error desconocido",
                typeEmailForRecovery: "Escribe tu email y luego presiona Recuperar.",
                recoverySent: "Te enviamos un correo para restablecer tu contraseña.",
                invalidEmail: "El correo no es válido.",
                accountNotFound: "No existe una cuenta con ese correo.",
                recoveryFailed: "No se pudo enviar el correo de recuperación.",
                continueWith: "O continúa con",
                continueGoogle: "Continuar con Google",
                recoverButton: "¿Olvidaste tu contraseña? Recuperar",
                rights: "Todos los derechos reservados."
            }
    }["AuthContent.useMemo[i18n]"], [
        isEnglish
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthContent.useEffect": ()=>{
            if (errorParam === "suspended") {
                showToast(i18n.suspended);
            } else if (errorParam === "disabled") {
                showToast(i18n.disabled);
            }
        }
    }["AuthContent.useEffect"], [
        errorParam,
        i18n.disabled,
        i18n.suspended
    ]);
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("login");
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isStandalonePwa, setIsStandalonePwa] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loginEmail, setLoginEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const referralAliasIntentFromUrl = normalizeReferralInput(searchParams.get("af"));
    const referralCodeIntentFromUrl = normalizeReferralInput(searchParams.get("ref")) || referralAliasIntentFromUrl;
    const referralLockedFromUrl = String(searchParams.get("lockRef") || "").trim() === "1" || Boolean(referralAliasIntentFromUrl) && Boolean(referralCodeIntentFromUrl);
    const [registerReferralCode, setRegisterReferralCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(referralCodeIntentFromUrl);
    const [referralLockIntent, setReferralLockIntent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(referralLockedFromUrl);
    const referralInputLocked = referralLockIntent && Boolean(registerReferralCode);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isGoogleError, setIsGoogleError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isGoogleLoading, setIsGoogleLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isResettingPassword, setIsResettingPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isPostAuthProcessingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const googleIntentMemoryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const googleIntentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])("login");
    const preferredVertical = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeVertical"])(searchParams.get("vertical"));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthContent.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const hasReferralParamsInUrl = Boolean(referralCodeIntentFromUrl) || referralLockedFromUrl;
            let resolvedCode = referralCodeIntentFromUrl;
            let resolvedLock = referralLockedFromUrl;
            try {
                if (hasReferralParamsInUrl) {
                    if (resolvedCode) {
                        window.sessionStorage.setItem(REFERRAL_INTENT_CODE_KEY, resolvedCode);
                    }
                    if (resolvedLock) {
                        window.sessionStorage.setItem(REFERRAL_INTENT_LOCK_KEY, "1");
                    }
                } else {
                    const storedCode = normalizeReferralInput(window.sessionStorage.getItem(REFERRAL_INTENT_CODE_KEY));
                    const storedLock = String(window.sessionStorage.getItem(REFERRAL_INTENT_LOCK_KEY) || "").trim() === "1";
                    if (!resolvedCode && storedCode) {
                        resolvedCode = storedCode;
                    }
                    if (!resolvedLock && storedLock) {
                        resolvedLock = true;
                    }
                }
            } catch (error) {
                console.warn("[Auth] No se pudo sincronizar intent de referido en sessionStorage:", error);
            }
            if (resolvedCode) {
                setRegisterReferralCode({
                    "AuthContent.useEffect": (current)=>current || resolvedCode
                }["AuthContent.useEffect"]);
            }
            setReferralLockIntent(resolvedLock);
        }
    }["AuthContent.useEffect"], [
        referralCodeIntentFromUrl,
        referralLockedFromUrl
    ]);
    const persistGoogleIntent = (intent)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        googleIntentRef.current = intent;
        googleIntentMemoryRef.current = intent;
        try {
            window.sessionStorage.setItem(GOOGLE_AUTH_INTENT_KEY, intent);
        } catch (error) {
            console.warn("[Auth] No se pudo persistir intent en sessionStorage:", error);
        }
    };
    const readGoogleIntent = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        let raw = "";
        try {
            raw = String(window.sessionStorage.getItem(GOOGLE_AUTH_INTENT_KEY) || "").trim().toLowerCase();
        } catch (error) {
            console.warn("[Auth] No se pudo leer intent de sessionStorage:", error);
        }
        if (!raw && googleIntentMemoryRef.current) {
            return googleIntentMemoryRef.current;
        }
        if (raw === "register") return "register";
        if (raw === "login") return "login";
        return tab;
    };
    const clearGoogleIntent = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        googleIntentMemoryRef.current = null;
        try {
            window.sessionStorage.removeItem(GOOGLE_AUTH_INTENT_KEY);
        } catch (error) {
            console.warn("[Auth] No se pudo limpiar intent de sessionStorage:", error);
        }
    };
    const readReferralCodeIntent = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            return normalizeReferralInput(window.sessionStorage.getItem(REFERRAL_INTENT_CODE_KEY));
        } catch (error) {
            console.warn("[Auth] No se pudo leer codigo de referido en sessionStorage:", error);
            return "";
        }
    };
    const clearReferralIntent = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            window.sessionStorage.removeItem(REFERRAL_INTENT_CODE_KEY);
            window.sessionStorage.removeItem(REFERRAL_INTENT_LOCK_KEY);
        } catch (error) {
            console.warn("[Auth] No se pudo limpiar intent de referido en sessionStorage:", error);
        }
    };
    const isCanonicalRedirectNeeded = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (isPwaAuthContext()) return false;
        const currentHost = window.location.host.toLowerCase();
        if (!CANONICAL_AUTH_HOST) return false;
        if (currentHost === CANONICAL_AUTH_HOST) return false;
        // Redirect only known alias hosts to canonical auth host.
        return AUTH_ALIAS_HOSTS.includes(currentHost);
    };
    const redirectToCanonicalAuthHost = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const target = new URL(window.location.href);
        target.host = CANONICAL_AUTH_HOST;
        window.location.href = target.toString();
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthContent.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistUtmFromUrl"])(searchParams);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persistVerticalChoice"])(preferredVertical);
            if (searchParams.get("tab") === "register") {
                setTab("register");
                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("start_signup", {
                    vertical: preferredVertical,
                    location: "auth_register_tab"
                });
            }
        }
    }["AuthContent.useEffect"], [
        preferredVertical,
        searchParams
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthContent.useEffect": ()=>{
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setPersistence"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["browserLocalPersistence"]).catch({
                "AuthContent.useEffect": (error)=>{
                    console.warn("[Auth] No se pudo fijar persistencia local:", error);
                }
            }["AuthContent.useEffect"]);
        }
    }["AuthContent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthContent.useEffect": ()=>{
            setIsStandalonePwa(isStandaloneMode());
        }
    }["AuthContent.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthContent.useEffect": ()=>{
            if (!isCanonicalRedirectNeeded()) return;
            showToast(`${i18n.redirectingSecure} ${CANONICAL_AUTH_HOST}`);
            setTimeout({
                "AuthContent.useEffect": ()=>redirectToCanonicalAuthHost()
            }["AuthContent.useEffect"], 700);
        }
    }["AuthContent.useEffect"], [
        i18n.redirectingSecure
    ]);
    const startGoogleRedirect = async (intent)=>{
        const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
        provider.setCustomParameters({
            prompt: "select_account"
        });
        persistGoogleIntent(intent);
        showToast(i18n.redirectGoogle);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithRedirect"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], provider);
    };
    const showToast = (message)=>{
        setToast(message);
        setTimeout(()=>setToast(""), 3000);
    };
    const fetchWithTimeout = async (input, init = {}, timeoutMs = 6000)=>{
        const controller = new AbortController();
        const timer = setTimeout(()=>controller.abort(), timeoutMs);
        try {
            return await fetch(input, {
                ...init,
                signal: controller.signal
            });
        } finally{
            clearTimeout(timer);
        }
    };
    const syncSubscriptionSession = async (firebaseUser)=>{
        if (!firebaseUser?.uid) return;
        try {
            const token = await firebaseUser.getIdToken();
            await fetchWithTimeout("/api/subscription/session", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            await fetchWithTimeout("/api/subscription/current", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).catch(()=>undefined);
        } catch (error) {
            console.warn("[Auth] No se pudo sincronizar la sesion de suscripcion.", error);
        }
    };
    const applyReferralCodeAfterAuth = async (firebaseUser, forceApply = false)=>{
        const code = normalizeReferralInput(registerReferralCode || referralCodeIntentFromUrl || readReferralCodeIntent());
        if (!code) return;
        if (!forceApply && tab !== "register") return;
        if (!firebaseUser?.uid) return;
        try {
            const token = await firebaseUser.getIdToken();
            const response = await fetch("/api/referrals/apply", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code
                })
            });
            if (response.ok) {
                clearReferralIntent();
            }
        } catch (error) {
            console.warn("[Auth] No se pudo aplicar codigo de referido.", error);
        }
    };
    const resolvePostAuthTarget = (email)=>{
        if (email === "afiliadosprobusiness@gmail.com") return "/admin";
        return "/hub";
    };
    // Funcion centralizada para sincronizar usuario con Firestore
    const syncUserToFirestore = async (user, verticalHint)=>{
        if (!user || !user.uid) return;
        try {
            console.log("Intentando sincronizar en Firestore:", user.email);
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], "users", user.uid);
            const is_admin = user.email === "afiliadosprobusiness@gmail.com";
            const resolvedVertical = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeVertical"])(verticalHint || searchParams.get("vertical") || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readVerticalFromClient"])());
            const userData = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || user.name || (user.email ? user.email.split('@')[0] : "Usuario"),
                photoURL: user.photoURL || "",
                lastLogin: Date.now(),
                createdAt: user.metadata?.createdAt ? parseInt(user.metadata.createdAt) : Date.now(),
                status: "active",
                role: is_admin ? "admin" : "user",
                vertical: resolvedVertical,
                businessType: resolvedVertical
            };
            // Aumentamos el timeout a 10 segundos
            const savePromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(userRef, userData, {
                merge: true
            });
            const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>reject(new Error("Timeout sync")), 10000));
            await Promise.race([
                savePromise,
                timeoutPromise
            ]);
            console.log("Sincronizacion exitosa para:", user.email);
            // Actualizar sesion local
            localStorage.setItem("fp_session", JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error("Error detallado de sincronizacion:", error);
            // Fallback local
            localStorage.setItem("fp_session", JSON.stringify({
                uid: user.uid,
                email: user.email,
                name: user.displayName || "Usuario"
            }));
            return false;
        }
    };
    const runPostAuthFlow = async (firebaseUser, source)=>{
        if (!firebaseUser?.uid) return;
        if (isPostAuthProcessingRef.current) return;
        isPostAuthProcessingRef.current = true;
        const target = resolvePostAuthTarget(firebaseUser.email);
        router.push(target);
        void (async ()=>{
            try {
                const intent = readGoogleIntent();
                await syncUserToFirestore(firebaseUser, preferredVertical);
                await applyReferralCodeAfterAuth(firebaseUser, intent === "register");
                await syncSubscriptionSession(firebaseUser);
                if (intent === "register") {
                    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("signup_complete", {
                        vertical: preferredVertical,
                        location: source === "popup" ? "auth_google_popup" : "auth_google_redirect"
                    });
                }
                clearGoogleIntent();
            } catch (error) {
                console.error("[Auth] Error en flujo post login Google:", error);
            }
        })();
    };
    const handleRegister = async (e)=>{
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = String(form.get("name") || "").trim();
        const email = String(form.get("email") || "").trim().toLowerCase();
        const password = String(form.get("password") || "");
        if (!email || !password || !name) {
            showToast(i18n.fillAllFields);
            return;
        }
        try {
            // 1. Crear usuario en Firebase Auth
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, password);
            const user = userCredential.user;
            // 2. Actualizar perfil (nombre)
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateProfile"])(user, {
                displayName: name
            });
            // 3. Sincronizar con Firestore - Esperar a que se complete para asegurar que el Admin lo vea
            await syncUserToFirestore(user, preferredVertical);
            await applyReferralCodeAfterAuth(user, true);
            await syncSubscriptionSession(user);
            showToast(i18n.accountCreated);
            // Redireccion basada en el rol
            const target = resolvePostAuthTarget(email);
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("signup_complete", {
                vertical: preferredVertical,
                location: "auth_email_register"
            });
            setTimeout(()=>router.push(target), 1000);
        } catch (error) {
            console.error(error);
            if (error.code === "auth/email-already-in-use") {
                showToast(i18n.emailInUse);
            } else if (error.code === "auth/weak-password") {
                showToast(i18n.weakPassword);
            } else if (error.code === "auth/configuration-not-found") {
                showToast(i18n.authNotEnabled);
            } else {
                showToast(`${i18n.genericError} ${error.message}`);
            }
        }
    };
    const handleLogin = async (e)=>{
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = String(form.get("email") || "").trim().toLowerCase();
        const password = String(form.get("password") || "");
        if (!email || !password) {
            showToast(i18n.enterCredentials);
            return;
        }
        try {
            const userCredential = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, password);
            const user = userCredential.user;
            // Sincronizacion prioritaria antes de redireccionar
            await syncUserToFirestore(user, preferredVertical);
            await syncSubscriptionSession(user);
            router.push(resolvePostAuthTarget(user.email));
        } catch (error) {
            console.error(error);
            // Detectar si el usuario debe usar Google
            try {
                const methods = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchSignInMethodsForEmail"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email);
                if (methods.includes("google.com") && !methods.includes("password")) {
                    setIsGoogleError(true);
                    showToast(i18n.useGoogle);
                    setTimeout(()=>setIsGoogleError(false), 3000);
                    return;
                }
            } catch (e) {
            // Ignorar error de fetchSignInMethods (puede fallar por politicas de privacidad)
            }
            if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                showToast(i18n.invalidCredentials);
            } else {
                showToast(`${i18n.loginError} ${error.message}`);
            }
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthContent.useEffect": ()=>{
            // Check if user is already logged in
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], {
                "AuthContent.useEffect.unsubscribe": async (user)=>{
                    if (user) {
                        await runPostAuthFlow(user, "auth_state");
                    }
                }
            }["AuthContent.useEffect.unsubscribe"]);
            const checkRedirect = {
                "AuthContent.useEffect.checkRedirect": async ()=>{
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRedirectResult"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]);
                        if (result?.user) {
                            await runPostAuthFlow(result.user, "redirect");
                            return;
                        }
                    } catch (error) {
                        console.error("Redirect Error:", error);
                        clearGoogleIntent();
                        showToast(`${i18n.loginError} ${error?.code || error?.message || i18n.unknownError}`);
                    }
                }
            }["AuthContent.useEffect.checkRedirect"];
            checkRedirect();
            return ({
                "AuthContent.useEffect": ()=>unsubscribe()
            })["AuthContent.useEffect"];
        }
    }["AuthContent.useEffect"], [
        i18n.loginError,
        i18n.unknownError,
        preferredVertical,
        router,
        tab
    ]);
    const shouldUseGooglePopup = ()=>{
        if (isPwaAuthContext()) return true;
        if (FORCE_GOOGLE_REDIRECT) return false;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const ua = window.navigator.userAgent.toLowerCase();
        const isMobile = /android|iphone|ipad|ipod|mobile|opera mini|iemobile|webos/.test(ua) || isStandaloneMode();
        return !isMobile;
    };
    const handleGoogleLogin = async ()=>{
        if (isGoogleLoading) return;
        if (isCanonicalRedirectNeeded()) {
            persistGoogleIntent(tab);
            showToast(i18n.redirectingSecure + " " + CANONICAL_AUTH_HOST);
            setTimeout(()=>redirectToCanonicalAuthHost(), 500);
            return;
        }
        setIsGoogleLoading(true);
        try {
            if (shouldUseGooglePopup()) {
                const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
                provider.setCustomParameters({
                    prompt: "select_account"
                });
                try {
                    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithPopup"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], provider);
                    if (result?.user) {
                        persistGoogleIntent(tab);
                        await runPostAuthFlow(result.user, "popup");
                        return;
                    }
                } catch (popupError) {
                    const popupCode = String(popupError?.code || "");
                    const popupMessage = String(popupError?.message || "");
                    const unsupportedEnvironment = popupCode === "auth/operation-not-supported-in-this-environment";
                    const popupBlocked = popupCode === "auth/popup-blocked" || popupCode === "auth/popup-closed-by-user" || popupCode === "auth/cancelled-popup-request" || /popup/i.test(popupMessage);
                    const popupFatal = popupCode === "auth/unauthorized-domain" || popupCode === "auth/operation-not-allowed" || popupCode === "auth/invalid-api-key";
                    if (popupFatal) {
                        throw popupError;
                    }
                    if (popupBlocked) {
                        setIsGoogleError(true);
                        showToast(`${i18n.popupBlocked} ${i18n.redirectGoogle}`);
                        setTimeout(()=>setIsGoogleError(false), 3000);
                        await startGoogleRedirect(tab);
                        return;
                    }
                    if (unsupportedEnvironment) {
                        console.warn("[Auth] Entorno sin soporte popup, fallback a redirect", popupError);
                    } else {
                        console.warn("[Auth] Popup Google fallo; fallback a redirect", popupError);
                    }
                    await startGoogleRedirect(tab);
                    return;
                }
            }
            await startGoogleRedirect(tab);
        } catch (error) {
            console.error("Google Login Error:", error);
            clearGoogleIntent();
            if (error.code === "auth/unauthorized-domain") {
                if (isCanonicalRedirectNeeded()) {
                    showToast(i18n.unauthorizedDomainGoogle);
                    setTimeout(()=>redirectToCanonicalAuthHost(), 700);
                } else {
                    showToast(`${i18n.unauthorizedDomainFirebase} ${RECOMMENDED_FIREBASE_AUTH_DOMAINS.join(", ")}`);
                }
            } else if (error.code === "auth/operation-not-allowed") {
                showToast(i18n.authNotEnabled);
            } else {
                showToast(`${i18n.loginError} ${error.message || i18n.unknownError}`);
            }
        } finally{
            setIsGoogleLoading(false);
        }
    };
    const handlePasswordRecovery = async ()=>{
        const email = loginEmail.trim().toLowerCase();
        if (!email) {
            showToast(i18n.typeEmailForRecovery);
            return;
        }
        setIsResettingPassword(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendPasswordResetEmail"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email);
            showToast(i18n.recoverySent);
        } catch (error) {
            console.error("Password Recovery Error:", error);
            if (error.code === "auth/invalid-email") {
                showToast(i18n.invalidEmail);
            } else if (error.code === "auth/user-not-found") {
                showToast(i18n.accountNotFound);
            } else {
                showToast(i18n.recoveryFailed);
            }
        } finally{
            setIsResettingPassword(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "relative min-h-[100dvh] overflow-x-hidden overflow-y-auto px-4 pb-10 pt-12 md:pb-12 md:pt-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 794,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px] pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 795,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 mx-auto flex w-full max-w-md flex-col items-stretch",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8 min-h-[116px] text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 flex justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setLanguage(language === "es" ? "en" : "es"),
                                    className: "inline-flex h-8 min-w-[2.25rem] items-center justify-center rounded-full border border-white/20 bg-white/5 px-2 text-[10px] font-bold tracking-[0.08em] text-white transition hover:border-amber-300/45 hover:text-amber-200",
                                    "aria-label": isEnglish ? "Change language" : "Cambiar idioma",
                                    children: language === "es" ? "EN" : "ES"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/auth/page.tsx",
                                    lineNumber: 800,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 799,
                                columnNumber: 11
                            }, this),
                            isStandalonePwa ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                        className: "w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 811,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-3xl font-bold text-tornasolado tracking-tight transition-all",
                                        children: "Fast Page"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 812,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 810,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "inline-flex items-center gap-3 group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                        className: "w-12 h-12 text-amber-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.6)] group-hover:scale-110 transition-transform duration-300"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 818,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-3xl font-bold text-tornasolado tracking-tight transition-all",
                                        children: "Fast Page"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 819,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 817,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 min-h-[24px] text-zinc-400 dark:text-white",
                                children: tab === "login" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        i18n.loginWelcome,
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gold-glow",
                                            children: i18n.creator
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/page.tsx",
                                            lineNumber: 828,
                                            columnNumber: 17
                                        }, this),
                                        "."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        i18n.signupWelcome,
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gold-glow",
                                            children: i18n.signupEmpire
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/page.tsx",
                                            lineNumber: 833,
                                            columnNumber: 17
                                        }, this),
                                        "."
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 824,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300",
                                children: [
                                    i18n.selectedVertical,
                                    " ",
                                    preferredVertical
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 837,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 798,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass min-h-[700px] overflow-hidden rounded-2xl border border-white/10 p-1 shadow-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 p-1 bg-black/20 rounded-xl mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setTab("login"),
                                        className: `py-3 text-sm font-medium rounded-full transition-all duration-300 ${tab === "login" ? "bg-white/10 text-white shadow-lg border border-white/5" : "text-muted hover:text-white hover:bg-white/5"}`,
                                        children: i18n.loginTab
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 846,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setTab("register");
                                            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("start_signup", {
                                                vertical: preferredVertical,
                                                location: "auth_tab_click"
                                            });
                                        },
                                        className: `py-3 text-sm font-medium rounded-full transition-all duration-300 ${tab === "register" ? "bg-white/10 text-white shadow-lg border border-white/5" : "text-muted hover:text-white hover:bg-white/5"}`,
                                        children: i18n.registerTab
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 856,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 845,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "px-6 pb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-h-[320px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                onSubmit: handleLogin,
                                                "aria-hidden": tab !== "login",
                                                className: `flex flex-col gap-5 transition-opacity duration-200 ${tab === "login" ? "pointer-events-auto opacity-100" : "pointer-events-none hidden opacity-0"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-sm font-medium text-gray-300 ml-1",
                                                                children: i18n.labelEmail
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 886,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "email",
                                                                type: "email",
                                                                autoComplete: "email",
                                                                placeholder: i18n.placeholderEmail,
                                                                required: true,
                                                                value: loginEmail,
                                                                onChange: (e)=>setLoginEmail(e.target.value),
                                                                className: "w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 889,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 885,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center ml-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-sm font-medium text-gray-300",
                                                                        children: i18n.labelPassword
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                                        lineNumber: 902,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: handlePasswordRecovery,
                                                                        disabled: isResettingPassword,
                                                                        className: "text-xs text-yellow-500/80 hover:text-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                                                                        children: i18n.forgotPassword
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                                        lineNumber: 905,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 901,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        name: "password",
                                                                        type: showPassword ? "text" : "password",
                                                                        autoComplete: "current-password",
                                                                        placeholder: "********",
                                                                        required: true,
                                                                        className: "w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none pr-12"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                                        lineNumber: 915,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setShowPassword(!showPassword),
                                                                        className: "absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white hover:text-white transition-colors",
                                                                        children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            width: "20",
                                                                            height: "20",
                                                                            viewBox: "0 0 24 24",
                                                                            fill: "none",
                                                                            stroke: "currentColor",
                                                                            strokeWidth: "2",
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                                                    lineNumber: 940,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                    x1: "1",
                                                                                    y1: "1",
                                                                                    x2: "23",
                                                                                    y2: "23"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                                                    lineNumber: 941,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/auth/page.tsx",
                                                                            lineNumber: 929,
                                                                            columnNumber: 25
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            width: "20",
                                                                            height: "20",
                                                                            viewBox: "0 0 24 24",
                                                                            fill: "none",
                                                                            stroke: "currentColor",
                                                                            strokeWidth: "2",
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                                                    lineNumber: 955,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                                    cx: "12",
                                                                                    cy: "12",
                                                                                    r: "3"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                                                    lineNumber: 956,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/auth/page.tsx",
                                                                            lineNumber: 944,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                                        lineNumber: 923,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 914,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 900,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        className: "btn-deluxe w-full py-3.5 rounded-full text-black font-bold text-lg shadow-lg hover:shadow-yellow-500/20 mt-2",
                                                        children: i18n.submitLogin
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 962,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 876,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                onSubmit: handleRegister,
                                                "aria-hidden": tab !== "register",
                                                className: `flex flex-col gap-5 transition-opacity duration-200 ${tab === "register" ? "pointer-events-auto opacity-100" : "pointer-events-none hidden opacity-0"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-sm font-medium text-gray-300 ml-1",
                                                                children: i18n.labelName
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 980,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "name",
                                                                type: "text",
                                                                autoComplete: "name",
                                                                placeholder: i18n.placeholderName,
                                                                required: true,
                                                                className: "w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 983,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 979,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-sm font-medium text-gray-300 ml-1",
                                                                children: i18n.labelEmail
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 993,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "email",
                                                                type: "email",
                                                                autoComplete: "email",
                                                                placeholder: i18n.placeholderEmail,
                                                                required: true,
                                                                className: "w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 996,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 992,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-sm font-medium text-gray-300 ml-1",
                                                                children: i18n.labelReferral
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 1006,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "referralCode",
                                                                type: "text",
                                                                autoComplete: "off",
                                                                placeholder: i18n.placeholderReferral,
                                                                value: registerReferralCode,
                                                                onChange: (event)=>setRegisterReferralCode(normalizeReferralInput(event.target.value)),
                                                                disabled: referralInputLocked,
                                                                readOnly: referralInputLocked,
                                                                className: "w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none disabled:cursor-not-allowed disabled:opacity-80"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 1009,
                                                                columnNumber: 19
                                                            }, this),
                                                            referralInputLocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-amber-200",
                                                                children: i18n.referralLockedHint
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 1021,
                                                                columnNumber: 21
                                                            }, this) : null
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 1005,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-sm font-medium text-gray-300 ml-1",
                                                                children: i18n.labelPassword
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 1025,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        name: "password",
                                                                        type: showPassword ? "text" : "password",
                                                                        autoComplete: "new-password",
                                                                        placeholder: "********",
                                                                        required: true,
                                                                        className: "w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all outline-none pr-12"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                                        lineNumber: 1029,
                                                                        columnNumber: 21
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setShowPassword(!showPassword),
                                                                        className: "absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-white hover:text-white transition-colors",
                                                                        children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            width: "20",
                                                                            height: "20",
                                                                            viewBox: "0 0 24 24",
                                                                            fill: "none",
                                                                            stroke: "currentColor",
                                                                            strokeWidth: "2",
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                                                    lineNumber: 1054,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                                                    x1: "1",
                                                                                    y1: "1",
                                                                                    x2: "23",
                                                                                    y2: "23"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                                                    lineNumber: 1055,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/auth/page.tsx",
                                                                            lineNumber: 1043,
                                                                            columnNumber: 25
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            width: "20",
                                                                            height: "20",
                                                                            viewBox: "0 0 24 24",
                                                                            fill: "none",
                                                                            stroke: "currentColor",
                                                                            strokeWidth: "2",
                                                                            strokeLinecap: "round",
                                                                            strokeLinejoin: "round",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                                    d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                                                    lineNumber: 1069,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                                    cx: "12",
                                                                                    cy: "12",
                                                                                    r: "3"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/auth/page.tsx",
                                                                                    lineNumber: 1070,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/auth/page.tsx",
                                                                            lineNumber: 1058,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                                        lineNumber: 1037,
                                                                        columnNumber: 21
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/auth/page.tsx",
                                                                lineNumber: 1028,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 1024,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        className: "btn-deluxe w-full py-3.5 rounded-full text-black font-bold text-lg shadow-lg hover:shadow-yellow-500/20 mt-2",
                                                        children: i18n.submitRegister
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 1076,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 970,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 875,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-4 my-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-[1px] bg-white/10 flex-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 1087,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-muted uppercase tracking-widest",
                                                children: i18n.continueWith
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 1088,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-[1px] bg-white/10 flex-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 1091,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 1086,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleGoogleLogin,
                                        disabled: isGoogleLoading,
                                        className: `w-full transition-all duration-300 py-3.5 rounded-full font-medium flex items-center justify-center gap-3 shadow-lg ${isGoogleError ? "bg-red-600 text-white animate-shake ring-4 ring-red-500/50" : "bg-[#0f141f] border border-white/15 text-white hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 hover:bg-gradient-to-r hover:text-black hover:border-yellow-200/80 disabled:opacity-60 disabled:cursor-not-allowed"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                width: "20",
                                                height: "20",
                                                viewBox: "0 0 24 24",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fill: "#4285F4",
                                                        d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 1110,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fill: "#34A853",
                                                        d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 1114,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fill: "#FBBC05",
                                                        d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 1118,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        fill: "#EA4335",
                                                        d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/auth/page.tsx",
                                                        lineNumber: 1122,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/auth/page.tsx",
                                                lineNumber: 1104,
                                                columnNumber: 15
                                            }, this),
                                            isGoogleLoading ? i18n.redirectGoogle : i18n.continueGoogle
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 1095,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 min-h-[24px]",
                                        children: tab === "login" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: handlePasswordRecovery,
                                            disabled: isResettingPassword,
                                            className: "w-full text-center text-sm text-slate-300 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                                            children: i18n.recoverButton
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/auth/page.tsx",
                                            lineNumber: 1131,
                                            columnNumber: 15
                                        }, this) : null
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/auth/page.tsx",
                                        lineNumber: 1129,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/auth/page.tsx",
                                lineNumber: 874,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 843,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-center text-sm text-zinc-400 dark:text-white mt-8",
                        children: [
                            "© ",
                            new Date().getFullYear(),
                            " Fast Page. ",
                            i18n.rights
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 1144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 796,
                columnNumber: 7
            }, this),
            toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-8 left-1/2 z-50 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-white shadow-xl backdrop-blur-md animate-fade-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-yellow-400",
                        children: "!"
                    }, void 0, false, {
                        fileName: "[project]/src/app/auth/page.tsx",
                        lineNumber: 1152,
                        columnNumber: 11
                    }, this),
                    toast
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/auth/page.tsx",
                lineNumber: 1151,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/auth/page.tsx",
        lineNumber: 792,
        columnNumber: 5
    }, this);
}
_s(AuthContent, "aomIrVSihTzVkGo+fu3ac3TB8ow=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLanguage"]
    ];
});
_c2 = AuthContent;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "AUTH_ALIAS_HOSTS");
__turbopack_context__.k.register(_c1, "AuthPage");
__turbopack_context__.k.register(_c2, "AuthContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_082601fb._.js.map