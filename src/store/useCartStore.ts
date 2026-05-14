import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../lib/supabase'

export type CartItem = {
  product: Product
  quantity: number
  frequency_weeks: 1 | 2 | 4
}

type CartState = {
  items: CartItem[]
  deliveryDayPreference: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateFrequency: (productId: string, frequency: 1 | 2 | 4) => void
  setDeliveryDayPreference: (day: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getWeeklyTotal: () => number
  getMonthlyTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryDayPreference: 1, // Monday

      addItem: (product: Product) => {
        const existing = get().items.find(i => i.product.id === product.id)
        if (existing) {
          set({
            items: get().items.map(i =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({
            items: [...get().items, { product, quantity: 1, frequency_weeks: 2 }],
          })
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter(i => i.product.id !== productId) })
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        })
      },

      updateFrequency: (productId: string, frequency: 1 | 2 | 4) => {
        set({
          items: get().items.map(i =>
            i.product.id === productId ? { ...i, frequency_weeks: frequency } : i
          ),
        })
      },

      setDeliveryDayPreference: (day: number) => {
        set({ deliveryDayPreference: day })
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      getWeeklyTotal: () =>
        get().items.reduce((acc, i) => acc + (i.product.price * i.quantity) / i.frequency_weeks, 0),

      getMonthlyTotal: () =>
        get().items.reduce((acc, i) => acc + (i.product.price * i.quantity * 4) / i.frequency_weeks, 0),
    }),
    { name: 'nutrilogistics-cart' }
  )
)
