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
  ThemeMarketplacePaymentMethod,
  ThemeMarketplaceProvider,
  UpdateThemeMarketplaceOrderProviderInputDto,
} from "@/contract/themeMarketplace/dtos";
import type {
  ConfirmThemeMarketplacePurchaseUseCase,
  CreateThemeMarketplaceOrderUseCase,
  ExecuteThemeMarketplacePurchaseUseCase,
  GetThemeMarketplaceOrderUseCase,
  MarkThemeMarketplaceOrderPaidUseCase,
  ThemeMarketplaceCatalogUseCase,
  UpdateThemeMarketplaceOrderProviderUseCase,
} from "@/contract/themeMarketplace/useCases";
import type {
  ThemeMarketplaceOrderRepositoryPort,
  ThemeMarketplacePaymentGatewayPort,
  ThemePackCatalogPort,
} from "@/contract/themeMarketplace/ports";

function sanitizeText(value: unknown, maxLen = 160): string {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLen);
}

function normalizePaymentMethod(input: unknown): ThemeMarketplacePaymentMethod {
  const normalized = sanitizeText(input, 32).toUpperCase();
  if (normalized === "YAPE" || normalized === "PLIN" || normalized === "TRANSFERENCIA") {
    return normalized;
  }
  return "IZIPAY";
}

function assertUserId(userId: unknown): string {
  const safeUserId = sanitizeText(userId, 120);
  if (!safeUserId) {
    throw new Error("USER_ID_REQUIRED");
  }
  return safeUserId;
}

function assertOrderId(orderId: unknown): string {
  const safeOrderId = sanitizeText(orderId, 140);
  if (!safeOrderId) {
    throw new Error("ORDER_ID_REQUIRED");
  }
  return safeOrderId;
}

function normalizeOrigin(origin: unknown): string {
  const normalized = sanitizeText(origin, 2048).replace(/\/$/, "");
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  throw new Error("INVALID_ORIGIN");
}

function buildBillingUrl(origin: string, result: "success" | "cancel", orderId: string): string {
  return `${origin}/dashboard/billing?marketplaceResult=${result}&orderId=${encodeURIComponent(orderId)}`;
}

function defaultProvider(paymentMethod: ThemeMarketplacePaymentMethod): ThemeMarketplaceProvider {
  return paymentMethod === "IZIPAY" ? "IZIPAY" : "MANUAL";
}

export class ThemeMarketplaceCatalogCoreUseCase implements ThemeMarketplaceCatalogUseCase {
  constructor(
    private readonly repository: ThemeMarketplaceOrderRepositoryPort,
    private readonly packs: ThemePackCatalogPort,
  ) {}

  public async execute(input: ThemeMarketplaceCatalogInputDto): Promise<ThemeMarketplaceCatalogOutputDto> {
    const userId = assertUserId(input?.userId);
    const orders = await this.repository.findByUserId(userId);
    const ownedPackIds = Array.from(
      new Set(orders.filter((order) => order.status === "PAID").map((order) => order.packId)),
    );
    const pendingOrders = orders.filter((order) => order.status === "PENDING");

    return {
      packs: this.packs.list(),
      ownedPackIds,
      pendingOrders,
    };
  }
}

export class CreateThemeMarketplaceOrderCoreUseCase implements CreateThemeMarketplaceOrderUseCase {
  constructor(
    private readonly repository: ThemeMarketplaceOrderRepositoryPort,
    private readonly packs: ThemePackCatalogPort,
  ) {}

  public async execute(input: CreateThemeMarketplaceOrderInputDto): Promise<ThemeMarketplaceOrderDto> {
    const userId = assertUserId(input?.userId);
    const packId = sanitizeText(input?.packId, 120);
    const pack = this.packs.findById(packId);
    if (!pack) {
      throw new Error("INVALID_PACK");
    }

    return this.repository.create({
      userId,
      pack,
      paymentMethod: input.paymentMethod,
      provider: input.provider || "MANUAL",
      providerPaymentId: input.providerPaymentId,
    });
  }
}

export class GetThemeMarketplaceOrderCoreUseCase implements GetThemeMarketplaceOrderUseCase {
  constructor(private readonly repository: ThemeMarketplaceOrderRepositoryPort) {}

  public async execute(input: GetThemeMarketplaceOrderInputDto): Promise<ThemeMarketplaceOrderDto | null> {
    const orderId = assertOrderId(input?.orderId);
    return this.repository.getById(orderId);
  }
}

export class UpdateThemeMarketplaceOrderProviderCoreUseCase
  implements UpdateThemeMarketplaceOrderProviderUseCase
{
  constructor(private readonly repository: ThemeMarketplaceOrderRepositoryPort) {}

  public async execute(input: UpdateThemeMarketplaceOrderProviderInputDto): Promise<void> {
    const orderId = assertOrderId(input?.orderId);
    await this.repository.updateProvider({
      orderId,
      provider: input.provider,
      providerPaymentId: input.providerPaymentId,
    });
  }
}

export class MarkThemeMarketplaceOrderPaidCoreUseCase implements MarkThemeMarketplaceOrderPaidUseCase {
  constructor(private readonly repository: ThemeMarketplaceOrderRepositoryPort) {}

  public async execute(input: MarkThemeMarketplaceOrderPaidInputDto): Promise<ThemeMarketplaceOrderDto> {
    const orderId = assertOrderId(input?.orderId);
    return this.repository.markPaid({
      orderId,
      providerPaymentId: input.providerPaymentId,
    });
  }
}

export class ExecuteThemeMarketplacePurchaseCoreUseCase implements ExecuteThemeMarketplacePurchaseUseCase {
  constructor(
    private readonly createOrderUseCase: CreateThemeMarketplaceOrderUseCase,
    private readonly updateOrderProviderUseCase: UpdateThemeMarketplaceOrderProviderUseCase,
    private readonly paymentGateway: ThemeMarketplacePaymentGatewayPort,
  ) {}

  public async execute(
    input: ExecuteThemeMarketplacePurchaseInputDto,
  ): Promise<ExecuteThemeMarketplacePurchaseOutputDto> {
    const paymentMethod = normalizePaymentMethod(input?.paymentMethod);
    const order = await this.createOrderUseCase.execute({
      userId: assertUserId(input?.userId),
      packId: sanitizeText(input?.packId, 120),
      paymentMethod,
      provider: defaultProvider(paymentMethod),
    });

    if (paymentMethod !== "IZIPAY") {
      return {
        success: true,
        order,
        paymentFlow: "MANUAL",
      };
    }

    const origin = normalizeOrigin(input?.origin);
    const checkout = await this.paymentGateway.createCheckoutSession({
      referenceId: order.id,
      amountSoles: order.amountSoles,
      customerId: order.userId,
      customerEmail: sanitizeText(input?.userEmail, 180),
      description: `Theme pack ${order.packName}`,
      successUrl: buildBillingUrl(origin, "success", order.id),
      cancelUrl: buildBillingUrl(origin, "cancel", order.id),
      metadata: {
        orderId: order.id,
        packId: order.packId,
      },
    });

    await this.updateOrderProviderUseCase.execute({
      orderId: order.id,
      providerPaymentId: checkout.providerPaymentId,
      provider: "IZIPAY",
    });

    return {
      success: true,
      orderId: order.id,
      checkoutUrl: checkout.checkoutUrl,
      paymentFlow: "IZIPAY",
      mode: checkout.mode,
    };
  }
}

export class ConfirmThemeMarketplacePurchaseCoreUseCase implements ConfirmThemeMarketplacePurchaseUseCase {
  constructor(
    private readonly getOrderUseCase: GetThemeMarketplaceOrderUseCase,
    private readonly markPaidUseCase: MarkThemeMarketplaceOrderPaidUseCase,
    private readonly paymentGateway: ThemeMarketplacePaymentGatewayPort,
  ) {}

  public async execute(
    input: ConfirmThemeMarketplacePurchaseInputDto,
  ): Promise<ConfirmThemeMarketplacePurchaseOutputDto> {
    const userId = assertUserId(input?.userId);
    const order = await this.getOrderUseCase.execute({ orderId: input.orderId });

    if (!order) {
      throw new Error("ORDER_NOT_FOUND");
    }
    if (order.userId !== userId) {
      throw new Error("FORBIDDEN");
    }

    if (order.status === "PAID") {
      return {
        success: true,
        paid: true,
        alreadyPaid: true,
      };
    }

    if (order.provider !== "IZIPAY") {
      return {
        success: true,
        paid: false,
        status: order.status,
      };
    }

    if (!order.providerPaymentId) {
      throw new Error("ORDER_PROVIDER_PAYMENT_MISSING");
    }

    const providerStatus = await this.paymentGateway.getPaymentStatus({
      providerPaymentId: order.providerPaymentId,
    });

    if (!providerStatus.paid) {
      return {
        success: true,
        paid: false,
        status: providerStatus.status,
      };
    }

    const paidOrder = await this.markPaidUseCase.execute({
      orderId: order.id,
      providerPaymentId: order.providerPaymentId,
    });

    return {
      success: true,
      paid: true,
      status: providerStatus.status,
      order: paidOrder,
    };
  }
}
