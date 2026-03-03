import type { BusinessVertical } from "@/lib/vertical";

export type DemoMode = "demo" | "real";
export type DemoVertical = BusinessVertical;

type DemoBase = {
  mode?: DemoMode;
  vertical: DemoVertical;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  profileImage?: string;
  whatsappNumber: string;
  recommendedBadges?: string[];
};

export type RestaurantMenuItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  featured?: boolean;
  favoriteOfDay?: boolean;
};

export type RestaurantReservationData = {
  title?: string;
  subtitle?: string;
  heroImage?: string;
  slotOptions?: string[];
  minPartySize?: number;
  maxPartySize?: number;
  requiresDeposit?: boolean;
  depositAmount?: string;
  depositInstructions?: string;
  ctaLabel?: string;
  notePlaceholder?: string;
};

export type EcommerceProduct = {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  badge?: "Oferta" | "Nuevo" | "Top";
  bestSeller?: boolean;
};

export type ServiceCard = {
  id: string;
  title: string;
  summary: string;
  cta: string;
};

export type RestaurantMenuData = DemoBase & {
  vertical: "restaurant";
  themeId: string;
  promoStrip: string;
  openHours: string;
  address: string;
  categories: string[];
  items: RestaurantMenuItem[];
  reservation?: RestaurantReservationData;
};

export type EcommerceStoreData = DemoBase & {
  vertical: "ecommerce";
  themeId: string;
  heroKicker: string;
  trustBullets: string[];
  categories: string[];
  products: EcommerceProduct[];
};

export type LandingData = DemoBase & {
  vertical: "services";
  themeId: string;
  heroKicker: string;
  bullets: string[];
  cards: ServiceCard[];
};

export type DemoData = RestaurantMenuData | EcommerceStoreData | LandingData;
