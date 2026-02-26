import { normalizeVertical } from "@/lib/vertical";
import type { DemoData, DemoMode, DemoVertical } from "@/lib/demoTypes";
import burgerLab from "../../data/demos/restaurant/burger-lab.json";
import cevicheHouse from "../../data/demos/restaurant/ceviche-house.json";
import coffeeRoute from "../../data/demos/restaurant/coffee-route.json";
import sushiPrime from "../../data/demos/restaurant/sushi-prime.json";
import couturePlus from "../../data/demos/ecommerce/couture-plus.json";
import fitGear from "../../data/demos/ecommerce/fitgear.json";
import technova from "../../data/demos/ecommerce/technova.json";
import urbanWear from "../../data/demos/ecommerce/urban-wear.json";
import agencyGrowth from "../../data/demos/services/agency-growth.json";
import consultoriaPro from "../../data/demos/services/consultoria-pro.json";
import legalStudio from "../../data/demos/services/legal-studio.json";

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

const MOCK_DEMOS: Record<DemoVertical, Record<string, DemoData>> = {
  restaurant: {
    "burger-lab": burgerLab as DemoData,
    "ceviche-house": cevicheHouse as DemoData,
    "coffee-route": coffeeRoute as DemoData,
    "sushi-prime": sushiPrime as DemoData,
  },
  ecommerce: {
    "couture-plus": couturePlus as DemoData,
    fitgear: fitGear as DemoData,
    technova: technova as DemoData,
    "urban-wear": urbanWear as DemoData,
  },
  services: {
    "agency-growth": agencyGrowth as DemoData,
    "consultoria-pro": consultoriaPro as DemoData,
    "legal-studio": legalStudio as DemoData,
  },
};

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

  const mock = MOCK_DEMOS[vertical]?.[slug] || null;
  if (!mock) return null;
  return { ...mock, mode: "demo" };
}
