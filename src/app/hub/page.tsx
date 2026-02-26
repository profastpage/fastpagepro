"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import PlanBadge from "@/components/subscription/PlanBadge";
import SubscriptionExpiryBanner from "@/components/subscription/SubscriptionExpiryBanner";
import {
  Layout,
  Copy,
  BarChart2,
  Settings,
  Link2,
  FolderKanban,
  ArrowRight,
  LogOut,
  LayoutGrid,
  ShieldAlert,
  Store,
  CreditCard,
  Lock,
} from "lucide-react";

export default function HubPage() {
  const { user, loading, logout } = useAuth(true);
  const { summary: subscriptionSummary } = useSubscription(Boolean(user?.uid));
  const planPermissions = usePlanPermissions(Boolean(user?.uid));
  const router = useRouter();
  const { t } = useLanguage();
  const userName = user?.name || "Creador";
  const isAdmin = user?.email === "afiliadosprobusiness@gmail.com";
  const isStarterPlan = planPermissions.canonicalPlan === "starter";

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const basePanels = [
    {
      id: "builder",
      title: t("hub.builder.title"),
      description: t("hub.builder.desc"),
      icon: <Layout className="w-8 h-8 text-gold-500" />,
      action: t("hub.builder.action"),
      href: "/builder",
      gradient: "from-zinc-900 to-zinc-900",
      border: "hover:border-gold-500/50",
    },
    {
      id: "templates",
      title: t("hub.cloner.title"),
      description: t("hub.cloner.desc"),
      icon: <LayoutGrid className="w-8 h-8 text-cyan-400" />,
      action: t("hub.cloner.action"),
      href: "/templates",
      gradient: "from-zinc-900 to-zinc-900",
      border: "hover:border-cyan-500/50",
    },
    {
      id: "cloner",
      title: t("hub.webcloner.title"),
      description: t("hub.webcloner.desc"),
      icon: <Copy className="w-8 h-8 text-cyan-400" />,
      action: t("hub.webcloner.action"),
      href: "/cloner/web",
      gradient: "from-zinc-900 to-zinc-900",
      border: "hover:border-cyan-500/50",
    },
    {
      id: "store",
      title: t("hub.store.title"),
      description: t("hub.store.desc"),
      icon: <Store className="w-8 h-8 text-emerald-400" />,
      action: t("hub.store.action"),
      href: "/store",
      gradient: "from-zinc-900 to-zinc-900",
      border: "hover:border-emerald-500/50",
    },
    {
      id: "linkhub",
      title: t("hub.linkhub.title"),
      description: t("hub.linkhub.desc"),
      icon: <Link2 className="w-8 h-8 text-sky-400" />,
      action: t("hub.linkhub.action"),
      href: "/linkhub",
      gradient: "from-zinc-900 to-zinc-900",
      border: "hover:border-sky-500/50",
    },
    {
      id: "published",
      title: t("hub.published.title"),
      description: t("hub.published.desc"),
      icon: <FolderKanban className="w-8 h-8 text-emerald-300" />,
      action: t("hub.published.action"),
      href: "/published",
      gradient: "from-zinc-900 to-zinc-900",
      border: "hover:border-emerald-400/50",
    },
    {
      id: "metrics",
      title: t("hub.metrics.title"),
      description: t("hub.metrics.desc"),
      icon: <BarChart2 className="w-8 h-8 text-purple-400" />,
      action: t("hub.metrics.action"),
      href: "/metrics",
      gradient: "from-zinc-900 to-zinc-900",
      border: "hover:border-purple-500/50",
    },
    {
      id: "billing",
      title: "Billing",
      description: "Gestiona Starter S/29, Business 14 días gratis y Pro S/99, pagos y renovaciones.",
      icon: <CreditCard className="w-8 h-8 text-emerald-300" />,
      action: "Abrir Facturación",
      href: "/dashboard/billing",
      gradient: "from-zinc-900 to-zinc-900",
      border: "hover:border-emerald-400/50",
    },
    {
      id: "settings",
      title: t("hub.config.title"),
      description: t("hub.config.desc"),
      icon: <Settings className="w-8 h-8 text-amber-400" />,
      action: t("hub.config.action"),
      href: "/settings",
      gradient: "from-zinc-900 to-zinc-900",
      border: "hover:border-amber-500/50",
    },
  ];

  const starterUnlocked = new Set(["linkhub", "published", "billing", "settings"]);
  const starterPriority: Record<string, number> = {
    linkhub: 1,
    published: 2,
    billing: 3,
    settings: 4,
    builder: 10,
    templates: 11,
    cloner: 12,
    store: 13,
    metrics: 14,
  };

  const panels = [...basePanels]
    .map((panel) => ({
      ...panel,
      locked: isStarterPlan && !starterUnlocked.has(panel.id),
    }))
    .sort((a, b) => {
      if (!isStarterPlan) return 0;
      return (starterPriority[a.id] || 99) - (starterPriority[b.id] || 99);
    });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-grow pt-20 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.03),transparent_70%)]" />
          <div className="absolute top-1/4 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-purple-900/5 rounded-full blur-[80px] md:blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-48 md:w-64 h-48 md:h-64 bg-yellow-600/5 rounded-full blur-[60px] md:blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-center gap-6 animate-fade-in">
            {user?.photoURL && (
              <img 
                src={user.photoURL} 
                alt={userName} 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gold-500/30 p-1 shadow-lg shadow-gold-500/10"
              />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">
                {t("hub.welcome")}{" "}
                <span className="text-gold-glow block md:inline">{userName}</span>
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg">
                {t("hub.subtitle")}
              </p>
              <div className="mt-3 inline-flex items-center gap-2">
                <span className="text-xs text-zinc-400">Plan:</span>
                <PlanBadge plan={subscriptionSummary?.plan || "FREE"} />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <SubscriptionExpiryBanner
              visible={Boolean(subscriptionSummary?.expiringSoon)}
              daysRemaining={subscriptionSummary?.daysRemaining || 0}
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {panels.map((panel) => (
              <div
                key={panel.id}
                onClick={() => {
                  if (panel.locked) {
                    const requiredFeature =
                      panel.id === "cloner"
                        ? "clonerAccess"
                        : panel.id === "metrics"
                          ? "insightsAutomation"
                          : "";
                    router.push(
                      requiredFeature
                        ? `/dashboard/billing?requiredFeature=${requiredFeature}`
                        : "/dashboard/billing",
                    );
                    return;
                  }
                  if (panel.href === "/cloner/web" && !planPermissions.canUseCloner) {
                    router.push("/dashboard/billing?requiredFeature=clonerAccess");
                    return;
                  }
                  router.push(panel.href);
                }}
                className={`group relative p-6 md:p-8 rounded-2xl md:rounded-3xl border bg-gradient-to-br ${panel.gradient} cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 overflow-hidden ${
                  panel.locked
                    ? "border-amber-300/35 hover:border-amber-300/55"
                    : `border-white/5 ${panel.border}`
                }`}
              >
                {/* Hover Glow */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    panel.locked
                      ? "bg-amber-300/5 opacity-100"
                      : "bg-white/5 opacity-0 group-hover:opacity-100"
                  }`}
                />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="mb-6">
                    <div className="mb-4 p-3 bg-white/5 rounded-2xl w-fit backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
                      {panel.icon}
                    </div>
                    <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold text-white group-hover:text-gold-gradient transition-colors">
                      <span>{panel.title}</span>
                      {panel.locked ? <Lock className="h-4 w-4 text-amber-300" /> : null}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed">
                      {panel.description}
                    </p>
                  </div>

                  <div className="flex items-center text-sm font-semibold tracking-wide uppercase text-zinc-500 group-hover:text-white transition-colors gap-2">
                    {panel.locked ? "Disponible en Business o Pro" : panel.action}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  {panel.locked ? (
                    <div className="mt-3 rounded-xl border border-amber-300/35 bg-black/70 px-3 py-2 text-xs font-semibold text-amber-100">
                      Actualiza a plan Business o Pro para desbloquear esta funcion.
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Logout Section */}
          <div className="mt-12 flex flex-col md:flex-row justify-center md:justify-start gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 border border-transparent hover:border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              <span>{t("hub.logout")}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => router.push("/admin")}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-amber-500 hover:text-white hover:bg-amber-500/10 transition-all duration-300 border border-amber-500/20"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Panel de Administración</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
