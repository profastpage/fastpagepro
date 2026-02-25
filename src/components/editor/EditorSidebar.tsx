"use client";

import { ReactNode, useMemo, useState } from "react";
import { Bot, LayoutPanelTop, Palette, Search, Settings } from "lucide-react";

type EditorSidebarTab = "content" | "design" | "ai" | "seo" | "settings";

interface EditorSidebarProps {
  contentTab?: ReactNode;
  designTab?: ReactNode;
  aiTab?: ReactNode;
  seoTab?: ReactNode;
  settingsTab?: ReactNode;
  defaultTab?: EditorSidebarTab;
  className?: string;
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
  defaultTab = "content",
  className,
}: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<EditorSidebarTab>(defaultTab);

  const content = useMemo(() => {
    if (activeTab === "content") return contentTab;
    if (activeTab === "design") return designTab;
    if (activeTab === "ai") return aiTab;
    if (activeTab === "seo") return seoTab;
    return settingsTab;
  }, [activeTab, aiTab, contentTab, designTab, seoTab, settingsTab]);

  return (
    <aside className={`rounded-2xl border border-white/10 bg-zinc-950/80 ${className || ""}`}>
      <div className="flex items-center gap-1 border-b border-white/10 p-2">
        {(Object.keys(TAB_LABELS) as EditorSidebarTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold transition ${
              activeTab === tab ? "bg-cyan-500 text-black" : "text-zinc-300 hover:bg-white/10"
            }`}
            aria-pressed={activeTab === tab}
          >
            {TAB_ICONS[tab]}
            <span>{TAB_LABELS[tab]}</span>
          </button>
        ))}
      </div>
      <div className="p-3">{content ?? <p className="text-sm text-zinc-400">Sin contenido para esta pestana.</p>}</div>
    </aside>
  );
}
