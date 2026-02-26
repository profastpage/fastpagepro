export type CartaCartItem = {
  id: string;
  title: string;
  imageUrl: string;
  categoryName: string;
  priceLabel: string;
  unitPrice: number;
  quantity: number;
};

type AddInput = Omit<CartaCartItem, "quantity">;

export function addItemToCartStore(prev: CartaCartItem[], nextItem: AddInput): CartaCartItem[] {
  const existing = prev.find((entry) => entry.id === nextItem.id);
  if (existing) {
    return prev.map((entry) =>
      entry.id === nextItem.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
    );
  }
  return [...prev, { ...nextItem, quantity: 1 }];
}

export function removeItemFromCartStore(prev: CartaCartItem[], itemId: string): CartaCartItem[] {
  return prev.filter((item) => item.id !== itemId);
}

export function patchCartItemQuantityStore(
  prev: CartaCartItem[],
  itemId: string,
  nextQty: number,
): CartaCartItem[] {
  if (nextQty <= 0) return removeItemFromCartStore(prev, itemId);
  return prev.map((item) => (item.id === itemId ? { ...item, quantity: nextQty } : item));
}

