import type {
  MarkThemeMarketplaceOrderPaidInputDto,
  ThemeMarketplaceOrderDto,
  ThemeMarketplaceOrderStatus,
  ThemeMarketplacePaymentMethod,
  UpdateThemeMarketplaceOrderProviderInputDto,
} from "@/contract/themeMarketplace/dtos";
import type {
  CreateThemeMarketplaceOrderRecordInputDto,
  ThemeMarketplaceOrderRepositoryPort,
} from "@/contract/themeMarketplace/ports";
import { adminDb } from "@/lib/firebaseAdmin";

const THEME_MARKETPLACE_ORDERS_COLLECTION = "theme_marketplace_orders";

function sanitizeText(value: unknown, maxLen = 160): string {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLen);
}

function assertStorage() {
  if (!adminDb) {
    throw new Error("SERVICE_UNAVAILABLE: theme marketplace unavailable");
  }
  return adminDb;
}

function toOrder(input: Record<string, unknown>, id: string): ThemeMarketplaceOrderDto {
  const status: ThemeMarketplaceOrderStatus =
    input.status === "PAID" || input.status === "CANCELLED" ? input.status : "PENDING";
  const paymentMethod: ThemeMarketplacePaymentMethod =
    input.paymentMethod === "YAPE" ||
    input.paymentMethod === "PLIN" ||
    input.paymentMethod === "TRANSFERENCIA" ||
    input.paymentMethod === "IZIPAY"
      ? input.paymentMethod
      : "TRANSFERENCIA";

  return {
    id,
    userId: sanitizeText(input.userId, 120),
    packId: sanitizeText(input.packId, 120),
    packName: sanitizeText(input.packName, 120),
    status,
    paymentMethod,
    amountSoles: Math.max(0, Number(input.amountSoles || 0)),
    provider: input.provider === "IZIPAY" ? "IZIPAY" : "MANUAL",
    providerPaymentId: sanitizeText(input.providerPaymentId, 220),
    createdAt: Math.max(0, Number(input.createdAt || Date.now())),
    updatedAt: Math.max(0, Number(input.updatedAt || Date.now())),
    paidAt: Number(input.paidAt || 0) > 0 ? Number(input.paidAt) : undefined,
  };
}

function createOrderId() {
  return `tmk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export class FirestoreThemeMarketplaceOrderRepository implements ThemeMarketplaceOrderRepositoryPort {
  public async findByUserId(userId: string): Promise<ThemeMarketplaceOrderDto[]> {
    const db = assertStorage();
    const safeUserId = sanitizeText(userId, 120);
    const orderSnapshots = await db
      .collection(THEME_MARKETPLACE_ORDERS_COLLECTION)
      .where("userId", "==", safeUserId)
      .get();

    return orderSnapshots.docs
      .map((docSnapshot) => toOrder((docSnapshot.data() || {}) as Record<string, unknown>, docSnapshot.id))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  public async create(input: CreateThemeMarketplaceOrderRecordInputDto): Promise<ThemeMarketplaceOrderDto> {
    const db = assertStorage();
    const orderId = createOrderId();
    const now = Date.now();
    const order: ThemeMarketplaceOrderDto = {
      id: orderId,
      userId: sanitizeText(input.userId, 120),
      packId: sanitizeText(input.pack.id, 120),
      packName: sanitizeText(input.pack.name, 120),
      status: "PENDING",
      paymentMethod: input.paymentMethod,
      amountSoles: Math.max(0, Number(input.pack.priceSoles || 0)),
      provider: input.provider,
      providerPaymentId: sanitizeText(input.providerPaymentId, 220),
      createdAt: now,
      updatedAt: now,
    };

    await db.collection(THEME_MARKETPLACE_ORDERS_COLLECTION).doc(orderId).set(order, { merge: true });

    return order;
  }

  public async getById(orderId: string): Promise<ThemeMarketplaceOrderDto | null> {
    const db = assertStorage();
    const safeOrderId = sanitizeText(orderId, 140);
    if (!safeOrderId) {
      throw new Error("ORDER_ID_REQUIRED");
    }

    const snapshot = await db.collection(THEME_MARKETPLACE_ORDERS_COLLECTION).doc(safeOrderId).get();
    if (!snapshot.exists) return null;
    return toOrder((snapshot.data() || {}) as Record<string, unknown>, snapshot.id);
  }

  public async updateProvider(input: UpdateThemeMarketplaceOrderProviderInputDto): Promise<void> {
    const db = assertStorage();
    const orderId = sanitizeText(input.orderId, 140);
    if (!orderId) {
      throw new Error("ORDER_ID_REQUIRED");
    }

    await db
      .collection(THEME_MARKETPLACE_ORDERS_COLLECTION)
      .doc(orderId)
      .set(
        {
          providerPaymentId: sanitizeText(input.providerPaymentId, 220),
          provider: input.provider,
          updatedAt: Date.now(),
        },
        { merge: true },
      );
  }

  public async markPaid(input: MarkThemeMarketplaceOrderPaidInputDto): Promise<ThemeMarketplaceOrderDto> {
    const db = assertStorage();
    const orderId = sanitizeText(input.orderId, 140);
    if (!orderId) {
      throw new Error("ORDER_ID_REQUIRED");
    }

    const orderRef = db.collection(THEME_MARKETPLACE_ORDERS_COLLECTION).doc(orderId);
    const snapshot = await orderRef.get();
    if (!snapshot.exists) {
      throw new Error("ORDER_NOT_FOUND");
    }

    const current = toOrder((snapshot.data() || {}) as Record<string, unknown>, snapshot.id);
    if (current.status === "PAID") {
      return current;
    }

    const now = Date.now();
    const providerPaymentId = sanitizeText(input.providerPaymentId || current.providerPaymentId, 220);

    await orderRef.set(
      {
        status: "PAID",
        providerPaymentId,
        paidAt: now,
        updatedAt: now,
      },
      { merge: true },
    );

    return {
      ...current,
      status: "PAID",
      providerPaymentId,
      paidAt: now,
      updatedAt: now,
    };
  }
}
