"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  product_id: number;
  slug: string;
  name: string;
  price_cents: number;
  image_path: string | null;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  lastAdded: CartItem | null;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "snorlaxin-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(() => setLastAdded(null), 2600);
    return () => clearTimeout(t);
  }, [lastAdded]);

  const add = useCallback<CartContextValue["add"]>((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.product_id === item.product_id);
      if (existing) {
        return prev.map((p) =>
          p.product_id === item.product_id ? { ...p, quantity: p.quantity + quantity } : p,
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setLastAdded({ ...item, quantity });
  }, []);

  const remove = useCallback((productId: number) => {
    setItems((prev) => prev.filter((p) => p.product_id !== productId));
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((p) => p.product_id !== productId)
        : prev.map((p) => (p.product_id === productId ? { ...p, quantity } : p)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((n, i) => n + i.quantity, 0),
      total: items.reduce((n, i) => n + i.quantity * i.price_cents, 0),
      add,
      remove,
      setQuantity,
      clear,
      lastAdded,
    }),
    [items, ready, add, remove, setQuantity, clear, lastAdded],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
