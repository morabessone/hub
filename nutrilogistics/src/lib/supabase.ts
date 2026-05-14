import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing env vars VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
    'Running in demo mode with mock data.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// ─── Products ────────────────────────────────────────────────────────────────

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function fetchUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`*, subscription_items(*, products(*))`)
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function createSubscription(
  userId: string,
  deliveryDayPreference: number
) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({ user_id: userId, status: 'active', delivery_day_preference: deliveryDayPreference })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function upsertSubscriptionItems(
  subscriptionId: string,
  items: Array<{
    product_id: string;
    quantity: number;
    frequency_weeks: number;
    next_delivery_date: string;
  }>
) {
  const rows = items.map((item) => ({ ...item, subscription_id: subscriptionId }));
  const { data, error } = await supabase
    .from('subscription_items')
    .upsert(rows, { onConflict: 'subscription_id,product_id' })
    .select();
  if (error) throw error;
  return data;
}

export async function updateSubscriptionItem(
  itemId: string,
  updates: { frequency_weeks?: number; is_paused?: boolean; quantity?: number }
) {
  const { data, error } = await supabase
    .from('subscription_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Delivery date calculator ─────────────────────────────────────────────────

/** Returns the next occurrence of `dayOfWeek` (0=Sun…6=Sat), at least `minDaysAhead` days from now. */
export function calcNextDelivery(
  deliveryDayPreference: number,
  minDaysAhead = 3
): Date {
  const today = new Date();
  const target = new Date(today);
  target.setDate(today.getDate() + minDaysAhead);

  while (target.getDay() !== deliveryDayPreference) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

export function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}
