import type { CartItem, Product } from "../types/product";

const KEY = "cart";

export function getCart(): CartItem[] {
  const data = localStorage.getItem(KEY);

  return data ? JSON.parse(data) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(cart));
}

export function addToCart(product: Product) {
  const cart = getCart();

  const existing = cart.find(
    (item) => item.product.id === product.id
  );

  if (existing) {
    existing.cantidad += 1;
  } else {
    cart.push({
      product,
      cantidad: 1,
    });
  }

  saveCart(cart);
}

export function getCartCount(): number {
  const cart = getCart();

  return cart.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );
}