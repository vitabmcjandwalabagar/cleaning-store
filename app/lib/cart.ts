export type CartItem = {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

const CART_KEY = "cleaning_store_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const cart = localStorage.getItem(CART_KEY);
  if (!cart) return [];

  try {
    return JSON.parse(cart) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find((cartItem) => cartItem.id === item.id);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
  window.dispatchEvent(new Event("cartUpdated"));
}

export function removeFromCart(id: number) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  window.dispatchEvent(new Event("cartUpdated"));
}

export function updateCartQuantity(id: number, quantity: number) {
  const cart = getCart()
    .map((item) => {
      if (item.id === id) {
        return { ...item, quantity };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);

  saveCart(cart);
  window.dispatchEvent(new Event("cartUpdated"));
}

export function clearCart() {
  saveCart([]);
  window.dispatchEvent(new Event("cartUpdated"));
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}