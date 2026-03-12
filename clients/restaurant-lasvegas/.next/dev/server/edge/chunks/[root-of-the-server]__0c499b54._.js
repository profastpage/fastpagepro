(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__0c499b54._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/lib/permissions.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canAccessFeature",
    ()=>canAccessFeature,
    "getPlanAiLevel",
    ()=>getPlanAiLevel,
    "getPlanAnalyticsLevel",
    ()=>getPlanAnalyticsLevel,
    "getPlanLimits",
    ()=>getPlanLimits,
    "isThemeAllowedForPlan",
    ()=>isThemeAllowedForPlan,
    "toCanonicalPlanType",
    ()=>toCanonicalPlanType,
    "toPlanType",
    ()=>toPlanType
]);
const FEATURE_LIST = [
    "premiumThemes",
    "categoryThemes",
    "aiOptimization",
    "advancedMetrics",
    "basicMetrics",
    "removeBranding",
    "customDomain",
    "multiUser",
    "conversionOptimizationAdvanced",
    "ctaOptimization",
    "advancedColorCustomization",
    "supportPriority",
    "fullStore",
    "clonerAccess",
    "insightsAutomation",
    "whiteLabel"
];
function createFeatureMap(active) {
    return FEATURE_LIST.reduce((acc, feature)=>{
        acc[feature] = Boolean(active[feature]);
        return acc;
    }, {});
}
const PLAN_CAPABILITIES = {
    starter: {
        aiLevel: "none",
        analyticsLevel: "none",
        limits: {
            maxPublishedPages: 1,
            maxBasicThemes: 3,
            maxProjects: 1,
            maxProductsPerProject: 10
        },
        features: createFeatureMap({})
    },
    business: {
        aiLevel: "basic",
        analyticsLevel: "basic",
        limits: {
            maxPublishedPages: 5,
            maxBasicThemes: null,
            maxProjects: 5,
            maxProductsPerProject: 50
        },
        features: createFeatureMap({
            premiumThemes: true,
            categoryThemes: true,
            basicMetrics: true,
            customDomain: true,
            ctaOptimization: true,
            advancedColorCustomization: true,
            supportPriority: true,
            fullStore: true
        })
    },
    pro: {
        aiLevel: "advanced",
        analyticsLevel: "pro",
        limits: {
            maxPublishedPages: 20,
            maxBasicThemes: null,
            maxProjects: 20,
            maxProductsPerProject: null
        },
        features: createFeatureMap({
            premiumThemes: true,
            categoryThemes: true,
            aiOptimization: true,
            advancedMetrics: true,
            basicMetrics: true,
            removeBranding: true,
            customDomain: true,
            conversionOptimizationAdvanced: true,
            ctaOptimization: true,
            advancedColorCustomization: true,
            supportPriority: true,
            fullStore: true,
            clonerAccess: true,
            insightsAutomation: true
        })
    },
    agency: {
        aiLevel: "advanced",
        analyticsLevel: "pro",
        limits: {
            maxPublishedPages: null,
            maxBasicThemes: null,
            maxProjects: null,
            maxProductsPerProject: null
        },
        features: createFeatureMap({
            premiumThemes: true,
            categoryThemes: true,
            aiOptimization: true,
            advancedMetrics: true,
            basicMetrics: true,
            removeBranding: true,
            customDomain: true,
            multiUser: true,
            conversionOptimizationAdvanced: true,
            ctaOptimization: true,
            advancedColorCustomization: true,
            supportPriority: true,
            fullStore: true,
            clonerAccess: true,
            insightsAutomation: true,
            whiteLabel: true
        })
    }
};
const CANONICAL_ALIAS = {
    starter: "starter",
    free: "starter",
    business: "business",
    pro: "pro",
    agency: "agency"
};
const LEGACY_BY_CANONICAL = {
    starter: "FREE",
    business: "BUSINESS",
    pro: "PRO",
    // Compatibility fallback while backend enums are still FREE/BUSINESS/PRO.
    agency: "PRO"
};
function toCanonicalPlanType(input) {
    const normalized = String(input || "").trim().toLowerCase();
    return CANONICAL_ALIAS[normalized] || "starter";
}
function toPlanType(input) {
    return LEGACY_BY_CANONICAL[toCanonicalPlanType(input)];
}
function getPlanLimits(userPlan) {
    return PLAN_CAPABILITIES[toCanonicalPlanType(userPlan)].limits;
}
function getPlanAiLevel(userPlan) {
    return PLAN_CAPABILITIES[toCanonicalPlanType(userPlan)].aiLevel;
}
function getPlanAnalyticsLevel(userPlan) {
    return PLAN_CAPABILITIES[toCanonicalPlanType(userPlan)].analyticsLevel;
}
function canAccessFeature(userPlan, feature) {
    return Boolean(PLAN_CAPABILITIES[toCanonicalPlanType(userPlan)].features[feature]);
}
function isThemeAllowedForPlan(userPlan, themeIndex) {
    const limits = getPlanLimits(userPlan);
    if (limits.maxBasicThemes == null) return true;
    return themeIndex < limits.maxBasicThemes;
}
}),
"[project]/src/lib/subscription/sessionToken.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SUBSCRIPTION_SESSION_COOKIE",
    ()=>SUBSCRIPTION_SESSION_COOKIE,
    "createSubscriptionSessionToken",
    ()=>createSubscriptionSessionToken,
    "verifySubscriptionSessionToken",
    ()=>verifySubscriptionSessionToken
]);
const SUBSCRIPTION_SESSION_COOKIE = "fp_sub_session";
function encodeBase64Url(input) {
    let raw = "";
    for(let i = 0; i < input.length; i += 1){
        raw += String.fromCharCode(input[i]);
    }
    return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function decodeBase64Url(input) {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for(let i = 0; i < binary.length; i += 1){
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
async function sign(content, secret) {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {
        name: "HMAC",
        hash: "SHA-256"
    }, false, [
        "sign"
    ]);
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(content));
    return encodeBase64Url(new Uint8Array(signature));
}
async function createSubscriptionSessionToken(payload, secret) {
    const json = JSON.stringify(payload);
    const encodedPayload = encodeBase64Url(new TextEncoder().encode(json));
    const signature = await sign(encodedPayload, secret);
    return `${encodedPayload}.${signature}`;
}
async function verifySubscriptionSessionToken(token, secret) {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) return null;
    const expected = await sign(encodedPayload, secret);
    if (expected !== signature) return null;
    try {
        const payloadRaw = new TextDecoder().decode(decodeBase64Url(encodedPayload));
        const payload = JSON.parse(payloadRaw);
        if (!payload?.userId || !payload?.plan || !payload?.status) return null;
        if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) return null;
        return payload;
    } catch  {
        return null;
    }
}
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/permissions.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$subscription$2f$sessionToken$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/subscription/sessionToken.ts [middleware-edge] (ecmascript)");
;
;
;
const GUARDS = [
    {
        pattern: /^\/api\/ai(?:\/|$)/,
        feature: "aiOptimization",
        mode: "api"
    },
    {
        pattern: /^\/metrics(?:\/|$)/,
        feature: "basicMetrics",
        mode: "page"
    },
    {
        pattern: /^\/api\/metrics(?:\/|$)/,
        feature: "basicMetrics",
        mode: "api"
    },
    {
        pattern: /^\/builder(?:\/|$)/,
        feature: "clonerAccess",
        mode: "page"
    },
    {
        pattern: /^\/templates(?:\/|$)/,
        feature: "clonerAccess",
        mode: "page"
    },
    {
        pattern: /^\/store(?:\/|$)/,
        feature: "fullStore",
        mode: "page"
    },
    {
        pattern: /^\/cloner\/web(?:\/|$)/,
        feature: "clonerAccess",
        mode: "page"
    },
    {
        pattern: /^\/dashboard\/domain(?:\/|$)/,
        feature: "customDomain",
        mode: "page"
    },
    {
        pattern: /^\/dashboard\/team(?:\/|$)/,
        feature: "multiUser",
        mode: "page"
    },
    {
        pattern: /^\/dashboard\/branding(?:\/|$)/,
        feature: "removeBranding",
        mode: "page"
    },
    {
        pattern: /^\/dashboard\/optimizacion(?:\/|$)/,
        feature: "conversionOptimizationAdvanced",
        mode: "page"
    }
];
const EXCLUDED_PATHS = [
    "/dashboard/billing",
    "/api/subscription/"
];
const ACTIVE_ONLY_PATHS = [
    /^\/cartadigital(?:\/|$)/,
    /^\/linkhub(?:\/|$)/,
    /^\/settings(?:\/|$)/,
    /^\/published(?:\/|$)/,
    /^\/editor(?:\/|$)/,
    /^\/preview(?:\/|$)/,
    /^\/app\/new(?:\/|$)/,
    /^\/api\/publish(?:\/|$)/,
    /^\/api\/sites(?:\/|$)/,
    /^\/api\/clone(?:\/|$)/
];
const DEFAULT_CANONICAL_HOST = "www.fastpagepro.com";
const DEFAULT_ALLOWED_PUBLIC_HOSTS = [
    "www.fastpagepro.com",
    "fastpagepro.com"
];
function resolveCurrentHost(request) {
    const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    return hostHeader.split(",")[0]?.trim().split(":")[0]?.toLowerCase() || "";
}
function resolveCanonicalHost() {
    return String(("TURBOPACK compile-time value", "www.fastpagepro.com") || DEFAULT_CANONICAL_HOST).trim().toLowerCase() || DEFAULT_CANONICAL_HOST;
}
function resolveAllowedPublicHosts() {
    const canonical = resolveCanonicalHost();
    const aliases = String(("TURBOPACK compile-time value", "fastpagepro.com") || "").split(",").map((entry)=>entry.trim().toLowerCase()).filter(Boolean);
    return new Set([
        ...DEFAULT_ALLOWED_PUBLIC_HOSTS,
        canonical,
        ...aliases
    ]);
}
function isLocalHost(host) {
    return host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
}
async function middleware(request) {
    const path = request.nextUrl.pathname;
    const host = resolveCurrentHost(request);
    if (("TURBOPACK compile-time value", "development") === "production" && host && !isLocalHost(host)) //TURBOPACK unreachable
    ;
    if (EXCLUDED_PATHS.some((entry)=>path.startsWith(entry))) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const guard = GUARDS.find((entry)=>entry.pattern.test(path));
    const activeOnlyGuard = ACTIVE_ONLY_PATHS.some((entry)=>entry.test(path));
    if (!guard && !activeOnlyGuard) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const secret = process.env.SUBSCRIPTION_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const token = request.cookies.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$subscription$2f$sessionToken$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["SUBSCRIPTION_SESSION_COOKIE"])?.value || "";
    const payload = token ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$subscription$2f$sessionToken$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["verifySubscriptionSessionToken"])(token, secret) : null;
    const userPlan = payload?.plan || "FREE";
    const isActive = payload?.status === "ACTIVE" && new Date(payload.endDate).getTime() > Date.now();
    const hasFeature = guard ? isActive && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$permissions$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["canAccessFeature"])(userPlan, guard.feature) : false;
    if (activeOnlyGuard && payload && !isActive) {
        if (path.startsWith("/api/")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Suscripcion expirada. Renueva en Billing para reactivar funciones."
            }, {
                status: 403
            });
        }
        const billingUrl = request.nextUrl.clone();
        billingUrl.pathname = "/dashboard/billing";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(billingUrl);
    }
    if (!guard || hasFeature) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    if (guard.mode === "api") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Feature bloqueada: ${guard.feature}. Actualiza a BUSINESS o PRO.`
        }, {
            status: 403
        });
    }
    const billingUrl = request.nextUrl.clone();
    billingUrl.pathname = "/dashboard/billing";
    billingUrl.searchParams.set("requiredFeature", guard.feature);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(billingUrl);
}
const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0c499b54._.js.map