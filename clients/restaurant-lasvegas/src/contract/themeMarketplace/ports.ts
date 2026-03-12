import type {
  MarkThemeMarketplaceOrderPaidInputDto,
  ThemeMarketplaceCheckoutMode,
  ThemeMarketplaceOrderDto,
  ThemeMarketplacePaymentMethod,
  ThemeMarketplaceProvider,
  ThemePackDto,
  UpdateThemeMarketplaceOrderProviderInputDto,
} from "./dtos";

export interface ThemePackCatalogPort {
  list(): ThemePackDto[];
  findById(packId: string): ThemePackDto | null;
}

export interface CreateThemeMarketplaceOrderRecordInputDto {
  userId: string;
  pack: ThemePackDto;
  paymentMethod: ThemeMarketplacePaymentMethod;
  provider: ThemeMarketplaceProvider;
  providerPaymentId?: string;
}

export interface ThemeMarketplaceOrderRepositoryPort {
  findByUserId(userId: string): Promise<ThemeMarketplaceOrderDto[]>;
  create(input: CreateThemeMarketplaceOrderRecordInputDto): Promise<ThemeMarketplaceOrderDto>;
  getById(orderId: string): Promise<ThemeMarketplaceOrderDto | null>;
  updateProvider(input: UpdateThemeMarketplaceOrderProviderInputDto): Promise<void>;
  markPaid(input: MarkThemeMarketplaceOrderPaidInputDto): Promise<ThemeMarketplaceOrderDto>;
}

export interface ThemeMarketplaceCheckoutSessionDto {
  mode: ThemeMarketplaceCheckoutMode;
  checkoutUrl: string;
  providerPaymentId: string;
}

export interface ThemeMarketplacePaymentStatusDto {
  status: string;
  paid: boolean;
}

export interface ThemeMarketplacePaymentGatewayPort {
  createCheckoutSession(input: {
    referenceId: string;
    amountSoles: number;
    customerId: string;
    customerEmail: string;
    description: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string | number | boolean>;
  }): Promise<ThemeMarketplaceCheckoutSessionDto>;
  getPaymentStatus(input: { providerPaymentId: string }): Promise<ThemeMarketplacePaymentStatusDto>;
}
