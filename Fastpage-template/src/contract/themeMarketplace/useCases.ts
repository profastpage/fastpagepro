import type {
  ConfirmThemeMarketplacePurchaseInputDto,
  ConfirmThemeMarketplacePurchaseOutputDto,
  CreateThemeMarketplaceOrderInputDto,
  ExecuteThemeMarketplacePurchaseInputDto,
  ExecuteThemeMarketplacePurchaseOutputDto,
  GetThemeMarketplaceOrderInputDto,
  MarkThemeMarketplaceOrderPaidInputDto,
  ThemeMarketplaceCatalogInputDto,
  ThemeMarketplaceCatalogOutputDto,
  ThemeMarketplaceOrderDto,
  UpdateThemeMarketplaceOrderProviderInputDto,
} from "./dtos";

export interface ThemeMarketplaceCatalogUseCase {
  execute(input: ThemeMarketplaceCatalogInputDto): Promise<ThemeMarketplaceCatalogOutputDto>;
}

export interface CreateThemeMarketplaceOrderUseCase {
  execute(input: CreateThemeMarketplaceOrderInputDto): Promise<ThemeMarketplaceOrderDto>;
}

export interface GetThemeMarketplaceOrderUseCase {
  execute(input: GetThemeMarketplaceOrderInputDto): Promise<ThemeMarketplaceOrderDto | null>;
}

export interface UpdateThemeMarketplaceOrderProviderUseCase {
  execute(input: UpdateThemeMarketplaceOrderProviderInputDto): Promise<void>;
}

export interface MarkThemeMarketplaceOrderPaidUseCase {
  execute(input: MarkThemeMarketplaceOrderPaidInputDto): Promise<ThemeMarketplaceOrderDto>;
}

export interface ExecuteThemeMarketplacePurchaseUseCase {
  execute(input: ExecuteThemeMarketplacePurchaseInputDto): Promise<ExecuteThemeMarketplacePurchaseOutputDto>;
}

export interface ConfirmThemeMarketplacePurchaseUseCase {
  execute(input: ConfirmThemeMarketplacePurchaseInputDto): Promise<ConfirmThemeMarketplacePurchaseOutputDto>;
}

export interface ThemeMarketplaceUseCases {
  getCatalog: ThemeMarketplaceCatalogUseCase;
  createOrder: CreateThemeMarketplaceOrderUseCase;
  getOrderById: GetThemeMarketplaceOrderUseCase;
  updateOrderProvider: UpdateThemeMarketplaceOrderProviderUseCase;
  markOrderPaid: MarkThemeMarketplaceOrderPaidUseCase;
  executePurchase: ExecuteThemeMarketplacePurchaseUseCase;
  confirmPurchase: ConfirmThemeMarketplacePurchaseUseCase;
}
