"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type SupportFaq = {
  id: string;
  quickEs: string;
  quickEn: string;
  questionEs: string;
  questionEn: string;
  answerEs: string;
  answerEn: string;
  keywords: string[];
};

const BUSINESS_WHATSAPP = "51919662011";

const SUPPORT_FAQ: SupportFaq[] = [
  {
    id: "plans",
    quickEs: "Planes y pagos",
    quickEn: "Plans and billing",
    questionEs: "Como activo mi plan y empiezo hoy?",
    questionEn: "How do I activate my plan and start today?",
    answerEs:
      "Elige Starter, Business o Pro en Billing, realiza el pago y se activa para publicar y vender.",
    answerEn:
      "Choose Starter, Business, or Pro in Billing, complete payment, and activate to publish and sell.",
    keywords: ["plan", "billing", "pago", "payment", "business", "pro", "starter"],
  },
  {
    id: "speed",
    quickEs: "Lanzamiento rapido",
    quickEn: "Quick launch",
    questionEs: "En cuanto tiempo puedo lanzar mi pagina?",
    questionEn: "How fast can I launch my page?",
    answerEs:
      "Puedes lanzar en minutos usando plantillas o demos y luego personalizar colores, textos e imagenes.",
    answerEn:
      "You can launch in minutes using templates or demos, then customize text, colors, and images.",
    keywords: ["tiempo", "rapido", "lanzar", "launch", "minutes", "minutos"],
  },
  {
    id: "whatsapp",
    quickEs: "Pedidos WhatsApp",
    quickEn: "WhatsApp orders",
    questionEs: "Se integra con pedidos por WhatsApp?",
    questionEn: "Does it integrate with WhatsApp orders?",
    answerEs:
      "Si. Fast Page conecta carta/tienda con flujo de pedido y redireccion directa a WhatsApp del negocio.",
    answerEn:
      "Yes. Fast Page connects menu/store flows with direct order redirection to your business WhatsApp.",
    keywords: ["whatsapp", "pedido", "orders", "chat", "ventas", "sales"],
  },
  {
    id: "domain",
    quickEs: "Dominio propio",
    quickEn: "Custom domain",
    questionEs: "Puedo usar mi dominio propio?",
    questionEn: "Can I use my own domain?",
    answerEs:
      "Si, con planes Business o Pro puedes usar dominio propio y escalar con mas control de marca.",
    answerEn:
      "Yes, with Business or Pro you can use a custom domain and scale with stronger branding control.",
    keywords: ["dominio", "domain", "custom", "marca", "branding"],
  },
];

function normalizeText(input: string) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function shouldRenderGuestSupport(pathname: string) {
  if (!pathname) return false;
  if (pathname === "/" || pathname === "/auth" || pathname === "/signup") return true;
  if (pathname === "/demo" || pathname.startsWith("/demo/")) return true;
  return false;
}

export default function GuestSupportWidget() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [activeFaqId, setActiveFaqId] = useState<string>(SUPPORT_FAQ[0].id);
  const [answer, setAnswer] = useState(isEnglish ? SUPPORT_FAQ[0].answerEn : SUPPORT_FAQ[0].answerEs);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const shouldRender = shouldRenderGuestSupport(pathname || "");

  useEffect(() => {
    setAnswer(isEnglish ? SUPPORT_FAQ[0].answerEn : SUPPORT_FAQ[0].answerEs);
    setActiveFaqId(SUPPORT_FAQ[0].id);
  }, [isEnglish]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const panelTitle = isEnglish ? "Customer Support" : "Atencion al cliente";
  const panelSubtitle = isEnglish
    ? "Questions about fastpagepro.com? We can help now."
    : "Dudas sobre fastpagepro.com? Te ayudamos ahora.";
  const askPlaceholder = isEnglish ? "Type your question..." : "Escribe tu duda...";
  const askButton = isEnglish ? "Answer" : "Responder";
  const chatButton = isEnglish ? "Chat on WhatsApp" : "Ir a WhatsApp";
  const miniLabel = isEnglish ? "Quick help" : "Ayuda rapida";
  const openLabel = isEnglish ? "Open support chat" : "Abrir ayuda al cliente";

  const currentQuestion = useMemo(() => {
    const selected = SUPPORT_FAQ.find((entry) => entry.id === activeFaqId);
    return selected ? (isEnglish ? selected.questionEn : selected.questionEs) : "";
  }, [activeFaqId, isEnglish]);

  const whatsappUrl = useMemo(() => {
    const sourceQuestion = input.trim() || currentQuestion || (isEnglish ? "I have a question about Fast Page." : "Tengo una duda sobre Fast Page.");
    const text = isEnglish
      ? `Hi Fast Page team, I am a new visitor and I need help: ${sourceQuestion}`
      : `Hola equipo Fast Page, soy visitante nuevo y necesito ayuda: ${sourceQuestion}`;
    return `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(text)}`;
  }, [currentQuestion, input, isEnglish]);

  function resolveAnswer(question: string) {
    const normalized = normalizeText(question);
    if (!normalized) {
      const first = SUPPORT_FAQ[0];
      return {
        id: first.id,
        text: isEnglish ? first.answerEn : first.answerEs,
      };
    }
    const match = SUPPORT_FAQ.find((item) =>
      item.keywords.some((keyword) => normalized.includes(normalizeText(keyword))),
    );
    if (!match) {
      return {
        id: "fallback",
        text: isEnglish
          ? "We can solve this quickly. Send us your question on WhatsApp and we will guide you step by step."
          : "Lo resolvemos rapido. Enviamos tu consulta por WhatsApp y te guiamos paso a paso.",
      };
    }
    return {
      id: match.id,
      text: isEnglish ? match.answerEn : match.answerEs,
    };
  }

  function onAsk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = resolveAnswer(input);
    setActiveFaqId(result.id);
    setAnswer(result.text);
  }

  function onPickFaq(faq: SupportFaq) {
    setActiveFaqId(faq.id);
    setInput(isEnglish ? faq.questionEn : faq.questionEs);
    setAnswer(isEnglish ? faq.answerEn : faq.answerEs);
  }

  if (!shouldRender) return null;

  const demoOffsetClass = (() => {
    if (pathname === "/") {
      return "mb-[calc(env(safe-area-inset-bottom)+7rem)] md:mb-0";
    }
    if (pathname === "/demo" || pathname?.startsWith("/demo/")) {
      return "mb-[calc(env(safe-area-inset-bottom)+7rem)] md:mb-[5.5rem]";
    }
    return "mb-0";
  })();

  return (
    <div
      ref={rootRef}
      className={`relative w-14 ${demoOffsetClass}`}
      data-guest-support-widget="true"
    >
      <div
        className={`absolute bottom-[calc(100%+0.55rem)] right-0 w-[92vw] max-w-[380px] transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <section className="overflow-hidden rounded-3xl border border-amber-300/30 bg-[linear-gradient(160deg,rgba(8,10,14,0.98),rgba(6,12,11,0.98))] shadow-[0_18px_45px_rgba(0,0,0,0.55)] max-h-[70vh] flex flex-col">
          <header className="border-b border-amber-300/20 bg-[linear-gradient(135deg,rgba(251,191,36,0.18),rgba(16,185,129,0.16))] px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-amber-200">{miniLabel}</p>
                <h3 className="mt-0.5 text-sm font-black text-white">{panelTitle}</h3>
                <p className="mt-1 text-xs text-zinc-200/85">{panelSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-zinc-200 transition hover:border-amber-300/45 hover:text-amber-100"
                aria-label={isEnglish ? "Close support panel" : "Cerrar panel de ayuda"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="space-y-3 px-4 py-3 overflow-y-auto">
            <div className="grid grid-cols-2 gap-1.5">
              {SUPPORT_FAQ.map((faq) => {
                const active = activeFaqId === faq.id;
                return (
                  <button
                    key={faq.id}
                    type="button"
                    onClick={() => onPickFaq(faq)}
                    className={`min-w-0 rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${
                      active
                        ? "border-emerald-300/60 bg-emerald-400/15 text-emerald-100"
                        : "border-white/15 bg-white/5 text-zinc-200 hover:border-amber-300/50 hover:text-amber-100"
                    }`}
                    title={isEnglish ? faq.questionEn : faq.questionEs}
                  >
                    <span className="block truncate">{isEnglish ? faq.quickEn : faq.quickEs}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
              {answer}
            </div>

            <form onSubmit={onAsk} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={askPlaceholder}
                className="h-10 min-w-0 w-full rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white outline-none transition focus:border-amber-300/50"
              />
              <button
                type="submit"
                className="inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-xl border border-amber-300/45 bg-amber-400/15 px-3 text-xs font-black text-amber-100 transition hover:bg-amber-400/20"
              >
                <Send className="h-3.5 w-3.5" />
                {askButton}
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-300/55 bg-emerald-500/18 px-3 text-xs font-black text-emerald-100 transition hover:bg-emerald-500/26"
              >
                <MessageCircle className="h-4 w-4" />
                {chatButton}
              </a>
              <Link
                href="/auth?tab=register"
                className="inline-flex h-10 items-center rounded-xl border border-white/15 bg-white/5 px-3 text-xs font-bold text-zinc-100 transition hover:border-amber-300/45 hover:text-amber-100"
              >
                {isEnglish ? "Create account" : "Crear cuenta"}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/45 bg-[linear-gradient(150deg,rgba(251,191,36,0.24),rgba(16,185,129,0.26))] text-white shadow-[0_10px_28px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105"
        aria-label={openLabel}
      >
        <span className="absolute inset-0 rounded-2xl border border-emerald-300/30 opacity-75 animate-pulse" />
        <MessageCircle className="relative h-6 w-6 text-emerald-50 drop-shadow-[0_0_10px_rgba(16,185,129,0.45)]" />
        <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-amber-200" />
      </button>
    </div>
  );
}
