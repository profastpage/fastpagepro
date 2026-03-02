"use client";

import { ReactNode, useMemo, useState } from "react";
import { Bot, LayoutPanelTop, Palette, Search, Settings } from "lucide-react";

export type EditorSidebarTab = "content" | "design" | "ai" | "seo" | "settings";

interface EditorSidebarProps {
  contentTab?: ReactNode;
  designTab?: ReactNode;
  aiTab?: ReactNode;
  seoTab?: ReactNode;
  settingsTab?: ReactNode;
  activeTab?: EditorSidebarTab;
  onTabChange?: (tab: EditorSidebarTab) => void;
  defaultTab?: EditorSidebarTab;
  className?: string;
  hideTabBar?: boolean;
}

const TAB_LABELS: Record<EditorSidebarTab, string> = {
  content: "Contenido",
  design: "Diseno",
  ai: "IA",
  seo: "SEO",
  settings: "Ajustes",
};

const TAB_ICONS: Record<EditorSidebarTab, ReactNode> = {
  content: <LayoutPanelTop className="h-4 w-4" />,
  design: <Palette className="h-4 w-4" />,
  ai: <Bot className="h-4 w-4" />,
  seo: <Search className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
};

export default function EditorSidebar({
  contentTab,
  designTab,
  aiTab,
  seoTab,
  settingsTab,
  activeTab,
  onTabChange,
  defaultTab = "content",
  className,
  hideTabBar = false,
}: EditorSidebarProps) {
  const [internalTab, setInternalTab] = useState<EditorSidebarTab>(defaultTab);
  const resolvedActiveTab = activeTab || internalTab;

  const content = useMemo(() => {
    if (resolvedActiveTab === "content") return contentTab;
    if (resolvedActiveTab === "design") return designTab;
    if (resolvedActiveTab === "ai") return aiTab;
    if (resolvedActiveTab === "seo") return seoTab;
    return settingsTab;
  }, [resolvedActiveTab, aiTab, contentTab, designTab, seoTab, settingsTab]);

  const handleTabChange = (tab: EditorSidebarTab) => {
    if (onTabChange) {
      onTabChange(tab);
      return;
    }
    setInternalTab(tab);
  };

  return (
    <aside className={`rounded-2xl border border-white/10 bg-zinc-950/80 ${className || ""}`}>
      {!hideTabBar ? (
        <div className="flex flex-wrap items-center gap-1 border-b border-white/10 p-2">
          {(Object.keys(TAB_LABELS) as EditorSidebarTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition sm:flex-none sm:justify-start sm:px-2.5 ${
                resolvedActiveTab === tab ? "bg-cyan-500 text-black" : "text-zinc-300 hover:bg-white/10"
              }`}
              aria-pressed={resolvedActiveTab === tab}
            >
              {TAB_ICONS[tab]}
              <span className="truncate">{TAB_LABELS[tab]}</span>
            </button>
          ))}
        </div>
      ) : null}
      <div className="p-3">{content ?? <p className="text-sm text-zinc-400">Sin contenido para esta pestana.</p>}</div>
    </aside>
  );
}
