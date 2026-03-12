module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/firebaseAdmin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminAuth",
    ()=>adminAuth,
    "adminDb",
    ()=>adminDb,
    "adminStorage",
    ()=>adminStorage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs, [project]/node_modules/firebase-admin)");
;
let isInitialized = false;
let initWarningShown = false;
const DEFAULT_FIREBASE_PROJECT_ID = "fastpage-7ceb3";
function resolveFirebaseProjectId() {
    return normalizeSecret(String(process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || ("TURBOPACK compile-time value", "fastpage2-db56b") || DEFAULT_FIREBASE_PROJECT_ID));
}
function resolveFirebaseStorageBucket(projectId) {
    const fromEnv = normalizeSecret(String(process.env.FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_ADMIN_STORAGE_BUCKET || ("TURBOPACK compile-time value", "fastpage2-db56b.appspot.com") || ""));
    if (fromEnv) return fromEnv;
    return projectId ? `${projectId}.firebasestorage.app` : "";
}
function unwrapQuoted(raw) {
    const trimmed = String(raw || "").trim();
    return trimmed.startsWith('"') && trimmed.endsWith('"') || trimmed.startsWith("'") && trimmed.endsWith("'") ? trimmed.slice(1, -1) : trimmed;
}
function normalizeSecret(raw) {
    return unwrapQuoted(raw).replace(/\\n/g, "\n").trim();
}
function normalizeServiceAccountJson(raw) {
    const unquoted = unwrapQuoted(raw);
    if (!unquoted) return "";
    if (unquoted.startsWith("{")) return unquoted;
    try {
        const parsed = JSON.parse(unquoted);
        if (typeof parsed === "string") return String(parsed).trim();
    } catch  {
    // Ignore and continue.
    }
    return unquoted;
}
function toAdminServiceAccount(input) {
    const projectId = String(input?.project_id || input?.projectId || resolveFirebaseProjectId()).trim();
    const clientEmail = String(input?.client_email || input?.clientEmail || "").trim();
    const privateKey = normalizeSecret(String(input?.private_key || input?.privateKey || ""));
    if (!projectId || !clientEmail || !privateKey) {
        return null;
    }
    return {
        projectId,
        clientEmail,
        privateKey
    };
}
function parseServiceAccount(raw) {
    const normalized = normalizeServiceAccountJson(raw);
    if (!normalized) return null;
    try {
        const parsed = JSON.parse(normalized);
        return toAdminServiceAccount(parsed);
    } catch  {
    // Ignore and continue with base64 fallback.
    }
    try {
        const decoded = Buffer.from(normalized, "base64").toString("utf8").trim();
        const parsed = JSON.parse(decoded);
        return toAdminServiceAccount(parsed);
    } catch  {
        return null;
    }
}
function buildServiceAccountFromEnv() {
    const serviceAccountKey = String(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_ADMIN_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "").trim();
    if (serviceAccountKey) {
        return parseServiceAccount(serviceAccountKey);
    }
    const projectId = resolveFirebaseProjectId();
    const clientEmail = normalizeSecret(String(process.env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL || ""));
    const privateKey = normalizeSecret(String(process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || ""));
    if (!projectId || !clientEmail || !privateKey) {
        return null;
    }
    return {
        projectId,
        clientEmail,
        privateKey
    };
}
function shouldUseApplicationDefaultCredentials() {
    const explicitOptIn = normalizeSecret(String(process.env.FIREBASE_ADMIN_USE_APPLICATION_DEFAULT || ""));
    if (explicitOptIn === "1" || explicitOptIn.toLowerCase() === "true") {
        return true;
    }
    // ADC usually needs either a credentials file path or a native Google runtime.
    const explicitCredentialsPath = normalizeSecret(String(process.env.GOOGLE_APPLICATION_CREDENTIALS || ""));
    if (explicitCredentialsPath) {
        return true;
    }
    const runningOnGoogleRuntime = Boolean(String(process.env.K_SERVICE || "").trim()) || Boolean(String(process.env.FUNCTION_TARGET || "").trim()) || Boolean(String(process.env.GAE_ENV || "").trim()) || Boolean(String(process.env.GOOGLE_CLOUD_PROJECT || "").trim());
    return runningOnGoogleRuntime;
}
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["apps"].length) {
    try {
        const serviceAccount = buildServiceAccountFromEnv();
        const projectId = resolveFirebaseProjectId();
        const storageBucket = resolveFirebaseStorageBucket(projectId);
        if (!serviceAccount) {
            if (!shouldUseApplicationDefaultCredentials()) {
                if (!initWarningShown) {
                    console.warn("[FirebaseAdmin] No Firebase Admin credentials found. Admin SDK disabled.");
                    initWarningShown = true;
                }
            } else {
                try {
                    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"]({
                        credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["credential"].applicationDefault(),
                        projectId,
                        ...storageBucket ? {
                            storageBucket
                        } : {}
                    });
                    isInitialized = true;
                    console.log("[FirebaseAdmin] Initialized with application default credentials");
                } catch  {
                    if (!initWarningShown) {
                        console.warn("[FirebaseAdmin] Could not initialize with application default credentials. Admin SDK disabled.");
                        initWarningShown = true;
                    }
                }
            }
        } else {
            __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["initializeApp"]({
                credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["credential"].cert(serviceAccount),
                projectId: serviceAccount.projectId || projectId,
                ...storageBucket ? {
                    storageBucket
                } : {}
            });
            isInitialized = true;
            console.log("[FirebaseAdmin] Initialized");
        }
    } catch (error) {
        console.error("[FirebaseAdmin] Initialization error:", error);
    }
} else {
    isInitialized = true;
}
const adminDb = isInitialized ? __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["firestore"]() : null;
const adminAuth = isInitialized ? __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["auth"]() : null;
const adminStorage = isInitialized ? __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$firebase$2d$admin$29$__["storage"]() : null;
}),
"[project]/src/app/api/events/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebaseAdmin.ts [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
const ALLOWED_EVENTS = new Set([
    "page_view",
    "view_demo",
    "click_demo_open",
    "click_cta_signup",
    "start_signup",
    "signup_complete",
    "click_whatsapp"
]);
function normalizeText(value, max = 140) {
    return String(value || "").trim().replace(/\s+/g, " ").slice(0, max);
}
async function POST(request) {
    try {
        const body = await request.json();
        const event = normalizeText(body?.event || body?.type || "", 60);
        if (!ALLOWED_EVENTS.has(event)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Evento no permitido"
            }, {
                status: 400
            });
        }
        const payload = {
            event,
            path: normalizeText(body?.path, 160),
            href: normalizeText(body?.href, 260),
            vertical: normalizeText(body?.vertical, 40),
            slug: normalizeText(body?.slug, 80),
            utm_source: normalizeText(body?.utm_source, 80),
            utm_campaign: normalizeText(body?.utm_campaign, 120),
            utm_content: normalizeText(body?.utm_content, 120),
            ts: Number(body?.ts || Date.now()),
            createdAt: Date.now(),
            userAgent: normalizeText(request.headers.get("user-agent"), 220),
            referer: normalizeText(request.headers.get("referer"), 220),
            ip: normalizeText(request.headers.get("x-forwarded-for"), 120) || normalizeText(request.headers.get("x-real-ip"), 120)
        };
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"]) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["adminDb"].collection("growth_events").add(payload);
        } else if ("TURBOPACK compile-time truthy", 1) {
            // eslint-disable-next-line no-console
            console.log("[growth_events:fallback]", payload);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "No se pudo registrar evento",
            details: error?.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6e057f64._.js.map