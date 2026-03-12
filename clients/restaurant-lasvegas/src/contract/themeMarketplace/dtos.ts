export type ThemePackVertical = "restaurant" | "ecommerce" | "services";

export type ThemeMarketplacePaymentMethod = "YAPE" | "PLIN" | "TRANSFERENCIA" | "IZIPAY";
export type ThemeMarketplaceOrderStatus = "PENDING" | "PAID" | "CANCELLED";
export type ThemeMarketplaceProvider = "MANUAL" | "IZIPAY";
export type ThemeMarketplaceCheckoutMode = "mock" | "live";

export interface ThemePackDto {
  id: string;
  name: string;
  vertical: ThemePackVertical;
  description: string;
  includedThemes: string[];
  priceSoles: number;
  badge: string;
}

export interface ThemeMarketplaceOrderDto {
  id: string;
  userId: string;
  packId: string;
  packName: string;
  status: ThemeMarketplaceOrderStatus;
  paymentMethod: ThemeMarketplacePaymentMethod;
  amountSoles: number;
  provider: ThemeMarketplaceProvider;
  providerPaymentId: string;
  createdAt: number;
  updatedAt: number;
  paidAt?: number;
}

export interface ThemeMarketplaceCatalogInputDto {
  userId: string;
}

export interface ThemeMarketplaceCatalogOutputDto {
  packs: ThemePackDto[];
  ownedPackIds: string[];
  pendingOrders: ThemeMarketplaceOrderDto[];
}

export interface CreateThemeMarketplaceOrderInputDto {
  userId: string;
  packId: string;
  paymentMethod: ThemeMarketplacePaymentMethod;
  provider?: ThemeMarketplaceProvider;
  providerPaymentId?: string;
}

export interface GetThemeMarketplaceOrderInputDto {
  orderId: string;
}

export interface UpdateThemeMarketplaceOrderProviderInputDto {
  orderId: string;
  providerPaymentId: string;
  provider: ThemeMarketplaceProvider;
}

export interface MarkThemeMarketplaceOrderPaidInputDto {
  orderId: string;
  providerPaymentId?: string;
}

export interface ExecuteThemeMarketplacePurchaseInputDto {
  userId: string;
  userEmail: string;
  packId: string;
  paymentMethod?: unknown;
  origin: string;
}

export interface ExecuteThemeMarketplacePurchaseOutputDto {
  success: true;
  paymentFlow: "MANUAL" | "IZIPAY";
  order?: ThemeMarketplaceOrderDto;
  orderId?: string;
  checkoutUrl?: string;
  mode?: ThemeMarketplaceCheckoutMode;
}

export interface ConfirmThemeMarketplacePurchaseInputDto {
  userId: string;
  orderId: string;
}

export interface ConfirmThemeMarketplacePurchaseOutputDto {
  success: true;
  paid: boolean;
  alreadyPaid?: boolean;
  status?: string;
  order?: ThemeMarketplaceOrderDto;
}
