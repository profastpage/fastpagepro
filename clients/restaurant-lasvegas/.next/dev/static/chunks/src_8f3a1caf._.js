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
"[project]/src/hooks/useAuth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const RECORDING_DEMO_TARGET_EMAIL = 'gozustrike@gmail.com';
const PREVIEW_OWNER_STORAGE_KEY = 'fp_preview_owner_email';
const SESSION_STORAGE_KEY = 'fp_session';
const USER_DOC_TIMEOUT_MS = 3500;
const USER_DOC_CACHE_TTL_MS = 2 * 60 * 1000;
const SUBSCRIPTION_SYNC_TTL_MS = 2 * 60 * 1000;
const AUTH_NULL_REDIRECT_DELAY_MS = 1800;
const userDocCache = new Map();
const userDocInflight = new Map();
const subscriptionSyncAt = new Map();
const subscriptionSyncInflight = new Map();
const demoResetInflight = new Set();
function toDemoVersion(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1;
}
function mergeUserStatus(current, status) {
    if (!status) return current;
    if (current.status === status) return current;
    return {
        ...current,
        status
    };
}
async function fetchUserDocWithCache(uid) {
    const now = Date.now();
    const cached = userDocCache.get(uid);
    if (cached && cached.expiresAt > now) {
        return cached.value;
    }
    const inflight = userDocInflight.get(uid);
    if (inflight) return inflight;
    const request = (async ()=>{
        try {
            const fetchDoc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', uid));
            const timeout = new Promise((_, reject)=>setTimeout(()=>reject(new Error('Timeout Firestore')), USER_DOC_TIMEOUT_MS));
            const userDoc = await Promise.race([
                fetchDoc,
                timeout
            ]);
            const raw = userDoc.data?.() || {};
            const payload = {
                status: raw?.status === 'suspended' || raw?.status === 'disabled' || raw?.status === 'active' ? raw.status : 'active',
                isDemo: raw?.isDemo === true,
                resetMode: String(raw?.resetMode || ''),
                demoVersion: Number(raw?.demoVersion || 1)
            };
            userDocCache.set(uid, {
                value: payload,
                expiresAt: now + USER_DOC_CACHE_TTL_MS
            });
            return payload;
        } catch (error) {
            console.warn('Firestore inaccessible or timeout. Using Auth basic data.', error);
            userDocCache.set(uid, {
                value: null,
                expiresAt: now + 30_000
            });
            return null;
        } finally{
            userDocInflight.delete(uid);
        }
    })();
    userDocInflight.set(uid, request);
    return request;
}
async function ensureSubscriptionSessionSynced(firebaseUser) {
    const uid = firebaseUser.uid;
    const now = Date.now();
    const lastSyncAt = subscriptionSyncAt.get(uid) || 0;
    if (now - lastSyncAt < SUBSCRIPTION_SYNC_TTL_MS) return;
    const inflight = subscriptionSyncInflight.get(uid);
    if (inflight) {
        await inflight;
        return;
    }
    const request = (async ()=>{
        try {
            const idToken = await firebaseUser.getIdToken();
            await fetch('/api/subscription/session', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            });
            await fetch('/api/subscription/current', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            }).catch(()=>undefined);
            subscriptionSyncAt.set(uid, Date.now());
        } catch (syncError) {
            console.warn('[useAuth] Could not sync subscription session.', syncError);
        } finally{
            subscriptionSyncInflight.delete(uid);
        }
    })();
    subscriptionSyncInflight.set(uid, request);
    await request;
}
async function maybeResetDemoOnLogin(firebaseUser, userDataFromDb) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!userDataFromDb?.isDemo) return;
    if (String(userDataFromDb.resetMode || '').toLowerCase() !== 'on_login') return;
    const currentVersion = toDemoVersion(userDataFromDb.demoVersion);
    const resetGuardKey = `fp_demo_reset_${firebaseUser.uid}_v${currentVersion}`;
    if (sessionStorage.getItem(resetGuardKey)) return;
    if (demoResetInflight.has(resetGuardKey)) return;
    demoResetInflight.add(resetGuardKey);
    try {
        const idToken = await firebaseUser.getIdToken(true);
        const response = await fetch('/api/demo/reset-own-on-login', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });
        const payload = await response.json().catch(()=>({}));
        sessionStorage.setItem(resetGuardKey, '1');
        const nextVersion = toDemoVersion(payload?.demoVersion || currentVersion);
        sessionStorage.setItem(`fp_demo_reset_${firebaseUser.uid}_v${nextVersion}`, '1');
    } catch (demoResetError) {
        console.warn('[useAuth] Demo login reset failed.', demoResetError);
    } finally{
        demoResetInflight.delete(resetGuardKey);
    }
}
function useAuth(requireAuth = false) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuth.useEffect": ()=>{
            let active = true;
            // 1. First, check localStorage for immediate (but potentially stale) session
            const localSession = localStorage.getItem(SESSION_STORAGE_KEY);
            if (localSession) {
                try {
                    const parsed = JSON.parse(localSession);
                    setUser(parsed);
                } catch (e) {
                    console.error('Error parsing local session', e);
                }
            }
            // 2. Listen to Firebase Auth state changes
            let nullRedirectTimer = null;
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], {
                "useAuth.useEffect.unsubscribe": (firebaseUser)=>{
                    if (!active) return;
                    if (firebaseUser) {
                        if (nullRedirectTimer) {
                            clearTimeout(nullRedirectTimer);
                            nullRedirectTimer = null;
                        }
                        const optimisticUser = {
                            email: firebaseUser.email || '',
                            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
                            uid: firebaseUser.uid,
                            photoURL: firebaseUser.photoURL || undefined,
                            status: 'active'
                        };
                        setUser(optimisticUser);
                        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(optimisticUser));
                        const normalizedEmail = String(optimisticUser.email || '').trim().toLowerCase();
                        if (normalizedEmail === RECORDING_DEMO_TARGET_EMAIL) {
                            localStorage.setItem(PREVIEW_OWNER_STORAGE_KEY, normalizedEmail);
                        } else {
                            localStorage.removeItem(PREVIEW_OWNER_STORAGE_KEY);
                        }
                        setLoading(false);
                        void ({
                            "useAuth.useEffect.unsubscribe": async ()=>{
                                const userDataFromDb = await fetchUserDocWithCache(firebaseUser.uid);
                                if (!active) return;
                                if (userDataFromDb?.status === 'suspended' || userDataFromDb?.status === 'disabled') {
                                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]);
                                    localStorage.removeItem(SESSION_STORAGE_KEY);
                                    setUser(null);
                                    router.push('/auth?error=' + userDataFromDb.status);
                                    return;
                                }
                                const mergedUser = mergeUserStatus(optimisticUser, userDataFromDb?.status);
                                setUser(mergedUser);
                                localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mergedUser));
                                await maybeResetDemoOnLogin(firebaseUser, userDataFromDb);
                                void ensureSubscriptionSessionSynced(firebaseUser);
                            }
                        })["useAuth.useEffect.unsubscribe"]();
                    } else {
                        if (!localStorage.getItem(SESSION_STORAGE_KEY)) {
                            setUser(null);
                            if (requireAuth) {
                                if (nullRedirectTimer) clearTimeout(nullRedirectTimer);
                                nullRedirectTimer = setTimeout({
                                    "useAuth.useEffect.unsubscribe": ()=>{
                                        if (!active) return;
                                        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser) return;
                                        if (localStorage.getItem(SESSION_STORAGE_KEY)) return;
                                        router.push('/auth');
                                    }
                                }["useAuth.useEffect.unsubscribe"], AUTH_NULL_REDIRECT_DELAY_MS);
                            }
                        }
                        setLoading(false);
                    }
                }
            }["useAuth.useEffect.unsubscribe"]);
            return ({
                "useAuth.useEffect": ()=>{
                    active = false;
                    if (nullRedirectTimer) {
                        clearTimeout(nullRedirectTimer);
                    }
                    unsubscribe();
                }
            })["useAuth.useEffect"];
        }
    }["useAuth.useEffect"], [
        requireAuth,
        router
    ]);
    const logout = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]);
            localStorage.removeItem(SESSION_STORAGE_KEY);
            setUser(null);
            router.push('/auth');
        } catch (error) {
            console.error('Error logging out', error);
        }
    };
    return {
        user,
        loading,
        logout
    };
}
_s(useAuth, "J17Kp8z+0ojgAqGoY5o3BCjwWms=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
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
"[project]/src/app/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppEntryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAuth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/vertical.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function AppEntryPage() {
    _s();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AppEntryPage.useEffect": ()=>{
            if (loading) return;
            if (!user) {
                const params = ("TURBOPACK compile-time truthy", 1) ? new URLSearchParams(window.location.search) : "TURBOPACK unreachable";
                const vertical = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeVertical"])(params?.get("vertical"));
                router.replace(`/auth?vertical=${vertical}`);
                return;
            }
            router.replace("/hub");
        }
    }["AppEntryPage.useEffect"], [
        loading,
        router,
        user
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid min-h-screen place-items-center bg-black",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-10 w-10 animate-spin rounded-full border-2 border-amber-300 border-t-transparent"
        }, void 0, false, {
            fileName: "[project]/src/app/app/page.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/app/page.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(AppEntryPage, "Zr2WDa/YWeMetzDhcnOimt0LiKE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AppEntryPage;
var _c;
__turbopack_context__.k.register(_c, "AppEntryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_8f3a1caf._.js.map