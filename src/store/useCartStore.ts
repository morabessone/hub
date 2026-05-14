import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, FrequencyWeeks, Product } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, frequency?: FrequencyWeeks) => void;
  removeItem: (productId: string) => void;
  updateFrequency: (productId: string, frequency: FrequencyWeeks) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, frequency = 4) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { product, frequency_weeks: frequency, quantity: 1 }],
          };
        });
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateFrequency: (productId, frequency) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, frequency_weeks: frequency } : i
          ),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (acc, i) => acc + i.product.price * i.quantity,
          0
        ),
    }),
    { name: 'nutrilogistics-cart' }
  )
);
