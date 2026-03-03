"use client";

import type { CSSProperties } from "react";
import {
  Facebook,
  Globe,
  Instagram,
  MessageCircle,
  Music2,
  Youtube,
} from "lucide-react";
import type { DemoSocialLink, DemoSocialPlatform } from "@/lib/demoTypes";

type DemoSocialLinksProps = {
  links: DemoSocialLink[];
  onOpen?: (platform: DemoSocialPlatform, url: string) => void;
  className?: string;
};

const PLATFORM_UI: Record<
  DemoSocialPlatform,
  {
    label: string;
    icon: typeof Instagram;
    style: CSSProperties;
  }
> = {
  instagram: {
    label: "Instagram",
    icon: Instagram,
    style: {
      color: "#e1306c",
      borderColor: "rgba(225,48,108,0.32)",
      background: "rgba(225,48,108,0.14)",
    },
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    style: {
      color: "#1877f2",
      borderColor: "rgba(24,119,242,0.32)",
      background: "rgba(24,119,242,0.14)",
    },
  },
  tiktok: {
    label: "TikTok",
    icon: Music2,
    style: {
      color: "#f8fafc",
      borderColor: "rgba(148,163,184,0.32)",
      background: "rgba(15,23,42,0.8)",
    },
  },
  youtube: {
    label: "YouTube",
    icon: Youtube,
    style: {
      color: "#ff0000",
      borderColor: "rgba(239,68,68,0.32)",
      background: "rgba(239,68,68,0.14)",
    },
  },
  website: {
    label: "Sitio web",
    icon: Globe,
    style: {
      color: "#0ea5e9",
      borderColor: "rgba(14,165,233,0.32)",
      background: "rgba(14,165,233,0.14)",
    },
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageCircle,
    style: {
      color: "#16a34a",
      borderColor: "rgba(22,163,74,0.32)",
      background: "rgba(22,163,74,0.14)",
    },
  },
};

export default function DemoSocialLinks({
  links,
  onOpen,
  className = "",
}: DemoSocialLinksProps) {
  if (!links.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      {links.map((link) => {
        const platformUi = PLATFORM_UI[link.platform];
        if (!platformUi) return null;
        const Icon = platformUi.icon;
        return (
          <a
            key={`${link.platform}-${link.url}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onOpen?.(link.platform, link.url)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]"
            aria-label={link.label || platformUi.label}
            title={link.label || platformUi.label}
            style={platformUi.style}
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
