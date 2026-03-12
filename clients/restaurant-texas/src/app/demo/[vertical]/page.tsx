import type { Metadata } from "next";
import DemoHub from "@/components/demo/DemoHub";
import { getVerticalCopy, normalizeVertical } from "@/lib/vertical";

type VerticalPageProps = {
  params: Promise<{ vertical: string }>;
};

export async function generateMetadata({
  params,
}: VerticalPageProps): Promise<Metadata> {
  const resolved = await params;
  const vertical = normalizeVertical(resolved.vertical);
  const copy = getVerticalCopy(vertical);
  const title = `Demo ${copy.label} | FastPage`;
  const url = `https://www.fastpagepro.com/demo/${vertical}`;

  return {
    title,
    description: copy.subheadline,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: copy.subheadline,
      url,
      type: "website",
    },
  };
}

export default async function DemoByVerticalPage({ params }: VerticalPageProps) {
  const resolved = await params;
  const vertical = normalizeVertical(resolved.vertical);
  return <DemoHub defaultVertical={vertical} />;
}
