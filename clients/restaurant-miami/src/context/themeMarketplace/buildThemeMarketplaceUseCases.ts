import type { ThemeMarketplaceUseCases } from "@/contract/themeMarketplace/useCases";
import {
  ConfirmThemeMarketplacePurchaseCoreUseCase,
  CreateThemeMarketplaceOrderCoreUseCase,
  ExecuteThemeMarketplacePurchaseCoreUseCase,
  GetThemeMarketplaceOrderCoreUseCase,
  MarkThemeMarketplaceOrderPaidCoreUseCase,
  ThemeMarketplaceCatalogCoreUseCase,
  UpdateThemeMarketplaceOrderProviderCoreUseCase,
} from "@/core/themeMarketplace/themeMarketplaceUseCases";
import { FirestoreThemeMarketplaceOrderRepository } from "./FirestoreThemeMarketplaceOrderRepository";
import { IzipayThemeMarketplacePaymentGateway } from "./IzipayThemeMarketplacePaymentGateway";
import { StaticThemePackCatalog } from "./StaticThemePackCatalog";

let themeMarketplaceUseCases: ThemeMarketplaceUseCases | null = null;

export function buildThemeMarketplaceUseCases(): ThemeMarketplaceUseCases {
  if (!themeMarketplaceUseCases) {
    const repository = new FirestoreThemeMarketplaceOrderRepository();
    const packs = new StaticThemePackCatalog();
    const paymentGateway = new IzipayThemeMarketplacePaymentGateway();

    const getCatalog = new ThemeMarketplaceCatalogCoreUseCase(repository, packs);
    const createOrder = new CreateThemeMarketplaceOrderCoreUseCase(repository, packs);
    const getOrderById = new GetThemeMarketplaceOrderCoreUseCase(repository);
    const updateOrderProvider = new UpdateThemeMarketplaceOrderProviderCoreUseCase(repository);
    const markOrderPaid = new MarkThemeMarketplaceOrderPaidCoreUseCase(repository);
    const executePurchase = new ExecuteThemeMarketplacePurchaseCoreUseCase(
      createOrder,
      updateOrderProvider,
      paymentGateway,
    );
    const confirmPurchase = new ConfirmThemeMarketplacePurchaseCoreUseCase(
      getOrderById,
      markOrderPaid,
      paymentGateway,
    );

    themeMarketplaceUseCases = {
      getCatalog,
      createOrder,
      getOrderById,
      updateOrderProvider,
      markOrderPaid,
      executePurchase,
      confirmPurchase,
    };
  }

  return themeMarketplaceUseCases;
}
