import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { DemoCatalogItem } from "@/lib/demoCatalog";
import { getDemoUrl, type DemoType } from "@/lib/demoRouting";

type DemoCardProps = {
  item: DemoCatalogItem;
  onOpen?: (vertical: string, slug: string) => void;
};

export default function DemoCard({ item, onOpen }: DemoCardProps) {
  const demoType: DemoType = item.vertical === "ecommerce" ? "store" : item.vertical;
  const demoUrl = getDemoUrl(demoType, item.slug);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-black/45 transition hover:-translate-y-1 hover:border-amber-300/45">
      <div className="relative h-44 w-full">
        <Image
          src={item.coverImage}
          alt={item.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-3 p-4">
        <span className="inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-2 py-1 text-xs font-bold uppercase tracking-[0.14em] text-amber-200">
          {item.vertical}
        </span>
        <h3 className="text-xl font-black text-white">{item.title}</h3>
        <p className="text-sm text-zinc-300">{item.subtitle}</p>
        <Link
          href={demoUrl}
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent("demo_opened", {
                  detail: { type: demoType, slug: item.slug },
                }),
              );
            }
            onOpen?.(item.vertical, item.slug);
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-amber-300/45 hover:bg-amber-300/10"
        >
          ✨ Abrir demo
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
