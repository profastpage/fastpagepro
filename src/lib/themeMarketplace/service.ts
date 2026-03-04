import type {
  ThemeMarketplaceCatalogOutputDto,
  ThemeMarketplaceOrderDto,
  ThemeMarketplaceOrderStatus,
  ThemeMarketplacePaymentMethod,
  ThemeMarketplaceProvider,
  ThemePackDto,
} from "@/contract/themeMarketplace/dtos";
import { buildThemeMarketplaceUseCases } from "@/context/themeMarketplace/buildThemeMarketplaceUseCases";

export type ThemeMarketplaceOrder = ThemeMarketplaceOrderDto;
export type ThemeMarketplaceCatalogResponse = ThemeMarketplaceCatalogOutputDto;
export type ThemePackDefinition = ThemePackDto;

const themeMarketplaceUseCases = buildThemeMarketplaceUseCases();

export async function getThemeMarketplaceCatalogByUser(
  userId: string,
): Promise<ThemeMarketplaceCatalogResponse> {
  return themeMarketplaceUseCases.getCatalog.execute({ userId });
}

export async function createThemeMarketplaceOrder(input: {
  userId: string;
  packId: string;
  paymentMethod: ThemeMarketplacePaymentMethod;
  provider?: ThemeMarketplaceProvider;
  providerPaymentId?: string;
}): Promise<ThemeMarketplaceOrder> {
  return themeMarketplaceUseCases.createOrder.execute({
    userId: input.userId,
    packId: input.packId,
    paymentMethod: input.paymentMethod,
    provider: input.provider,
    providerPaymentId: input.providerPaymentId,
  });
}

export async function getThemeMarketplaceOrderById(orderId: string): Promise<ThemeMarketplaceOrder | null> {
  return themeMarketplaceUseCases.getOrderById.execute({ orderId });
}

export async function updateThemeMarketplaceOrderProvider(input: {
  orderId: string;
  providerPaymentId: string;
  provider: ThemeMarketplaceProvider;
}): Promise<void> {
  await themeMarketplaceUseCases.updateOrderProvider.execute({
    orderId: input.orderId,
    providerPaymentId: input.providerPaymentId,
    provider: input.provider,
  });
}

export async function markThemeMarketplaceOrderPaid(input: {
  orderId: string;
  providerPaymentId?: string;
}): Promise<ThemeMarketplaceOrder> {
  return themeMarketplaceUseCases.markOrderPaid.execute({
    orderId: input.orderId,
    providerPaymentId: input.providerPaymentId,
  });
}

export type { ThemeMarketplacePaymentMethod, ThemeMarketplaceOrderStatus };
