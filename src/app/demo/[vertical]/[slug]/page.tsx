import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DemoExperience from "@/components/demo/DemoExperience";
import { getDemoData } from "@/lib/demoData";
import { normalizeVertical } from "@/lib/vertical";

type DemoSlugPageProps = {
  params: Promise<{ vertical: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: DemoSlugPageProps): Promise<Metadata> {
  const [{ vertical, slug }, query] = await Promise.all([params, searchParams]);
  const mode = String(query?.mode || "demo").toLowerCase() === "real" ? "real" : "demo";
  const demo = await getDemoData({
    vertical,
    slug,
    mode,
  });
  if (!demo) {
    return {
      title: "Demo no encontrada | FastPage",
    };
  }

  const normalizedVertical = normalizeVertical(vertical);
  const url = `https://www.fastpagepro.com/demo/${normalizedVertical}/${demo.slug}`;
  return {
    title: `${demo.title} | Demo FastPage`,
    description: demo.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${demo.title} | FastPage`,
      description: demo.subtitle,
      url,
      images: [{ url: demo.coverImage }],
      type: "website",
    },
  };
}

export default async function DemoSlugPage({
  params,
  searchParams,
}: DemoSlugPageProps) {
  const [{ vertical, slug }, query] = await Promise.all([params, searchParams]);
  const mode = String(query?.mode || "demo").toLowerCase() === "real" ? "real" : "demo";
  const demo = await getDemoData({
    vertical,
    slug,
    mode,
  });

  if (!demo) notFound();
  return <DemoExperience demo={demo} />;
}
