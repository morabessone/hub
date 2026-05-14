import { useState, useEffect } from 'react';
import type { SubscriptionItem, DeliveryWeek } from '../types';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/useCartStore';

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

export function calculateDeliverySchedule(
  items: SubscriptionItem[],
  baseDate: Date = new Date()
): DeliveryWeek[] {
  const weeks: DeliveryWeek[] = [];

  for (let w = 1; w <= 4; w++) {
    const weekNum = w as 1 | 2 | 3 | 4;
    const startDate = addWeeks(baseDate, w - 1);
    const endDate = addWeeks(baseDate, w);

    const weekItems = items.filter((item) => {
      if (item.is_paused) return false;
      // Week 1: all frequencies (1, 2, 4)
      // Week 2: only frequency 1
      // Week 3: frequency 1 and 2
      // Week 4: frequency 1, 2 and 4 (second cycle)
      if (weekNum === 1) return true;
      if (weekNum === 2) return item.frequency_weeks === 1;
      if (weekNum === 3) return item.frequency_weeks === 1 || item.frequency_weeks === 2;
      if (weekNum === 4) return true;
      return false;
    });

    weeks.push({ weekNumber: weekNum, startDate, endDate, items: weekItems });
  }

  return weeks;
}

export function nextDeliveryDate(deliveryDayPreference: number): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  let daysUntil = deliveryDayPreference - dayOfWeek;
  if (daysUntil <= 0) daysUntil += 7;
  const next = new Date(today);
  next.setDate(today.getDate() + daysUntil);
  return next;
}

export function useSubscription(userId?: string) {
  const cartItems = useCartStore((s) => s.items);
  const [subscriptionItems, setSubscriptionItems] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Build subscription items from cart for preview or loaded from DB
  useEffect(() => {
    if (userId) {
      loadFromDB(userId);
    } else {
      const fromCart: SubscriptionItem[] = cartItems.map((item, idx) => ({
        id: `cart-${idx}`,
        subscription_id: 'preview',
        product_id: item.product.id,
        quantity: item.quantity,
        frequency_weeks: item.frequency_weeks,
        is_paused: false,
        next_delivery_date: new Date().toISOString(),
        product: item.product,
      }));
      setSubscriptionItems(fromCart);
    }
  }, [cartItems, userId]);

  async function loadFromDB(uid: string) {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('subscription_items')
        .select('*, product:products(*)')
        .eq('subscription_id', uid);

      if (data && data.length > 0) {
        setSubscriptionItems(data as SubscriptionItem[]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function togglePause(itemId: string) {
    setSubscriptionItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, is_paused: !i.is_paused } : i))
    );

    if (userId) {
      const item = subscriptionItems.find((i) => i.id === itemId);
      if (item) {
        await supabase
          .from('subscription_items')
          .update({ is_paused: !item.is_paused })
          .eq('id', itemId);
      }
    }
  }

  const schedule = calculateDeliverySchedule(subscriptionItems);

  return { subscriptionItems, schedule, loading, togglePause };
}
