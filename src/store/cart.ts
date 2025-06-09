// src/store/cart.ts
import { create } from 'zustand';
import type { Item } from '../types';

interface CartItem extends Item {
  quantity: number;
}

interface StoreState {
  cart: Record<string, CartItem>;
  increment: (item: Item) => void;
  decrement: (item: Item) => void;
  clear: () => void;
}

export const useCart = create<StoreState>((set) => ({
  cart: {},
  increment: (item) =>
    set((state) => {
      const existing = state.cart[item.id] || { ...item, quantity: 0 };
      return {
        cart: {
          ...state.cart,
          [item.id]: { ...existing, quantity: existing.quantity + 1 },
        },
      };
    }),
  decrement: (item) =>
    set((state) => {
      const existing = state.cart[item.id];
      if (!existing) return state;
      const quantity = Math.max(existing.quantity - 1, 0);
      const newCart = { ...state.cart };
      if (quantity === 0) delete newCart[item.id];
      else newCart[item.id] = { ...existing, quantity };
      return { cart: newCart };
    }),
  clear: () => set({ cart: {} }),
}));
