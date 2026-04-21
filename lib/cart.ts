export type CartItem = {
  id: number | string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: Omit<CartItem, "quantity">) {
  const cart = getCart();

  const existing = cart.find((x) => String(x.id) === String(item.id));

  let updated: CartItem[];

  if (existing) {
    updated = cart.map((x) =>
      String(x.id) === String(item.id)
        ? { ...x, quantity: x.quantity + 1 }
        : x
    );
  } else {
    updated = [...cart, { ...item, quantity: 1 }];
  }

  saveCart(updated);
  window.dispatchEvent(new Event("cartUpdated"));
}

export function removeFromCart(id: number | string) {
  const cart = getCart();
  const updated = cart.filter((item) => String(item.id) !== String(id));
  saveCart(updated);
  window.dispatchEvent(new Event("cartUpdated"));
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
}

export function getCartCount(): number {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}