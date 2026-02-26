import { promises as fs } from "node:fs";
import path from "node:path";
import { normalizeVertical } from "@/lib/vertical";
import type { DemoData, DemoMode, DemoVertical } from "@/lib/demoTypes";

export type {
  DemoData,
  DemoMode,
  DemoVertical,
  EcommerceProduct,
  EcommerceStoreData,
  LandingData,
  RestaurantMenuData,
  RestaurantMenuItem,
} from "@/lib/demoTypes";
export { DEMO_CATALOG, getDemoCatalog, type DemoCatalogItem } from "@/lib/demoCatalog";

function getDemoFilePath(vertical: DemoVertical, slug: string) {
  return path.join(process.cwd(), "data", "demos", vertical, `${slug}.json`);
}

async function loadMockDemoData(
  vertical: DemoVertical,
  slug: string,
): Promise<DemoData | null> {
  try {
    const filePath = getDemoFilePath(vertical, slug);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as DemoData;
  } catch {
    return null;
  }
}

async function loadRealDemoData(
  vertical: DemoVertical,
  slug: string,
): Promise<DemoData | null> {
  // Future-ready hook for DB-backed client demos.
  void vertical;
  void slug;
  return null;
}

export async function getDemoData(args: {
  vertical: string;
  slug: string;
  mode?: DemoMode;
}): Promise<DemoData | null> {
  const vertical = normalizeVertical(args.vertical);
  const slug = String(args.slug || "").trim().toLowerCase();
  const mode = args.mode === "real" ? "real" : "demo";

  const real = mode === "real" ? await loadRealDemoData(vertical, slug) : null;
  if (real) return { ...real, mode: "real" };

  const mock = await loadMockDemoData(vertical, slug);
  if (!mock) return null;
  return { ...mock, mode: "demo" };
}

