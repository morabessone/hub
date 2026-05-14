import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, FrequencyWeeks, Product } from '../types';

interface CartState {
  items: CartItem[];
  deliveryDayPreference: number; // 0=Sun … 6=Sat
  addItem: (product: Product, frequency?: FrequencyWeeks) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateFrequency: (productId: string, frequency: FrequencyWeeks) => void;
  setDeliveryDay: (day: number) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryDayPreference: 1, // Monday default

      addItem: (product, frequency = 2) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set((s) => ({
            items: [
              ...s.items,
              { product, quantity: 1, frequency_weeks: frequency },
            ],
          }));
        }
      },

      removeItem: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) })),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      updateFrequency: (productId, frequency) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.product.id === productId ? { ...i, frequency_weeks: frequency } : i
          ),
        })),

      setDeliveryDay: (day) => set({ deliveryDayPreference: day }),

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'nutrilogistics-cart' }
  )
);
