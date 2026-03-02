import { adminDb } from "@/lib/firebaseAdmin";
import { THEME_PACKS, getThemePackById, type ThemePackDefinition } from "@/lib/themeMarketplace/packs";

export type ThemeMarketplacePaymentMethod = "YAPE" | "PLIN" | "TRANSFERENCIA" | "IZIPAY";
export type ThemeMarketplaceOrderStatus = "PENDING" | "PAID" | "CANCELLED";

export interface ThemeMarketplaceOrder {
  id: string;
  userId: string;
  packId: string;
  packName: string;
  status: ThemeMarketplaceOrderStatus;
  paymentMethod: ThemeMarketplacePaymentMethod;
  amountSoles: number;
  provider: "MANUAL" | "IZIPAY";
  providerPaymentId: string;
  createdAt: number;
  updatedAt: number;
  paidAt?: number;
}

export interface ThemeMarketplaceCatalogResponse {
  packs: ThemePackDefinition[];
  ownedPackIds: string[];
  pendingOrders: ThemeMarketplaceOrder[];
}

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

function toOrder(input: Record<string, unknown>, id: string): ThemeMarketplaceOrder {
  return {
    id,
    userId: sanitizeText(input.userId, 120),
    packId: sanitizeText(input.packId, 120),
    packName: sanitizeText(input.packName, 120),
    status:
      input.status === "PAID" || input.status === "CANCELLED"
        ? (input.status as ThemeMarketplaceOrderStatus)
        : "PENDING",
    paymentMethod:
      input.paymentMethod === "YAPE" ||
      input.paymentMethod === "PLIN" ||
      input.paymentMethod === "TRANSFERENCIA" ||
      input.paymentMethod === "IZIPAY"
        ? (input.paymentMethod as ThemeMarketplacePaymentMethod)
        : "TRANSFERENCIA",
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

export async function getThemeMarketplaceCatalogByUser(
  userId: string,
): Promise<ThemeMarketplaceCatalogResponse> {
  const db = assertStorage();
  const safeUserId = sanitizeText(userId, 120);
  if (!safeUserId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const orderSnapshots = await db
    .collection(THEME_MARKETPLACE_ORDERS_COLLECTION)
    .where("userId", "==", safeUserId)
    .get();

  const orders = orderSnapshots.docs
    .map((docSnapshot) => toOrder((docSnapshot.data() || {}) as Record<string, unknown>, docSnapshot.id))
    .sort((a, b) => b.createdAt - a.createdAt);

  const ownedPackIds = Array.from(
    new Set(
      orders.filter((order) => order.status === "PAID").map((order) => order.packId),
    ),
  );

  const pendingOrders = orders.filter((order) => order.status === "PENDING");

  return {
    packs: THEME_PACKS,
    ownedPackIds,
    pendingOrders,
  };
}

export async function createThemeMarketplaceOrder(input: {
  userId: string;
  packId: string;
  paymentMethod: ThemeMarketplacePaymentMethod;
  provider?: "MANUAL" | "IZIPAY";
  providerPaymentId?: string;
}): Promise<ThemeMarketplaceOrder> {
  const db = assertStorage();
  const safeUserId = sanitizeText(input.userId, 120);
  if (!safeUserId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const pack = getThemePackById(input.packId);
  if (!pack) {
    throw new Error("INVALID_PACK");
  }

  const orderId = createOrderId();
  const now = Date.now();
  const order: ThemeMarketplaceOrder = {
    id: orderId,
    userId: safeUserId,
    packId: pack.id,
    packName: pack.name,
    status: "PENDING",
    paymentMethod: input.paymentMethod,
    amountSoles: pack.priceSoles,
    provider: input.provider || "MANUAL",
    providerPaymentId: sanitizeText(input.providerPaymentId, 220),
    createdAt: now,
    updatedAt: now,
  };

  await db
    .collection(THEME_MARKETPLACE_ORDERS_COLLECTION)
    .doc(orderId)
    .set(order, { merge: true });

  return order;
}

export async function getThemeMarketplaceOrderById(orderId: string) {
  const db = assertStorage();
  const safeOrderId = sanitizeText(orderId, 140);
  if (!safeOrderId) {
    throw new Error("ORDER_ID_REQUIRED");
  }

  const snapshot = await db.collection(THEME_MARKETPLACE_ORDERS_COLLECTION).doc(safeOrderId).get();
  if (!snapshot.exists) return null;
  return toOrder((snapshot.data() || {}) as Record<string, unknown>, snapshot.id);
}

export async function updateThemeMarketplaceOrderProvider(input: {
  orderId: string;
  providerPaymentId: string;
  provider: "MANUAL" | "IZIPAY";
}) {
  const db = assertStorage();
  const orderId = sanitizeText(input.orderId, 140);
  if (!orderId) {
    throw new Error("ORDER_ID_REQUIRED");
  }
  const now = Date.now();
  await db
    .collection(THEME_MARKETPLACE_ORDERS_COLLECTION)
    .doc(orderId)
    .set(
      {
        providerPaymentId: sanitizeText(input.providerPaymentId, 220),
        provider: input.provider,
        updatedAt: now,
      },
      { merge: true },
    );
}

export async function markThemeMarketplaceOrderPaid(input: {
  orderId: string;
  providerPaymentId?: string;
}) {
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
  await orderRef.set(
    {
      status: "PAID",
      providerPaymentId: sanitizeText(input.providerPaymentId || current.providerPaymentId, 220),
      paidAt: now,
      updatedAt: now,
    },
    { merge: true },
  );

  return {
    ...current,
    status: "PAID" as const,
    providerPaymentId: sanitizeText(input.providerPaymentId || current.providerPaymentId, 220),
    paidAt: now,
    updatedAt: now,
  };
}

