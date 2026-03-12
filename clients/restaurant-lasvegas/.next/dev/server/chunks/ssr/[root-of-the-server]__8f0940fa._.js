module.exports = [
"[project]/src/components/Footer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/LanguageContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const FOOTER_LINKS = [
    {
        labelKey: "nav.hub",
        fallback: "HUB",
        href: "/hub"
    },
    {
        labelKey: "nav.builder",
        fallback: "BUILDER",
        href: "/builder"
    },
    {
        labelKey: "nav.templates",
        fallback: "TEMPLATES",
        href: "/templates"
    },
    {
        labelKey: "nav.cloner",
        fallback: "CLONER",
        href: "/cloner/web"
    },
    {
        labelKey: "nav.store",
        fallback: "ONLINE STORE",
        href: "/store"
    },
    {
        labelKey: "nav.linkhub",
        fallback: "CARTA DIGITAL",
        href: "/cartadigital"
    },
    {
        labelKey: "nav.pricing",
        fallback: "PRICING",
        href: "/dashboard/billing"
    },
    {
        labelKey: "nav.login",
        fallback: "LOGIN",
        href: "/auth?tab=login"
    }
];
function Footer() {
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    const year = new Date().getFullYear();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "relative mt-10 border-t border-white/10 bg-black/70 backdrop-blur-md",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent"
            }, void 0, false, {
                fileName: "[project]/src/components/Footer.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-5 md:flex-row md:items-center md:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                            className: "h-5 w-5 text-amber-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Footer.tsx",
                                            lineNumber: 30,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Footer.tsx",
                                        lineNumber: 29,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-black uppercase tracking-[0.2em] text-gold-gradient",
                                                children: "Fast Page"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Footer.tsx",
                                                lineNumber: 33,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-zinc-400",
                                                children: t("footer.description")
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Footer.tsx",
                                                lineNumber: 36,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Footer.tsx",
                                        lineNumber: 32,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Footer.tsx",
                                lineNumber: 28,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400",
                                children: FOOTER_LINKS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: "transition-colors hover:text-amber-300",
                                        children: t(item.labelKey) === item.labelKey ? item.fallback : t(item.labelKey)
                                    }, item.href, false, {
                                        fileName: "[project]/src/components/Footer.tsx",
                                        lineNumber: 44,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Footer.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Footer.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 border-t border-white/10 pt-5 text-center text-xs text-zinc-500 md:text-left",
                        children: t("footer.rights").replace("{year}", String(year))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Footer.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Footer.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Footer.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/demoRouting.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDemoUrl",
    ()=>getDemoUrl
]);
function getDemoUrl(type, slug) {
    const safeSlug = String(slug || "").trim().toLowerCase();
    if (!safeSlug) return "/demo";
    switch(type){
        case "restaurant":
            return `/demo/restaurant/${safeSlug}`;
        case "store":
            return `/demo/store/${safeSlug}`;
        case "services":
            return `/demo/services/${safeSlug}`;
        default:
            return "/demo";
    }
}
}),
"[project]/src/components/demo/DemoImage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DemoImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function buildFallbackSvg(label) {
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
function DemoImage({ src, alt, fallbackLabel, onError, ...rest }) {
    const fallbackSrc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>buildFallbackSvg(fallbackLabel || alt || "FastPage"), [
        alt,
        fallbackLabel
    ]);
    const [imageSrc, setImageSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(String(src || "").trim() || fallbackSrc);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const nextSrc = String(src || "").trim();
        setImageSrc(nextSrc || fallbackSrc);
    }, [
        fallbackSrc,
        src
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        ...rest,
        alt: alt,
        src: imageSrc,
        onError: (event)=>{
            if (imageSrc !== fallbackSrc) setImageSrc(fallbackSrc);
            onError?.(event);
        }
    }, void 0, false, {
        fileName: "[project]/src/components/demo/DemoImage.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/demo/DemoCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DemoCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-ssr] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demoRouting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/demoRouting.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$demo$2f$DemoImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/demo/DemoImage.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
function DemoCard({ item, onOpen }) {
    const demoType = item.vertical === "ecommerce" ? "store" : item.vertical;
    const demoUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demoRouting$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDemoUrl"])(demoType, item.slug);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "overflow-hidden rounded-2xl border border-white/10 bg-black/45 transition hover:-translate-y-1 hover:border-amber-300/45",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-44 w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$demo$2f$DemoImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: item.coverImage,
                    alt: item.title,
                    fallbackLabel: item.title,
                    fill: true,
                    unoptimized: true,
                    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
                    className: "object-cover"
                }, void 0, false, {
                    fileName: "[project]/src/components/demo/DemoCard.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/demo/DemoCard.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-2 py-1 text-xs font-bold uppercase tracking-[0.14em] text-amber-200",
                        children: item.vertical
                    }, void 0, false, {
                        fileName: "[project]/src/components/demo/DemoCard.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-black text-white",
                        children: item.title
                    }, void 0, false, {
                        fileName: "[project]/src/components/demo/DemoCard.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-300",
                        children: item.subtitle
                    }, void 0, false, {
                        fileName: "[project]/src/components/demo/DemoCard.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: demoUrl,
                        onClick: ()=>{
                            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                            ;
                            onOpen?.(item.vertical, item.slug);
                        },
                        className: "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-amber-300/45 hover:bg-amber-300/10",
                        children: [
                            "✨ Abrir demo",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/demo/DemoCard.tsx",
                                lineNumber: 50,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/demo/DemoCard.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/demo/DemoCard.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/demo/DemoCard.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/landing/HeroOrbScene.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroOrbScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-5a94e5eb.esm.js [app-ssr] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Float$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@react-three/drei/core/Float.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function OrbSceneContent() {
    const coreRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const speedRingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const webRingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const packetGroupRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const boltRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const packets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                angle: 0.15,
                radius: 2.12,
                y: 0.22,
                size: 0.09
            },
            {
                angle: 1.7,
                radius: 2.02,
                y: -0.34,
                size: 0.08
            },
            {
                angle: 2.8,
                radius: 2.16,
                y: 0.4,
                size: 0.11
            },
            {
                angle: 4.35,
                radius: 2.1,
                y: -0.16,
                size: 0.1
            },
            {
                angle: 5.2,
                radius: 1.96,
                y: 0.28,
                size: 0.07
            }
        ], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$5a94e5eb$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])((state, delta)=>{
        const elapsed = state.clock.getElapsedTime();
        if (coreRef.current) {
            coreRef.current.rotation.y += delta * 0.55;
            coreRef.current.rotation.x = Math.sin(elapsed * 0.85) * 0.1;
            const pulse = 1 + Math.sin(elapsed * 2.2) * 0.04;
            coreRef.current.scale.setScalar(pulse);
        }
        if (speedRingRef.current) {
            speedRingRef.current.rotation.z += delta * 0.85;
            speedRingRef.current.rotation.x = Math.PI / 2.2 + Math.sin(elapsed * 0.5) * 0.06;
        }
        if (webRingRef.current) {
            webRingRef.current.rotation.y -= delta * 0.34;
            webRingRef.current.rotation.x = Math.PI / 2.5 + Math.sin(elapsed * 0.42) * 0.04;
        }
        if (packetGroupRef.current) {
            packetGroupRef.current.rotation.y += delta * 0.6;
            packetGroupRef.current.rotation.z = Math.sin(elapsed * 0.65) * 0.06;
        }
        if (boltRef.current) {
            boltRef.current.rotation.y = Math.sin(elapsed * 0.9) * 0.45;
            boltRef.current.position.y = 0.06 + Math.sin(elapsed * 1.8) * 0.08;
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                intensity: 0.35
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    0,
                    0,
                    3
                ],
                color: "#fbbf24",
                intensity: 14,
                distance: 10
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pointLight", {
                position: [
                    -2.1,
                    1.4,
                    -1
                ],
                color: "#22d3ee",
                intensity: 8,
                distance: 9
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                position: [
                    1.8,
                    2.2,
                    2.2
                ],
                intensity: 1.15,
                color: "#fff4cf"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$drei$2f$core$2f$Float$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float"], {
                speed: 1.05,
                floatIntensity: 0.5,
                rotationIntensity: 0.15,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                    ref: coreRef,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                            args: [
                                0.94,
                                44,
                                44
                            ]
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                            color: "#fde68a",
                            emissive: "#f59e0b",
                            emissiveIntensity: 0.58,
                            metalness: 0.48,
                            roughness: 0.22
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: speedRingRef,
                rotation: [
                    Math.PI / 2.2,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                        args: [
                            1.86,
                            0.082,
                            22,
                            140
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#f59e0b",
                        emissive: "#b45309",
                        emissiveIntensity: 0.4,
                        metalness: 0.85,
                        roughness: 0.2
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: webRingRef,
                rotation: [
                    Math.PI / 2.5,
                    0,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                        args: [
                            2.15,
                            0.025,
                            16,
                            160
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: "#38bdf8",
                        emissive: "#0e7490",
                        emissiveIntensity: 0.44,
                        transparent: true,
                        opacity: 0.8,
                        metalness: 0.5,
                        roughness: 0.28
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: boltRef,
                position: [
                    0.03,
                    0.08,
                    1.18
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0.05,
                            0.45,
                            0
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.26,
                                    0.7,
                                    0.14
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#fde047",
                                emissive: "#f59e0b",
                                emissiveIntensity: 0.62
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            -0.12,
                            0.03,
                            0
                        ],
                        rotation: [
                            0,
                            0,
                            0.44
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.22,
                                    0.62,
                                    0.14
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#facc15",
                                emissive: "#d97706",
                                emissiveIntensity: 0.55
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            0.08,
                            -0.32,
                            0
                        ],
                        rotation: [
                            0,
                            0,
                            -0.3
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                                args: [
                                    0.2,
                                    0.56,
                                    0.14
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: "#fef08a",
                                emissive: "#ca8a04",
                                emissiveIntensity: 0.5
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
                ref: packetGroupRef,
                children: packets.map((packet, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                        position: [
                            Math.cos(packet.angle) * packet.radius,
                            packet.y,
                            Math.sin(packet.angle) * packet.radius
                        ],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                                args: [
                                    packet.size,
                                    16,
                                    16
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                                color: index % 2 === 0 ? "#67e8f9" : "#fde68a",
                                emissive: index % 2 === 0 ? "#155e75" : "#92400e",
                                emissiveIntensity: 0.48,
                                roughness: 0.32,
                                metalness: 0.3
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this)
                        ]
                    }, `${packet.angle}-${packet.radius}-${packet.size}-${index}`, true, {
                        fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function HeroOrbScene() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-[220px] overflow-hidden rounded-2xl border border-amber-300/20 bg-[radial-gradient(circle_at_18%_22%,rgba(251,191,36,0.2),transparent_48%),radial-gradient(circle_at_82%_70%,rgba(34,211,238,0.14),transparent_52%),linear-gradient(150deg,rgba(7,8,10,0.98),rgba(14,16,20,0.9))]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
                dpr: [
                    1,
                    1.4
                ],
                camera: {
                    position: [
                        0,
                        0,
                        5.2
                    ],
                    fov: 38
                },
                gl: {
                    alpha: true,
                    antialias: true,
                    powerPreference: "low-power"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OrbSceneContent, {}, void 0, false, {
                    fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute left-3 top-3 rounded-full border border-amber-300/35 bg-black/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200/95",
                children: "Fast Web Engine"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 via-black/15 to-transparent"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/HeroOrbScene.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/vertical.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const normalized = undefined;
}
function readVerticalFromClient() {
    if ("TURBOPACK compile-time truthy", 1) return FALLBACK_VERTICAL;
    //TURBOPACK unreachable
    ;
    const fromUrl = undefined;
    const cookieMatch = undefined;
}
function readVerticalFromCookieValue(cookieValue) {
    return normalizeVertical(cookieValue || FALLBACK_VERTICAL);
}
}),
"[project]/src/components/demo/VerticalSelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VerticalSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/vertical.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/LanguageContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function VerticalSelector({ value, onChange, className = "" }) {
    const { language } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    const isEn = language === "en";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `grid w-full grid-cols-3 gap-2 ${className}`,
        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUSINESS_VERTICALS"].map((vertical)=>{
            const copy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getVerticalCopy"])(vertical, language);
            const active = vertical === value;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>onChange(vertical),
                "aria-label": `${isEn ? "Select" : "Seleccionar"} ${copy.label}`,
                className: `w-full min-w-0 rounded-full border px-2 py-2 text-[13px] font-semibold leading-none transition sm:px-4 sm:text-sm ${active ? "border-amber-300 bg-amber-300/20 text-amber-100" : "border-white/20 bg-white/5 text-zinc-300 hover:border-amber-300/45 hover:text-white"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex w-full items-center justify-center gap-1 whitespace-nowrap",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: copy.emoji
                        }, void 0, false, {
                            fileName: "[project]/src/components/demo/VerticalSelector.tsx",
                            lineNumber: 38,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: copy.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/demo/VerticalSelector.tsx",
                            lineNumber: 39,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/demo/VerticalSelector.tsx",
                    lineNumber: 37,
                    columnNumber: 13
                }, this)
            }, vertical, false, {
                fileName: "[project]/src/components/demo/VerticalSelector.tsx",
                lineNumber: 26,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/src/components/demo/VerticalSelector.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/pwa/PwaInstallTopBanner.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PwaInstallTopBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.js [app-ssr] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$pwa$2f$IosInstallGuideModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/pwa/IosInstallGuideModal.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const DISMISS_KEY = "fp_install_banner_hidden_until";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 3;
function isStandaloneMode() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
function isIOSDevice() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
function isMobileViewport() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
function PwaInstallTopBanner() {
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInstalling, setIsInstalling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isIos, setIsIos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showIosGuide, setShowIosGuide] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deferredPrompt, setDeferredPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const hiddenUntil = undefined;
        const iOS = undefined;
        const handleBeforeInstall = undefined;
        const handleAppInstalled = undefined;
    }, []);
    const hideForNow = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        setIsVisible(false);
    };
    const handleInstall = async ()=>{
        if (isIos && !deferredPrompt) {
            setShowIosGuide(true);
            return;
        }
        if (!deferredPrompt) {
            const fallbackMessage = "Si no ves el boton de instalacion, abre el menu del navegador y elige Instalar app.";
            window.alert(fallbackMessage);
            return;
        }
        setIsInstalling(true);
        try {
            await deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
            if (result.outcome === "accepted") {
                setIsVisible(false);
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            }
            setDeferredPrompt(null);
        } finally{
            setIsInstalling(false);
        }
    };
    if (!isVisible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "w-full rounded-2xl border border-amber-300/45 bg-[linear-gradient(160deg,rgba(251,191,36,0.2),rgba(23,17,8,0.9)_38%,rgba(8,8,10,0.97))] px-3 py-2.5 shadow-[0_16px_42px_-24px_rgba(251,191,36,0.72)] backdrop-blur-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-300/40 bg-black/65 text-amber-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-black uppercase tracking-[0.16em] text-amber-300",
                                        children: "Aplicacion movil"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                                        lineNumber: 118,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-black leading-tight text-amber-50",
                                        children: "Descargar aplicacion Fast Page"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                                        lineNumber: 121,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: hideForNow,
                                className: "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-zinc-200 transition hover:border-amber-300/45 hover:text-amber-200",
                                "aria-label": "Cerrar aviso de instalacion",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                                    lineNumber: 131,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleInstall,
                            disabled: isInstalling,
                            className: "inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-amber-200 px-3 py-1.5 text-[11px] font-black text-zinc-900 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-65",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this),
                                isInstalling ? "Instalando..." : "Instalar app"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                            lineNumber: 135,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$pwa$2f$IosInstallGuideModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                open: showIosGuide,
                onClose: ()=>setShowIosGuide(false)
            }, void 0, false, {
                fileName: "[project]/src/components/pwa/PwaInstallTopBanner.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/src/lib/firebase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/storage/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/node-esm/index.node.esm.js [app-ssr] (ecmascript)");
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
const app = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApp"])();
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(app);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(app);
const storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$node$2d$esm$2f$index$2e$node$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStorage"])(app);
;
}),
"[project]/src/hooks/useAuth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
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
            const fetchDoc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], 'users', uid));
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
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const currentVersion = undefined;
    const resetGuardKey = undefined;
}
function useAuth(requireAuth = false) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"], (firebaseUser)=>{
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
                void (async ()=>{
                    const userDataFromDb = await fetchUserDocWithCache(firebaseUser.uid);
                    if (!active) return;
                    if (userDataFromDb?.status === 'suspended' || userDataFromDb?.status === 'disabled') {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"]);
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
                })();
            } else {
                if (!localStorage.getItem(SESSION_STORAGE_KEY)) {
                    setUser(null);
                    if (requireAuth) {
                        if (nullRedirectTimer) clearTimeout(nullRedirectTimer);
                        nullRedirectTimer = setTimeout(()=>{
                            if (!active) return;
                            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"].currentUser) return;
                            if (localStorage.getItem(SESSION_STORAGE_KEY)) return;
                            router.push('/auth');
                        }, AUTH_NULL_REDIRECT_DELAY_MS);
                    }
                }
                setLoading(false);
            }
        });
        return ()=>{
            active = false;
            if (nullRedirectTimer) {
                clearTimeout(nullRedirectTimer);
            }
            unsubscribe();
        };
    }, [
        requireAuth,
        router
    ]);
    const logout = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"]);
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
}),
"[project]/src/lib/demoCatalog.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEMO_CATALOG",
    ()=>DEMO_CATALOG,
    "getDemoBySlug",
    ()=>getDemoBySlug,
    "getDemoCatalog",
    ()=>getDemoCatalog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/vertical.ts [app-ssr] (ecmascript)");
;
const DEMO_CATALOG = [
    {
        vertical: "restaurant",
        slug: "sushi-prime",
        title: "Sushi Prime",
        subtitle: "Carta premium con favoritos del dia y pedidos por WhatsApp",
        coverImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "restaurant",
        slug: "burger-lab",
        title: "Burger Lab",
        subtitle: "Combos rapidos y categorias para delivery",
        coverImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "restaurant",
        slug: "coffee-route",
        title: "Coffee Route",
        subtitle: "Menu cafeteria con upsell y recomendados",
        coverImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "restaurant",
        slug: "ceviche-house",
        title: "Ceviche House",
        subtitle: "Carta marina enfocada en pedidos por WhatsApp",
        coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "restaurant",
        slug: "dolce-bella",
        title: "Dolce Bella",
        subtitle: "Postres premium con pedidos y reservas por WhatsApp",
        coverImage: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "restaurant",
        slug: "fuente-soda-flow",
        title: "Naranja Social Cafe",
        subtitle: "Jugos de naranja, brunch y carta de cafeteria",
        coverImage: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "restaurant",
        slug: "pizza-norte",
        title: "Pizza Norte",
        subtitle: "Pizzeria con promos y pedidos rapidos por WhatsApp",
        coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "restaurant",
        slug: "brasa-power",
        title: "Brasa Power",
        subtitle: "Pollo a la brasa con combos y delivery por zonas",
        coverImage: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "ecommerce",
        slug: "urban-wear",
        title: "Urban Wear",
        subtitle: "Catalogo moda con ofertas y carrito instantaneo",
        coverImage: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "ecommerce",
        slug: "technova",
        title: "Technova",
        subtitle: "Tienda tech con badges y checkout WhatsApp",
        coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "ecommerce",
        slug: "couture-plus",
        title: "Couture Plus",
        subtitle: "Accesorios con enfoque de conversion diario",
        coverImage: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "ecommerce",
        slug: "fitgear",
        title: "FitGear",
        subtitle: "Equipos deportivos con confianza y soporte",
        coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "services",
        slug: "consultoria-pro",
        title: "Consultoria Pro",
        subtitle: "Landing de captacion para servicios premium",
        coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "services",
        slug: "legal-studio",
        title: "Legal Studio",
        subtitle: "Landing de autoridad para estudios legales",
        coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1400&auto=format&fit=crop"
    },
    {
        vertical: "services",
        slug: "agency-growth",
        title: "Agency Growth",
        subtitle: "Landing para agencias con funnel de reunion",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop"
    }
];
function getDemoCatalog(vertical) {
    if (!vertical) return DEMO_CATALOG;
    const normalized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeVertical"])(vertical);
    return DEMO_CATALOG.filter((item)=>item.vertical === normalized);
}
function getDemoBySlug(slug) {
    const normalized = String(slug || "").trim().toLowerCase();
    if (!normalized) return null;
    return DEMO_CATALOG.find((item)=>item.slug === normalized) || null;
}
}),
"[project]/src/lib/analytics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getStoredUtmContext",
    ()=>getStoredUtmContext,
    "persistUtmFromUrl",
    ()=>persistUtmFromUrl,
    "trackGrowthEvent",
    ()=>trackGrowthEvent
]);
const UTM_STORAGE_KEY = "fp_utm_context";
const UTM_COOKIE_KEY = "fp_utm_context";
function cleanValue(value, max = 120) {
    return String(value || "").trim().replace(/\s+/g, " ").slice(0, max);
}
function safeWindow() {
    return ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
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
    if ("TURBOPACK compile-time truthy", 1) return {};
    //TURBOPACK unreachable
    ;
    const cookieMatch = undefined;
}
function persistUtmFromUrl(searchParams) {
    const win = safeWindow();
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const params = undefined;
    const next = undefined;
    const encoded = undefined;
}
async function trackGrowthEvent(event, payload = {}) {
    const win = safeWindow();
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const utm = undefined;
    const body = undefined;
    const dataLayerWindow = undefined;
}
}),
"[project]/src/components/landing/LandingHome.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingHome
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-ssr] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-ssr] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$earth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/earth.js [app-ssr] (ecmascript) <export default as Globe2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2d$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MonitorSmartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/monitor-smartphone.js [app-ssr] (ecmascript) <export default as MonitorSmartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/palette.js [app-ssr] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-play.js [app-ssr] (ecmascript) <export default as PlayCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rocket.js [app-ssr] (ecmascript) <export default as Rocket>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-ssr] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/store.js [app-ssr] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/utensils-crossed.js [app-ssr] (ecmascript) <export default as UtensilsCrossed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WandSparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wand-sparkles.js [app-ssr] (ecmascript) <export default as WandSparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$demo$2f$DemoCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/demo/DemoCard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$HeroOrbScene$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/HeroOrbScene.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$demo$2f$VerticalSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/demo/VerticalSelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$pwa$2f$PwaInstallTopBanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/pwa/PwaInstallTopBanner.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/LanguageContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAuth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demoCatalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/demoCatalog.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/vertical.ts [app-ssr] (ecmascript)");
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
;
;
;
;
;
;
;
const MODULES_ES = [
    {
        id: "menu",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__["UtensilsCrossed"],
        title: "Carta Digital",
        line: "Recibe mas pedidos en hora punta desde un solo link.",
        href: "/demo/restaurant/sushi-prime"
    },
    {
        id: "store",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
        title: "Tienda Online",
        line: "Muestra productos y cierra pedidos por WhatsApp sin friccion.",
        href: "/demo/ecommerce/urban-wear"
    },
    {
        id: "builder",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WandSparkles$3e$__["WandSparkles"],
        title: "Constructor",
        line: "Crea paginas que convierten clics en mensajes listos para comprar.",
        href: "/builder"
    },
    {
        id: "templates",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"],
        title: "Plantillas",
        line: "Lanza campanas en horas con copys que ya venden.",
        href: "/demo/services/consultoria-pro"
    },
    {
        id: "cloner",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"],
        title: "Clonador",
        line: "Replica ofertas ganadoras y acelera tus ventas.",
        href: "/cloner/web"
    },
    {
        id: "metrics",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        title: "Metricas PRO",
        line: "Detecta que campana vende mas y escala con datos.",
        href: "/demo/services/pro-metrics"
    }
];
const MODULES_EN = [
    {
        id: "menu",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__["UtensilsCrossed"],
        title: "Digital Menu",
        line: "Get more peak-hour orders from one single link.",
        href: "/demo/restaurant/sushi-prime"
    },
    {
        id: "store",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
        title: "Online Store",
        line: "Show products and close WhatsApp orders friction-free.",
        href: "/demo/ecommerce/urban-wear"
    },
    {
        id: "builder",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wand$2d$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__WandSparkles$3e$__["WandSparkles"],
        title: "Builder",
        line: "Create pages that turn clicks into ready-to-buy chats.",
        href: "/builder"
    },
    {
        id: "templates",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"],
        title: "Templates",
        line: "Launch campaigns in hours with copy that already sells.",
        href: "/demo/services/consultoria-pro"
    },
    {
        id: "cloner",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"],
        title: "Cloner",
        line: "Replicate winning offers and accelerate your sales.",
        href: "/cloner/web"
    },
    {
        id: "metrics",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        title: "Pro Metrics",
        line: "Identify what sells best and scale with data.",
        href: "/demo/services/pro-metrics"
    }
];
const FLOW_STEPS_ES = [
    {
        title: "Visitas",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$earth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe2$3e$__["Globe2"],
        description: "Trae trafico desde anuncios, redes y recomendaciones."
    },
    {
        title: "Landing",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2d$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MonitorSmartphone$3e$__["MonitorSmartphone"],
        description: "Convierte interes en pedidos, reservas o cotizaciones."
    },
    {
        title: "WhatsApp",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"],
        description: "Responde rapido y cierra ventas en la misma conversacion."
    },
    {
        title: "Metricas",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        description: "Mide que fuentes y productos generan mas ingresos."
    },
    {
        title: "Escala",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__["Rocket"],
        description: "Duplica lo que funciona sin perder tiempo ni presupuesto."
    }
];
const FLOW_STEPS_EN = [
    {
        title: "Traffic",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$earth$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe2$3e$__["Globe2"],
        description: "Bring traffic from ads, social channels, and referrals."
    },
    {
        title: "Landing",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2d$smartphone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MonitorSmartphone$3e$__["MonitorSmartphone"],
        description: "Turn interest into orders, bookings, or quotes."
    },
    {
        title: "WhatsApp",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"],
        description: "Reply fast and close sales in the same chat."
    },
    {
        title: "Metrics",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        description: "Measure which sources and products generate more revenue."
    },
    {
        title: "Scale",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__["Rocket"],
        description: "Double down on what works without wasting time or budget."
    }
];
const HERO_METRICS_ES = [
    {
        value: "+120",
        label: "Negocios activos",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"]
    },
    {
        value: "24/7",
        label: "Ventas activas",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"]
    },
    {
        value: "0%",
        label: "Comision por venta",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"]
    }
];
const HERO_METRICS_EN = [
    {
        value: "+120",
        label: "Active businesses",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"]
    },
    {
        value: "24/7",
        label: "Always selling",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"]
    },
    {
        value: "0%",
        label: "Commission per sale",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"]
    }
];
const DEMO_TAB_CONFIG_ES = {
    restaurant: "Carta Digital",
    ecommerce: "Tienda Online",
    services: "Landing"
};
const DEMO_TAB_CONFIG_EN = {
    restaurant: "Digital Menu",
    ecommerce: "Online Store",
    services: "Landing"
};
const FAQS_ES = [
    {
        q: "Necesito programar para usar FastPage?",
        a: "No. Todo es visual y puedes publicar sin escribir codigo."
    },
    {
        q: "Puedo usar mi dominio?",
        a: "Si. Desde Business puedes conectar un dominio comprado por tu negocio."
    },
    {
        q: "Puedo quitar el branding?",
        a: "Si, en plan Pro (y Agency cuando se habilite)."
    },
    {
        q: "Que es un proyecto activo?",
        a: "Todo proyecto publicado desde Constructor, Plantillas, Clonador, Carta Digital o Tienda Online."
    },
    {
        q: "Carta Digital vs Tienda Online?",
        a: "Carta Digital es para restaurantes. Tienda Online es ecommerce multirubro."
    },
    {
        q: "Que mide Metricas PRO?",
        a: "Visitas, conversion, tiempo en pagina, clics, trafico semanal y rendimiento tecnico."
    },
    {
        q: "Que hace la IA?",
        a: "Business: copy basico. Pro: optimizacion avanzada de estructura, copy y conversion."
    },
    {
        q: "Puedo cancelar cuando quiera?",
        a: "Si, puedes cancelar desde billing cuando lo necesites."
    }
];
const FAQS_EN = [
    {
        q: "Do I need coding skills to use FastPage?",
        a: "No. Everything is visual and you can publish without writing code."
    },
    {
        q: "Can I use my own domain?",
        a: "Yes. From Business plan, you can connect a domain bought by your business."
    },
    {
        q: "Can I remove branding?",
        a: "Yes, on Pro plan (and Agency when enabled)."
    },
    {
        q: "What is an active project?",
        a: "Any published project from Builder, Templates, Cloner, Digital Menu, or Online Store."
    },
    {
        q: "Digital Menu vs Online Store?",
        a: "Digital Menu is for restaurants. Online Store is for multi-category ecommerce."
    },
    {
        q: "What does Pro Metrics track?",
        a: "Visits, conversion, time on page, clicks, weekly traffic, and technical performance."
    },
    {
        q: "What does AI do?",
        a: "Business: basic copy help. Pro: advanced optimization for structure, copy, and conversion."
    },
    {
        q: "Can I cancel anytime?",
        a: "Yes, you can cancel from billing whenever you need."
    }
];
const TESTIMONIALS_ES = [
    {
        name: "Mariana Quispe",
        city: "Lima, Peru",
        segment: "Carta Digital",
        quote: "Con la carta digital pasamos de pedidos sueltos a un flujo diario por WhatsApp.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Carlos Gutierrez",
        city: "Arequipa, Peru",
        segment: "Carta Digital",
        quote: "El buscador y categorias hicieron que nuestros clientes pidan mas rapido.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Javier Rojas",
        city: "Trujillo, Peru",
        segment: "Online Store",
        quote: "Con FastPage nuestra tienda online cerro ventas desde el primer fin de semana.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Diana Salazar",
        city: "Cusco, Peru",
        segment: "Landing Servicios",
        quote: "La landing para servicios nos trae leads listos para agendar por WhatsApp.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Fernando Paredes",
        city: "Chiclayo, Peru",
        segment: "Online Store",
        quote: "Mejoramos conversion en trafico frio y subimos el ticket promedio.",
        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Sofia Herrera",
        city: "Piura, Peru",
        segment: "Carta Digital",
        quote: "Los platos destacados elevaron nuestros pedidos en horas punta.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Miguel Campos",
        city: "Bogota, Colombia",
        segment: "Landing Servicios",
        quote: "Pasamos de depender de referidos a captar clientes con anuncios y landing.",
        avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Valentina Castro",
        city: "Medellin, Colombia",
        segment: "Online Store",
        quote: "La tienda quedo lista para campanas y ahora vendemos todos los dias.",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Luis Mendoza",
        city: "Quito, Ecuador",
        segment: "Carta Digital",
        quote: "Reducimos llamadas y centralizamos pedidos desde un solo link.",
        avatar: "https://images.unsplash.com/photo-1542204625-de293a06df33?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Camila Navarro",
        city: "Guayaquil, Ecuador",
        segment: "Landing Servicios",
        quote: "Con IA ajustamos el copy y aumentamos consultas calificadas.",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Andres Molina",
        city: "Santiago, Chile",
        segment: "Online Store",
        quote: "La experiencia mobile nos ayudo a convertir mejor que nuestro sitio anterior.",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Paula Ibanez",
        city: "Valparaiso, Chile",
        segment: "Carta Digital",
        quote: "Nuestros clientes ahora encuentran promociones en segundos.",
        avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Daniela Ponce",
        city: "CDMX, Mexico",
        segment: "Online Store",
        quote: "El checkout por WhatsApp nos simplifico ventas y seguimiento.",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Ricardo Leon",
        city: "Monterrey, Mexico",
        segment: "Landing Servicios",
        quote: "FastPage nos dio una landing de alto impacto sin depender de programadores.",
        avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Gabriela Flores",
        city: "Puebla, Mexico",
        segment: "Carta Digital",
        quote: "La carta digital ordeno nuestra operacion de delivery en un dia.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Jose Zamora",
        city: "Santa Cruz, Bolivia",
        segment: "Online Store",
        quote: "Con temas y ofertas dinamicas aumentamos conversion desde Instagram Ads.",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Lucia Ortega",
        city: "La Paz, Bolivia",
        segment: "Landing Servicios",
        quote: "Pasamos de pocos mensajes a una agenda estable de reuniones semanales.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Diego Ferreyra",
        city: "Buenos Aires, Argentina",
        segment: "Online Store",
        quote: "La estructura del catalogo nos permitio escalar campanas sin friccion.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Natalia Acosta",
        city: "Cordoba, Argentina",
        segment: "Carta Digital",
        quote: "Con chips por categoria los clientes compran mas combinaciones.",
        avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Hector Villanueva",
        city: "Asuncion, Paraguay",
        segment: "Landing Servicios",
        quote: "FastPage nos ayudo a presentar mejor nuestra oferta y cerrar mas rapido.",
        avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=320&auto=format&fit=crop"
    }
];
const TESTIMONIALS_EN = [
    {
        name: "Mariana Quispe",
        city: "Lima, Peru",
        segment: "Digital Menu",
        quote: "With the digital menu, we went from random orders to a daily WhatsApp flow.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Carlos Gutierrez",
        city: "Arequipa, Peru",
        segment: "Digital Menu",
        quote: "Search and categories helped our customers order much faster.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Javier Rojas",
        city: "Trujillo, Peru",
        segment: "Online Store",
        quote: "With FastPage our online store closed sales from the very first weekend.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Diana Salazar",
        city: "Cusco, Peru",
        segment: "Service Landing",
        quote: "Our services landing now brings leads ready to book through WhatsApp.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Fernando Paredes",
        city: "Chiclayo, Peru",
        segment: "Online Store",
        quote: "We improved cold-traffic conversion and increased average ticket size.",
        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Sofia Herrera",
        city: "Piura, Peru",
        segment: "Digital Menu",
        quote: "Featured dishes increased our orders during peak hours.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Miguel Campos",
        city: "Bogota, Colombia",
        segment: "Service Landing",
        quote: "We stopped depending on referrals and started acquiring clients with ads and landing pages.",
        avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Valentina Castro",
        city: "Medellin, Colombia",
        segment: "Online Store",
        quote: "The store was campaign-ready and now we sell every single day.",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Luis Mendoza",
        city: "Quito, Ecuador",
        segment: "Digital Menu",
        quote: "We reduced phone calls and centralized orders from one single link.",
        avatar: "https://images.unsplash.com/photo-1542204625-de293a06df33?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Camila Navarro",
        city: "Guayaquil, Ecuador",
        segment: "Service Landing",
        quote: "With AI copy optimization, we increased qualified inquiries.",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Andres Molina",
        city: "Santiago, Chile",
        segment: "Online Store",
        quote: "The mobile experience converted better than our previous website.",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Paula Ibanez",
        city: "Valparaiso, Chile",
        segment: "Digital Menu",
        quote: "Our customers now find promotions in seconds.",
        avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df2?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Daniela Ponce",
        city: "CDMX, Mexico",
        segment: "Online Store",
        quote: "WhatsApp checkout simplified sales and follow-up.",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Ricardo Leon",
        city: "Monterrey, Mexico",
        segment: "Service Landing",
        quote: "FastPage gave us a high-impact landing without depending on developers.",
        avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Gabriela Flores",
        city: "Puebla, Mexico",
        segment: "Digital Menu",
        quote: "The digital menu organized our delivery operation in one day.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Jose Zamora",
        city: "Santa Cruz, Bolivia",
        segment: "Online Store",
        quote: "With dynamic themes and offers, we increased conversion from Instagram Ads.",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Lucia Ortega",
        city: "La Paz, Bolivia",
        segment: "Service Landing",
        quote: "We went from a few messages to a stable weekly meeting schedule.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Diego Ferreyra",
        city: "Buenos Aires, Argentina",
        segment: "Online Store",
        quote: "The catalog structure let us scale campaigns without friction.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Natalia Acosta",
        city: "Cordoba, Argentina",
        segment: "Digital Menu",
        quote: "With category chips, customers buy more combinations.",
        avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=320&auto=format&fit=crop"
    },
    {
        name: "Hector Villanueva",
        city: "Asuncion, Paraguay",
        segment: "Service Landing",
        quote: "FastPage helped us present our offer better and close faster.",
        avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=320&auto=format&fit=crop"
    }
];
const LIVE_ACTIVITY_FEED_ES = [
    {
        name: "Jorge M.",
        city: "Piura",
        action: "conecto su WhatsApp y activo su Carta Digital",
        minutesAgo: 1
    },
    {
        name: "Valeria R.",
        city: "Lima",
        action: "publico su tienda online y recibio 2 pedidos",
        minutesAgo: 2
    },
    {
        name: "Sushi Prime",
        city: "Arequipa",
        action: "convirtio 5 mensajes en ventas",
        minutesAgo: 3
    },
    {
        name: "Urban Wear",
        city: "Trujillo",
        action: "cerro 3 ventas desde WhatsApp",
        minutesAgo: 4
    },
    {
        name: "Cafe Nativo",
        city: "Cusco",
        action: "activo promociones en Carta Digital",
        minutesAgo: 5
    },
    {
        name: "Luna Store",
        city: "Chiclayo",
        action: "recibio su primer carrito por WhatsApp",
        minutesAgo: 6
    },
    {
        name: "Tacos MX",
        city: "CDMX",
        action: "aumento conversion desde menu digital",
        minutesAgo: 7
    },
    {
        name: "NovaTech",
        city: "Bogota",
        action: "convirtio trafico en 4 consultas por WhatsApp",
        minutesAgo: 8
    },
    {
        name: "Maki House",
        city: "Quito",
        action: "activo botones de pedido directo",
        minutesAgo: 9
    },
    {
        name: "Casa Natura",
        city: "Medellin",
        action: "cerro 6 ventas con Online Store",
        minutesAgo: 10
    },
    {
        name: "Deli Burger",
        city: "Guayaquil",
        action: "publico nueva carta y subio pedidos",
        minutesAgo: 11
    },
    {
        name: "Fit Market",
        city: "Santiago",
        action: "activo checkout por WhatsApp",
        minutesAgo: 12
    },
    {
        name: "Don Anticucho",
        city: "Lima",
        action: "logro 9 pedidos en hora punta",
        minutesAgo: 13
    },
    {
        name: "Trendy Shop",
        city: "Monterrey",
        action: "recibio 5 ventas desde anuncios",
        minutesAgo: 14
    },
    {
        name: "Punto Verde",
        city: "Santa Cruz",
        action: "convirtio visitas en ventas por chat",
        minutesAgo: 15
    },
    {
        name: "Pan & Cafe",
        city: "La Paz",
        action: "activo CTA de pedido por WhatsApp",
        minutesAgo: 16
    },
    {
        name: "Beauty Home",
        city: "Puebla",
        action: "publico catalogo y cerro 3 ventas",
        minutesAgo: 17
    },
    {
        name: "Parrilla 51",
        city: "Buenos Aires",
        action: "aumento reservas desde Carta Digital",
        minutesAgo: 18
    },
    {
        name: "Smart Lab",
        city: "Cordoba",
        action: "convirtio 7 leads en conversaciones",
        minutesAgo: 19
    },
    {
        name: "Moda Street",
        city: "Asuncion",
        action: "activo ofertas y vendio por WhatsApp",
        minutesAgo: 20
    },
    {
        name: "Crustaceo",
        city: "Piura",
        action: "subio el ticket promedio con combos",
        minutesAgo: 21
    },
    {
        name: "Flash Store",
        city: "Lima",
        action: "recibio pago confirmado desde chat",
        minutesAgo: 22
    },
    {
        name: "Sabor Criollo",
        city: "Arequipa",
        action: "reactivo clientes con menu digital",
        minutesAgo: 23
    },
    {
        name: "Electro Home",
        city: "Trujillo",
        action: "convirtio mensajes en ventas del dia",
        minutesAgo: 24
    }
];
const LIVE_ACTIVITY_FEED_EN = [
    {
        name: "Jorge M.",
        city: "Piura",
        action: "connected WhatsApp and activated the digital menu",
        minutesAgo: 1
    },
    {
        name: "Valeria R.",
        city: "Lima",
        action: "published an online store and received 2 orders",
        minutesAgo: 2
    },
    {
        name: "Sushi Prime",
        city: "Arequipa",
        action: "converted 5 chats into sales",
        minutesAgo: 3
    },
    {
        name: "Urban Wear",
        city: "Trujillo",
        action: "closed 3 sales from WhatsApp",
        minutesAgo: 4
    },
    {
        name: "Cafe Nativo",
        city: "Cusco",
        action: "activated promotions on digital menu",
        minutesAgo: 5
    },
    {
        name: "Luna Store",
        city: "Chiclayo",
        action: "received first WhatsApp cart",
        minutesAgo: 6
    },
    {
        name: "Tacos MX",
        city: "CDMX",
        action: "improved conversion from digital menu",
        minutesAgo: 7
    },
    {
        name: "NovaTech",
        city: "Bogota",
        action: "turned traffic into 4 WhatsApp inquiries",
        minutesAgo: 8
    },
    {
        name: "Maki House",
        city: "Quito",
        action: "enabled direct order buttons",
        minutesAgo: 9
    },
    {
        name: "Casa Natura",
        city: "Medellin",
        action: "closed 6 sales with Online Store",
        minutesAgo: 10
    },
    {
        name: "Deli Burger",
        city: "Guayaquil",
        action: "published a new menu and increased orders",
        minutesAgo: 11
    },
    {
        name: "Fit Market",
        city: "Santiago",
        action: "enabled WhatsApp checkout",
        minutesAgo: 12
    },
    {
        name: "Don Anticucho",
        city: "Lima",
        action: "achieved 9 orders in peak hour",
        minutesAgo: 13
    },
    {
        name: "Trendy Shop",
        city: "Monterrey",
        action: "received 5 sales from ads",
        minutesAgo: 14
    },
    {
        name: "Punto Verde",
        city: "Santa Cruz",
        action: "converted visits into chat sales",
        minutesAgo: 15
    },
    {
        name: "Pan & Cafe",
        city: "La Paz",
        action: "enabled WhatsApp order CTA",
        minutesAgo: 16
    },
    {
        name: "Beauty Home",
        city: "Puebla",
        action: "published catalog and closed 3 sales",
        minutesAgo: 17
    },
    {
        name: "Parrilla 51",
        city: "Buenos Aires",
        action: "increased bookings from digital menu",
        minutesAgo: 18
    },
    {
        name: "Smart Lab",
        city: "Cordoba",
        action: "turned 7 leads into conversations",
        minutesAgo: 19
    },
    {
        name: "Moda Street",
        city: "Asuncion",
        action: "activated offers and sold via WhatsApp",
        minutesAgo: 20
    },
    {
        name: "Crustaceo",
        city: "Piura",
        action: "raised average ticket with combo offers",
        minutesAgo: 21
    },
    {
        name: "Flash Store",
        city: "Lima",
        action: "received a confirmed payment from chat",
        minutesAgo: 22
    },
    {
        name: "Sabor Criollo",
        city: "Arequipa",
        action: "reactivated clients with digital menu",
        minutesAgo: 23
    },
    {
        name: "Electro Home",
        city: "Trujillo",
        action: "converted chats into same-day sales",
        minutesAgo: 24
    }
];
const DELUXE_BUTTON_BASE = "inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/45 bg-gradient-to-b from-zinc-900 via-black to-zinc-950 px-5 py-2.5 text-sm font-black text-amber-100 shadow-[inset_0_1px_0_rgba(251,191,36,0.32),0_10px_24px_-16px_rgba(251,191,36,0.55)] transition hover:-translate-y-0.5 hover:border-amber-300/70 hover:text-amber-50 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/55";
const SOFT_BUTTON_BASE = "inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-amber-300/45 hover:bg-amber-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50";
const HERO_STAGGER_VARIANTS = {
    hidden: {
        opacity: 0
    },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.075,
            delayChildren: 0.04
        }
    }
};
const HERO_ITEM_VARIANTS = {
    hidden: {
        opacity: 0,
        y: 18
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45
        }
    }
};
const HERO_CTA_VARIANT_ES = "B";
const HERO_PRIMARY_CTA_LABEL_ES = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "Crea tu negocio digital hoy";
const PRICING_FEATURES_ES = {
    starter: [
        "1 proyecto activo",
        "10 productos por proyecto",
        "🔒 Dominio propio (Business o Pro)",
        "Branding visible",
        "❌ Sin soporte directo",
        "🔒 IA (Business o Pro)"
    ],
    business: [
        "Hasta 5 proyectos activos",
        "50 productos por proyecto",
        "Dominio propio permitido",
        "IA basica",
        "Metricas basicas",
        "📧 Soporte por correo (max. 24h)",
        "🔒 Testimonios, copys PRO y galeria avanzada"
    ],
    pro: [
        "Hasta 20 proyectos activos",
        "Productos ilimitados",
        "Branding removible",
        "IA avanzada",
        "💬 Soporte en vivo por WhatsApp",
        "Metricas PRO + insights",
        "Testimonios reales con transicion por tema",
        "Copys de venta instantaneos por plato/producto",
        "Galeria PRO: hasta 5 fotos por producto",
        "Despacho configurable: delivery/recojo/comer en local"
    ]
};
const PRICING_FEATURES_EN = {
    starter: [
        "1 active project",
        "10 products per project",
        "🔒 Custom domain (Business or Pro)",
        "Visible branding",
        "❌ No direct support",
        "🔒 AI (Business or Pro)"
    ],
    business: [
        "Up to 5 active projects",
        "50 products per project",
        "Custom domain enabled",
        "Basic AI",
        "Basic metrics",
        "📧 Email support (max 24h)",
        "🔒 Testimonials, PRO copy and advanced gallery"
    ],
    pro: [
        "Up to 20 active projects",
        "Unlimited products",
        "Removable branding",
        "Advanced AI",
        "💬 Live WhatsApp support",
        "Pro metrics + insights",
        "Real testimonials with theme transitions",
        "Instant sales copy per dish/product",
        "Pro gallery: up to 5 photos per product",
        "Configurable fulfillment: delivery/pickup/dine-in"
    ]
};
function LandingHome() {
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAuth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { language } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$LanguageContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLanguage"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const isEnglish = language === "en";
    const [vertical, setVertical] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("restaurant");
    const [demoTab, setDemoTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("restaurant");
    const [openFaqIndex, setOpenFaqIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [activityIndex, setActivityIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [desktopTestimonialIndex, setDesktopTestimonialIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [enableHero3D, setEnableHero3D] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const testimonialsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!loading && user) router.replace("/hub");
    }, [
        loading,
        router,
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const urlVertical = undefined;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const desktopMedia = undefined;
        const reducedMotionMedia = undefined;
        const resolve3D = undefined;
        const onMediaChange = undefined;
    }, []);
    const liveActivityFeed = isEnglish ? LIVE_ACTIVITY_FEED_EN : LIVE_ACTIVITY_FEED_ES;
    const testimonials = isEnglish ? TESTIMONIALS_EN : TESTIMONIALS_ES;
    const pricingFeatures = isEnglish ? PRICING_FEATURES_EN : PRICING_FEATURES_ES;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setActivityIndex(0);
    }, [
        isEnglish
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!liveActivityFeed.length) return;
        const intervalId = window.setInterval(()=>{
            setActivityIndex((current)=>(current + 1) % liveActivityFeed.length);
        }, 3800);
        return ()=>window.clearInterval(intervalId);
    }, [
        liveActivityFeed.length
    ]);
    const copy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>isEnglish ? {
            heroTag: "More WhatsApp orders",
            heroTitle: "Turn visits into WhatsApp orders, every day",
            heroDesc: "FastPage helps you sell more with landing, store, and digital menu in one system.",
            heroProof: "+120 businesses already activated their orders and sales flow in FastPage.",
            heroChecklist: [
                "Live in minutes",
                "No commissions per sale",
                "Pay and activate now"
            ],
            ctaPrimary: "Create your digital business today",
            ctaPrimaryHelper: "Plans from 29 soles/month • No commissions",
            ctaDemo: "Watch live demo",
            ctaPlans: "View plans",
            urgency: "This week is key to sell more: activate your version today.",
            chips: [
                "Ready in minutes",
                "WhatsApp orders",
                "No commissions"
            ],
            panelTag: "FastPage System",
            panelDesc: "Pick a demo, adapt it to your business, and start selling today.",
            panelCta: "Open demo and sell",
            systemTitle: "FastPage System",
            systemDesc: "Attract traffic, convert on WhatsApp, and measure sales to scale.",
            allInOneTitle: "All in one",
            allInOneDesc: "Everything you need to attract customers, convert orders, and increase sales.",
            moduleCta: "View module",
            verticalTitle: "Choose your business type",
            verticalCards: [
                "Get more direct WhatsApp orders and spend less time on calls.",
                "Turn traffic into purchases with catalog and chat checkout.",
                "Capture clients ready to schedule and close by WhatsApp."
            ],
            demosTitle: "Demos already selling by business type",
            demosDesc: "Explore ready-to-convert cases to capture clients and close WhatsApp orders.",
            pricingTitle: "Plans to sell and scale 💸",
            starterSubtitle: "Direct monthly payment (no trial) ⚡",
            starterAnnualDiscount: "Up to 10% off annual plan",
            starterCta: "Start now",
            businessBadge: "⭐ Most chosen",
            businessSubtitle: "Create your digital business today with support and key sales tools.",
            businessAnnualDiscount: "Up to 20% off annual plan",
            businessNote: "Immediate activation after payment.",
            businessCta: "Activate Business",
            proSubtitle: "Direct monthly payment to scale seriously (no trial) 🚀",
            proAnnualDiscount: "Up to 30% off annual plan",
            proCta: "Buy now",
            domainLine: "Connect your domain from Business and keep a professional brand.",
            riskFree: "No commissions per order. Cancel anytime.",
            resultsTitle: "Real business outcomes",
            testimonialsLeft: "Scroll testimonials left",
            testimonialsRight: "Scroll testimonials right",
            testimonialBadges: [
                "WhatsApp",
                "Orders",
                "Bookings",
                "Checkout",
                "Metrics",
                "Conversion"
            ],
            faqTitle: "Frequently asked questions",
            finalTitle: "Start today and get more WhatsApp orders",
            finalDesc: "Activate your demo, personalize your business, and publish in minutes.",
            liveActivity: "LIVE ACTIVITY",
            from: "from"
        } : {
            heroTag: "MAS PEDIDOS POR WHATSAPP",
            heroTitle: "Convierte visitas en pedidos por WhatsApp en minutos",
            heroDesc: "Landing, tienda y carta digital conectadas a WhatsApp en un solo sistema.",
            heroProof: "Más de 120 negocios ya reciben pedidos por WhatsApp con FastPage.",
            heroChecklist: [
                "Activo en minutos",
                "Sin comisiones por venta",
                "Pago y activacion inmediata"
            ],
            ctaPrimary: HERO_PRIMARY_CTA_LABEL_ES,
            ctaPrimaryHelper: "Planes desde 29 soles/mes • Sin comisiones",
            ctaDemo: "Ver demo en vivo",
            ctaPlans: "Ver planes",
            urgency: "Actívalo hoy y empieza a recibir pedidos.",
            chips: [
                "Listo en minutos",
                "Pedidos por WhatsApp",
                "Sin comisiones"
            ],
            panelTag: "Sistema FastPage",
            panelDesc: "Elige una demo, adapta tu negocio y empieza a vender hoy.",
            panelCta: "Abrir demo y vender",
            systemTitle: "Sistema FastPage",
            systemDesc: "Atraes visitas, conviertes en WhatsApp y mides ventas para escalar.",
            allInOneTitle: "Todo en uno",
            allInOneDesc: "Todo lo que necesitas para atraer clientes, convertir pedidos y aumentar ventas.",
            moduleCta: "Ver modulo",
            verticalTitle: "Elige tu rubro",
            verticalCards: [
                "Mas pedidos directos por WhatsApp y menos tiempo al telefono.",
                "Convierte trafico en compras con catalogo y cierre en chat.",
                "Capta clientes listos para agendar y cerrar por WhatsApp."
            ],
            demosTitle: "Demos que ya venden por rubro",
            demosDesc: "Explora casos listos para captar clientes y cerrar pedidos por WhatsApp.",
            pricingTitle: "Planes para vender y escalar 💸",
            starterSubtitle: "Pago directo mensual (sin trial) ⚡",
            starterAnnualDiscount: "Hasta 10% de descuento en plan anual",
            starterCta: "Empezar ahora",
            businessBadge: "⭐ Mas elegido",
            businessSubtitle: "Crea tu negocio digital hoy con soporte y herramientas clave para vender.",
            businessAnnualDiscount: "Hasta 20% de descuento en plan anual",
            businessNote: "Activacion inmediata tras pago.",
            businessCta: "Activar Business",
            proSubtitle: "Pago directo mensual para escalar en serio (sin trial) 🚀",
            proAnnualDiscount: "Hasta 30% de descuento en plan anual",
            proCta: "Comprar ahora",
            domainLine: "Conecta tu dominio desde Plan Business y manten una marca profesional.",
            riskFree: "Sin comisiones por pedido. Cancela cuando quieras.",
            resultsTitle: "Resultados de negocios reales",
            testimonialsLeft: "Desplazar testimonios a la izquierda",
            testimonialsRight: "Desplazar testimonios a la derecha",
            testimonialBadges: [
                "WhatsApp",
                "Pedidos",
                "Reservas",
                "Checkout",
                "Metricas",
                "Conversion"
            ],
            faqTitle: "Preguntas frecuentes",
            finalTitle: "Empieza hoy y recibe mas pedidos por WhatsApp",
            finalDesc: "Activa tu demo, personaliza tu negocio y publica en minutos.",
            liveActivity: "ACTIVIDAD EN VIVO",
            from: "de"
        }, [
        isEnglish
    ]);
    const moduleCards = isEnglish ? MODULES_EN : MODULES_ES;
    const flowSteps = isEnglish ? FLOW_STEPS_EN : FLOW_STEPS_ES;
    const heroMetrics = isEnglish ? HERO_METRICS_EN : HERO_METRICS_ES;
    const demoTabConfig = isEnglish ? DEMO_TAB_CONFIG_EN : DEMO_TAB_CONFIG_ES;
    const faqs = isEnglish ? FAQS_EN : FAQS_ES;
    const verticalCopy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getVerticalCopy"])(vertical, language), [
        language,
        vertical
    ]);
    const heroDemoHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["verticalToDemoHref"])(vertical), [
        vertical
    ]);
    const heroSignupHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["verticalToSignupHref"])(vertical)}&plan=BUSINESS`, [
        vertical
    ]);
    const starterSignupHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["verticalToSignupHref"])(vertical)}&plan=FREE`, [
        vertical
    ]);
    const businessSignupHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["verticalToSignupHref"])(vertical)}&plan=BUSINESS`, [
        vertical
    ]);
    const proSignupHref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["verticalToSignupHref"])(vertical)}&plan=PRO`, [
        vertical
    ]);
    const demoItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demoCatalog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDemoCatalog"])(demoTab), [
        demoTab
    ]);
    const safeActivityIndex = liveActivityFeed.length ? activityIndex % liveActivityFeed.length : 0;
    const activeLiveActivity = liveActivityFeed[safeActivityIndex] || liveActivityFeed[0];
    const activityTimeLabel = activeLiveActivity ? isEnglish ? `${activeLiveActivity.minutesAgo} min ago` : `Hace ${activeLiveActivity.minutesAgo} min` : "";
    const desktopTestimonials = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (testimonials.length === 0) return [];
        const visibleCount = Math.min(3, testimonials.length);
        return Array.from({
            length: visibleCount
        }, (_, offset)=>{
            const index = (desktopTestimonialIndex + offset) % testimonials.length;
            return testimonials[index];
        });
    }, [
        desktopTestimonialIndex,
        testimonials
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setDesktopTestimonialIndex(0);
    }, [
        isEnglish,
        testimonials.length
    ]);
    const scrollTestimonials = (direction)=>{
        const isDesktopViewport = ("TURBOPACK compile-time value", "undefined") !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
        if (isDesktopViewport && testimonials.length > 0) //TURBOPACK unreachable
        ;
        const container = testimonialsRef.current;
        if (!container) return;
        const card = container.querySelector("article");
        const step = card ? card.offsetWidth + 16 : 380;
        const offset = direction === "left" ? -step : step;
        container.scrollBy({
            left: offset,
            behavior: "smooth"
        });
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid min-h-screen place-items-center bg-black",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-10 w-10 animate-spin rounded-full border-2 border-amber-300 border-t-transparent"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1011,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingHome.tsx",
            lineNumber: 1010,
            columnNumber: 7
        }, this);
    }
    if (user) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "relative overflow-x-hidden pb-24 md:pb-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_56%)]"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1020,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative z-30 mx-auto w-full max-w-7xl px-3 pt-20 md:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$pwa$2f$PwaInstallTopBanner$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                    lineNumber: 1022,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1021,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative z-10 mx-auto min-h-[calc(100svh-84px)] w-full max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(120deg,rgba(16,16,16,0.95),rgba(10,10,10,0.82)_45%,rgba(17,17,17,0.96))] px-4 pb-12 pt-24 sm:px-6 md:pt-28 lg:px-8 lg:pt-32",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-hidden": true,
                        className: "pointer-events-none absolute inset-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute -left-20 top-10 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl"
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1027,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute right-[-4rem] top-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl"
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1028,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:28px_28px]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1029,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1026,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                variants: HERO_STAGGER_VARIANTS,
                                initial: "hidden",
                                animate: "show",
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                                        variants: HERO_ITEM_VARIANTS,
                                        className: "inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300",
                                        children: copy.heroTag
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1039,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].h1, {
                                        variants: HERO_ITEM_VARIANTS,
                                        className: "text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl",
                                        children: copy.heroTitle
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1045,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                                        variants: HERO_ITEM_VARIANTS,
                                        className: "max-w-2xl text-base text-zinc-300 md:text-lg",
                                        children: copy.heroDesc
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1051,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        variants: HERO_ITEM_VARIANTS,
                                        className: "max-w-2xl space-y-0.5 text-left text-[11px] font-medium leading-[1.3] text-zinc-300 sm:text-xs",
                                        children: copy.heroChecklist.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    "✅ ",
                                                    item
                                                ]
                                            }, item, true, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1059,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1054,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                                        variants: HERO_ITEM_VARIANTS,
                                        className: "max-w-2xl text-xs font-semibold text-amber-200/90",
                                        children: copy.heroProof
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1062,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        variants: HERO_ITEM_VARIANTS,
                                        className: "grid max-w-2xl grid-cols-3 gap-2 sm:gap-3",
                                        children: heroMetrics.map((metric)=>{
                                            const Icon = metric.icon;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-2xl border border-white/12 bg-white/[0.03] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex h-7 w-7 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                            className: "h-3.5 w-3.5 text-amber-300"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                            lineNumber: 1075,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1074,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-2 text-sm font-black text-white sm:text-base",
                                                        children: metric.value
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1077,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[11px] text-zinc-300 sm:text-xs",
                                                        children: metric.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1078,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, metric.label, true, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1070,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1066,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        variants: HERO_ITEM_VARIANTS,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$demo$2f$VerticalSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            value: vertical,
                                            onChange: (nextVertical)=>{
                                                setVertical(nextVertical);
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persistVerticalChoice"])(nextVertical);
                                                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("view_demo", {
                                                    vertical: nextVertical,
                                                    slug: "landing_selector"
                                                });
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1085,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1084,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        variants: HERO_ITEM_VARIANTS,
                                        className: "flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: heroSignupHref,
                                                onClick: ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_cta_signup", {
                                                        vertical,
                                                        location: "hero_primary"
                                                    }),
                                                className: `${DELUXE_BUTTON_BASE} inline-flex w-full justify-center rounded-full px-7 py-3 uppercase tracking-[0.12em] sm:w-auto`,
                                                children: copy.ctaPrimary
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1102,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: heroDemoHref,
                                                onClick: ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_demo_open", {
                                                        vertical,
                                                        slug: "hub",
                                                        location: "hero_secondary"
                                                    }),
                                                className: `${SOFT_BUTTON_BASE} inline-flex w-full justify-center rounded-full px-6 py-3 uppercase tracking-[0.12em] sm:w-auto`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__["PlayCircle"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1125,
                                                        columnNumber: 17
                                                    }, this),
                                                    " ",
                                                    copy.ctaDemo
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1114,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#pricing",
                                                onClick: ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_demo_open", {
                                                        vertical,
                                                        slug: "pricing",
                                                        location: "hero_pricing_link"
                                                    }),
                                                className: "text-sm font-semibold text-amber-300 underline-offset-4 transition hover:text-amber-200 hover:underline",
                                                children: copy.ctaPlans
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1127,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1098,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                                        variants: HERO_ITEM_VARIANTS,
                                        className: "max-w-2xl text-center text-[11px] text-zinc-400/80 sm:text-xs",
                                        children: copy.ctaPrimaryHelper
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1141,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                                        variants: HERO_ITEM_VARIANTS,
                                        className: "text-xs font-semibold text-amber-200/85",
                                        children: copy.urgency
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1144,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        variants: HERO_ITEM_VARIANTS,
                                        className: "flex flex-wrap gap-2",
                                        children: copy.chips.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-zinc-200",
                                                children: item
                                            }, item, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1150,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1148,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1033,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    x: 24,
                                    y: 12
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0,
                                    y: 0
                                },
                                transition: {
                                    duration: 0.55,
                                    ease: "easeOut",
                                    delay: 0.1
                                },
                                className: "relative overflow-hidden rounded-3xl border border-white/10 bg-black/45 p-5 shadow-2xl backdrop-blur-md",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                        "aria-hidden": true,
                                        animate: {
                                            y: [
                                                0,
                                                -4,
                                                0
                                            ]
                                        },
                                        transition: {
                                            duration: 5.5,
                                            repeat: Number.POSITIVE_INFINITY,
                                            ease: "easeInOut"
                                        },
                                        className: "absolute -right-6 -top-6 h-28 w-28 rounded-full border border-amber-300/20 bg-amber-300/10 blur-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1166,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative mb-4 hidden md:block",
                                        children: enableHero3D ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$HeroOrbScene$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1174,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex h-[220px] items-end overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_28%_18%,rgba(251,191,36,0.14),transparent_48%),radial-gradient(circle_at_78%_72%,rgba(34,211,238,0.1),transparent_55%),linear-gradient(165deg,rgba(8,8,8,0.96),rgba(18,18,18,0.88))] p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:24px_24px]"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                    lineNumber: 1177,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "relative text-xs font-bold uppercase tracking-[0.16em] text-amber-200/90",
                                                    children: copy.panelTag
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                    lineNumber: 1178,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1176,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1172,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative mb-4 rounded-2xl border border-white/10 bg-zinc-950/70 p-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] font-black uppercase tracking-[0.16em] text-amber-300",
                                                        children: copy.liveActivity
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1186,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-bold text-emerald-200",
                                                        children: activityTimeLabel || (isEnglish ? "now" : "ahora")
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1187,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1185,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-sm font-semibold text-white",
                                                children: activeLiveActivity ? `${activeLiveActivity.name} ${copy.from} ${activeLiveActivity.city}` : "FastPage"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1191,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-xs text-zinc-300",
                                                children: activeLiveActivity?.action ?? copy.panelDesc
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1194,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1184,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold uppercase tracking-[0.2em] text-amber-300",
                                        children: copy.panelTag
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1199,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "mt-3 text-3xl font-black text-white",
                                        children: verticalCopy.headline
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1200,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-3 text-sm text-zinc-300",
                                        children: copy.panelDesc
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1201,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-5 hidden gap-3 sm:grid sm:grid-cols-2",
                                        children: flowSteps.map((step)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-xl border border-white/10 bg-white/[0.03] p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs font-bold uppercase tracking-[0.14em] text-amber-300",
                                                        children: step.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1207,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-1 text-sm font-semibold text-white",
                                                        children: step.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1208,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, step.title, true, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1206,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: heroDemoHref,
                                        onClick: ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_demo_open", {
                                                vertical,
                                                slug: "hero_panel"
                                            }),
                                        className: `${DELUXE_BUTTON_BASE} mt-5 w-full rounded-xl px-4 py-2.5 text-base`,
                                        children: [
                                            copy.panelCta,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1223,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1212,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1160,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1032,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1025,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "sistema-fastpage",
                className: "relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-7 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl font-black text-white md:text-4xl",
                                children: copy.systemTitle
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1231,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mx-auto mt-3 hidden max-w-3xl text-zinc-300 sm:block",
                                children: copy.systemDesc
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1232,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto mt-3 grid max-w-sm grid-cols-5 gap-2 sm:hidden",
                                children: flowSteps.map((step, index)=>{
                                    const Icon = step.icon;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative flex flex-col items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] font-extrabold uppercase tracking-[0.14em] text-zinc-300",
                                                children: step.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1240,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-300/40 bg-zinc-950 shadow-[inset_0_1px_0_rgba(251,191,36,0.25),0_8px_18px_-14px_rgba(251,191,36,0.55)]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: "h-4 w-4 text-amber-300"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                    lineNumber: 1242,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1241,
                                                columnNumber: 19
                                            }, this),
                                            index < flowSteps.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "absolute -right-2 top-[1.95rem] h-3.5 w-3.5 text-amber-300/80"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1245,
                                                columnNumber: 21
                                            }, this) : null
                                        ]
                                    }, `mobile-step-${step.title}`, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1239,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1235,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1230,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden gap-3 md:grid md:grid-cols-[repeat(9,minmax(0,1fr))] md:items-center",
                        children: flowSteps.map((step, index)=>{
                            const Icon = step.icon;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: index < flowSteps.length - 1 ? "md:col-span-2" : "md:col-span-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                        className: "group rounded-2xl border border-white/10 bg-black/45 p-4 transition hover:-translate-y-1 hover:border-amber-300/45",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex rounded-xl border border-amber-300/35 bg-amber-300/10 p-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    className: "h-5 w-5 text-amber-300 transition group-hover:scale-110"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                    lineNumber: 1259,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1258,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-3 text-base font-black text-white",
                                                children: step.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1261,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 text-xs text-zinc-300",
                                                children: step.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1262,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1257,
                                        columnNumber: 17
                                    }, this),
                                    index < flowSteps.length - 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden items-center justify-center py-2 md:flex",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            className: "h-4 w-4 animate-pulse text-amber-300/80"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1266,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1265,
                                        columnNumber: 19
                                    }, this) : null
                                ]
                            }, step.title, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1256,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1252,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1229,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-7 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl font-black text-white md:text-4xl",
                                children: copy.allInOneTitle
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1277,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mx-auto mt-3 max-w-3xl text-zinc-300",
                                children: copy.allInOneDesc
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1278,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1276,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4",
                        children: moduleCards.map((module)=>{
                            const Icon = module.icon;
                            const isClickableModule = module.id === "menu" || module.id === "store";
                            if (!isClickableModule) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                    className: "flex aspect-square flex-col rounded-2xl border border-white/10 bg-black/40 p-3 md:p-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                className: "h-4 w-4 text-amber-300"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1294,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1293,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-3 text-base font-black text-white md:text-lg",
                                            children: module.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1296,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-xs leading-snug text-zinc-300 md:text-sm",
                                            children: module.line
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1297,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, module.id, true, {
                                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                                    lineNumber: 1289,
                                    columnNumber: 17
                                }, this);
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: module.href,
                                onClick: ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_demo_open", {
                                        vertical,
                                        slug: `module_${module.id}`
                                    }),
                                className: "group flex aspect-square flex-col rounded-2xl border border-white/10 bg-black/40 p-3 transition hover:-translate-y-1 hover:border-amber-300/45 md:p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "h-4 w-4 text-amber-300"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1315,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1314,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-3 text-base font-black text-white md:text-lg",
                                        children: module.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1317,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xs leading-snug text-zinc-300 md:text-sm",
                                        children: module.line
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1318,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-auto inline-flex items-center gap-1 pt-2 text-xs font-bold text-amber-300 md:text-sm",
                                        children: [
                                            copy.moduleCta,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1321,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1319,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, module.id, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1303,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1282,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1275,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-7 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-black text-white md:text-4xl",
                            children: copy.verticalTitle
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                            lineNumber: 1331,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1330,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 md:grid-cols-3",
                        children: [
                            {
                                vertical: "restaurant",
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$utensils$2d$crossed$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UtensilsCrossed$3e$__["UtensilsCrossed"],
                                copy: copy.verticalCards[0]
                            },
                            {
                                vertical: "ecommerce",
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"],
                                copy: copy.verticalCards[1]
                            },
                            {
                                vertical: "services",
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"],
                                copy: copy.verticalCards[2]
                            }
                        ].map((item)=>{
                            const Icon = item.icon;
                            const itemCopy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$vertical$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getVerticalCopy"])(item.vertical);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "rounded-2xl border border-white/10 bg-black/45 p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/35 bg-amber-300/10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "h-4 w-4 text-amber-300"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1356,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1355,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-2xl font-black text-white",
                                        children: itemCopy.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1358,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-sm leading-relaxed text-zinc-300",
                                        children: item.copy
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1359,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-5 flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/demo?vertical=${item.vertical}`,
                                                onClick: ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_demo_open", {
                                                        vertical: item.vertical,
                                                        slug: "rubro_card"
                                                    }),
                                                className: `${SOFT_BUTTON_BASE} rounded-xl px-4 py-2`,
                                                children: copy.ctaDemo
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1361,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/signup?vertical=${item.vertical}`,
                                                onClick: ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_cta_signup", {
                                                        vertical: item.vertical,
                                                        location: "rubro_card"
                                                    }),
                                                className: `${DELUXE_BUTTON_BASE} rounded-xl px-4 py-2`,
                                                children: copy.ctaPrimary
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1371,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1360,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, item.vertical, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1354,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1333,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1329,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "demos",
                className: "relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-7 flex flex-wrap items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-3xl font-black text-white md:text-4xl",
                                        children: copy.demosTitle
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1391,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-zinc-300",
                                        children: copy.demosDesc
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1392,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1390,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: [
                                    "restaurant",
                                    "ecommerce",
                                    "services"
                                ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setDemoTab(tab),
                                        className: `rounded-full border px-4 py-2 text-sm font-bold ${demoTab === tab ? "border-amber-300 bg-amber-300/15 text-amber-100" : "border-white/20 bg-white/5 text-zinc-300"}`,
                                        children: demoTabConfig[tab]
                                    }, tab, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1396,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1394,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1389,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
                        children: demoItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$demo$2f$DemoCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                item: item,
                                onOpen: (selectedVertical, slug)=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_demo_open", {
                                        vertical: selectedVertical,
                                        slug,
                                        location: "landing_cases"
                                    })
                            }, `${item.vertical}-${item.slug}`, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1413,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1411,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1388,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "pricing",
                className: "relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-7 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-black text-white md:text-4xl",
                            children: copy.pricingTitle
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                            lineNumber: 1430,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1429,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-4 lg:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "flex h-full flex-col rounded-3xl border border-white/10 bg-black/45 p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold uppercase tracking-[0.2em] text-zinc-400",
                                        children: "STARTER"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1434,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-4xl font-black text-white",
                                        children: "S/ 29"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1435,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-sm font-semibold text-zinc-200",
                                        children: copy.starterSubtitle
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1436,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 inline-flex w-fit rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-100",
                                        children: copy.starterAnnualDiscount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1437,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "mt-5 space-y-2 text-sm text-zinc-300",
                                        children: pricingFeatures.starter.map((feature)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: feature
                                            }, feature, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1442,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1440,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: starterSignupHref,
                                        className: "mt-auto inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-amber-300/45 hover:bg-amber-300/10",
                                        children: copy.starterCta
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1445,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1433,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "relative flex h-full flex-col rounded-3xl border border-amber-300/45 bg-gradient-to-b from-amber-300/10 to-black/60 p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute -top-3 right-4 rounded-full border border-amber-300/45 bg-black px-3 py-1 text-xs font-bold text-amber-200",
                                        children: copy.businessBadge
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1451,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold uppercase tracking-[0.2em] text-amber-300",
                                        children: "BUSINESS"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1452,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-4xl font-black text-white",
                                        children: "S/ 59"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1453,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-sm font-semibold text-amber-100",
                                        children: copy.businessSubtitle
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1454,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 inline-flex w-fit rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-100",
                                        children: copy.businessAnnualDiscount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1457,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xs font-semibold text-amber-100/90",
                                        children: copy.businessNote
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1460,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "mt-5 space-y-2 text-sm text-zinc-200",
                                        children: pricingFeatures.business.map((feature)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: feature
                                            }, feature, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1463,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1461,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: businessSignupHref,
                                        className: "mt-auto inline-flex w-full items-center justify-center rounded-xl border border-amber-300/45 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-100 transition hover:bg-amber-300/20",
                                        children: copy.businessCta
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1466,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1450,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "flex h-full flex-col rounded-3xl border border-cyan-300/35 bg-gradient-to-b from-cyan-300/10 to-black/60 p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold uppercase tracking-[0.2em] text-cyan-200",
                                        children: "PRO"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1472,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-4xl font-black text-white",
                                        children: "S/ 99"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1473,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-sm font-semibold text-cyan-100",
                                        children: copy.proSubtitle
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1474,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 inline-flex w-fit rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-100",
                                        children: copy.proAnnualDiscount
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1475,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "mt-5 space-y-2 text-sm text-zinc-200",
                                        children: pricingFeatures.pro.map((feature)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: feature
                                            }, feature, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1480,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1478,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: proSignupHref,
                                        className: "mt-auto inline-flex w-full items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20",
                                        children: copy.proCta
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1483,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1471,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1432,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100",
                        children: copy.domainLine
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1488,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-center text-xs font-semibold text-zinc-300",
                        children: copy.riskFree
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1491,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1428,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative z-10 mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-7 flex items-center justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-3xl font-black text-white md:text-4xl",
                                children: copy.resultsTitle
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1498,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden items-center gap-2 md:flex",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        "aria-label": copy.testimonialsLeft,
                                        onClick: ()=>scrollTestimonials("left"),
                                        className: "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-amber-300/45 hover:text-amber-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1506,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1500,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        "aria-label": copy.testimonialsRight,
                                        onClick: ()=>scrollTestimonials("right"),
                                        className: "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white transition hover:border-amber-300/45 hover:text-amber-200",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1514,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1508,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1499,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1497,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden grid-cols-3 gap-4 md:grid",
                        children: desktopTestimonials.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "min-h-[250px] rounded-2xl border border-white/10 bg-black/45 p-5 transition-all duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative h-12 w-12 overflow-hidden rounded-full border border-amber-300/30",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: item.avatar,
                                                    alt: item.name,
                                                    fill: true,
                                                    unoptimized: true,
                                                    sizes: "48px",
                                                    className: "object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                    lineNumber: 1526,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1525,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-sm font-black text-white",
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1536,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-[11px] uppercase tracking-[0.14em] text-zinc-400",
                                                        children: item.city
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1537,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1535,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1524,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-sm leading-relaxed text-zinc-200",
                                        children: [
                                            '"',
                                            item.quote,
                                            '"'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1540,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-xs uppercase tracking-[0.16em] text-amber-300",
                                        children: item.segment
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1541,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 flex gap-1 text-amber-300",
                                        children: Array.from({
                                            length: 5
                                        }).map((_, sparkIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                className: "h-4 w-4"
                                            }, `${item.name}-desktop-${sparkIndex}`, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1544,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1542,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, `${item.name}-${item.city}-desktop-${desktopTestimonialIndex}-${index}`, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1520,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1518,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: testimonialsRef,
                        className: "no-scrollbar w-full max-w-full flex gap-4 overflow-x-auto px-2 pb-2 snap-x snap-mandatory [direction:rtl] md:hidden",
                        children: testimonials.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "snap-start [direction:ltr] aspect-square w-[82vw] max-w-[360px] shrink-0 rounded-2xl border border-white/10 bg-black/45 p-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative h-12 w-12 overflow-hidden rounded-full border border-amber-300/30",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: item.avatar,
                                                    alt: item.name,
                                                    fill: true,
                                                    unoptimized: true,
                                                    sizes: "48px",
                                                    className: "object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                    lineNumber: 1561,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1560,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-sm font-black text-white",
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1571,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-[11px] uppercase tracking-[0.14em] text-zinc-400",
                                                        children: item.city
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                        lineNumber: 1572,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1570,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1559,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-sm leading-relaxed text-zinc-200",
                                        children: [
                                            '"',
                                            item.quote,
                                            '"'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1575,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-4 text-xs uppercase tracking-[0.16em] text-amber-300",
                                        children: item.segment
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1576,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 flex gap-1 text-amber-300",
                                        children: Array.from({
                                            length: 5
                                        }).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                className: "h-4 w-4"
                                            }, `${item.name}-${index}`, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1579,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1577,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, `${item.name}-${item.city}`, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1555,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1550,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 flex flex-wrap justify-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-300",
                        children: copy.testimonialBadges.map((badge)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full border border-white/15 bg-white/[0.04] px-3 py-1",
                                children: badge
                            }, badge, false, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1587,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1585,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1496,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "faq",
                className: "relative z-10 mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-7 text-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-3xl font-black text-white md:text-4xl",
                            children: copy.faqTitle
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                            lineNumber: 1596,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1595,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: faqs.map((item, index)=>{
                            const isOpen = openFaqIndex === index;
                            const panelId = `faq-panel-${index}`;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "overflow-hidden rounded-2xl border border-white/10 bg-black/45 transition-all duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        "aria-expanded": isOpen,
                                        "aria-controls": panelId,
                                        onClick: ()=>setOpenFaqIndex((current)=>current === index ? -1 : index),
                                        className: "flex w-full items-center justify-between gap-4 p-5 text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-bold text-white md:text-base",
                                                children: item.q
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1616,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: `h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-90 text-amber-300" : ""}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1617,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1607,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: panelId,
                                        className: `grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "overflow-hidden",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `border-t border-white/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-zinc-300 transition-all duration-300 ${isOpen ? "translate-y-0" : "-translate-y-1"}`,
                                                children: item.a
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1630,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                                            lineNumber: 1629,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1623,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, item.q, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1603,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1598,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1594,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-3xl border border-amber-300/35 bg-gradient-to-r from-amber-300/15 via-black/70 to-cyan-300/10 p-8 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-3xl font-black text-white md:text-4xl",
                            children: copy.finalTitle
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                            lineNumber: 1647,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mx-auto mt-3 max-w-3xl text-zinc-200",
                            children: copy.finalDesc
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                            lineNumber: 1648,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 flex flex-wrap items-center justify-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: heroSignupHref,
                                    onClick: ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_cta_signup", {
                                            vertical,
                                            location: "final_cta"
                                        }),
                                    className: `${DELUXE_BUTTON_BASE} rounded-full px-6 py-3 uppercase tracking-[0.12em]`,
                                    children: copy.ctaPrimary
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                                    lineNumber: 1652,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: heroDemoHref,
                                    onClick: ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_demo_open", {
                                            vertical,
                                            slug: "final"
                                        }),
                                    className: `${SOFT_BUTTON_BASE} rounded-full px-6 py-3 uppercase tracking-[0.12em]`,
                                    children: copy.ctaDemo
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                                    lineNumber: 1662,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                            lineNumber: 1651,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                    lineNumber: 1646,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1645,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none fixed bottom-6 left-6 z-40 hidden w-[min(360px,calc(100vw-3rem))] max-w-full lg:block",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "rounded-2xl border border-amber-300/35 bg-[linear-gradient(145deg,rgba(8,8,10,0.96),rgba(22,16,6,0.96))] p-3 shadow-[0_18px_45px_-24px_rgba(251,191,36,0.65)] backdrop-blur-md",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-300/30 bg-black/70 text-amber-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1680,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                        className: "h-6 w-6"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1681,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1679,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] font-black uppercase tracking-[0.18em] text-amber-300",
                                                children: copy.liveActivity
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1685,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] font-semibold text-zinc-400",
                                                children: activityTimeLabel
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1688,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1684,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 truncate text-[1.05rem] font-black text-white",
                                        children: [
                                            activeLiveActivity.name,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "pl-1 text-sm font-semibold text-zinc-300",
                                                children: [
                                                    copy.from,
                                                    " ",
                                                    activeLiveActivity.city
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1692,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1690,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 flex items-center gap-1.5 text-sm font-bold leading-snug text-zinc-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: activeLiveActivity.action
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1695,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "h-4 w-4 shrink-0 text-emerald-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                                lineNumber: 1696,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                                        lineNumber: 1694,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingHome.tsx",
                                lineNumber: 1683,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LandingHome.tsx",
                        lineNumber: 1678,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                    lineNumber: 1677,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1676,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-x-0 bottom-3 z-40 px-3 md:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: heroSignupHref,
                    onClick: ()=>void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackGrowthEvent"])("click_cta_signup", {
                            vertical,
                            location: "mobile_sticky"
                        }),
                    className: `${DELUXE_BUTTON_BASE} w-full rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-md`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__["Rocket"], {
                            className: "h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingHome.tsx",
                            lineNumber: 1714,
                            columnNumber: 11
                        }, this),
                        copy.ctaPrimary
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/LandingHome.tsx",
                    lineNumber: 1704,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1703,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/components/landing/LandingHome.tsx",
                lineNumber: 1719,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/LandingHome.tsx",
        lineNumber: 1019,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/landing/LandingHomeEntry.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingHomeEntry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$LandingHome$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/LandingHome.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function isStandaloneMode() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
function LandingHomeEntry() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [canRenderLanding, setCanRenderLanding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isStandaloneMode()) {
            setCanRenderLanding(true);
            return;
        }
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"], (user)=>{
            router.replace(user ? "/hub" : "/auth");
        });
        return ()=>unsubscribe();
    }, [
        router
    ]);
    if (!canRenderLanding) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-black"
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingHomeEntry.tsx",
            lineNumber: 34,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$LandingHome$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/src/components/landing/LandingHomeEntry.tsx",
        lineNumber: 37,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8f0940fa._.js.map