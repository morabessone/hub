import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Add them to your .env file. The app will run in demo mode.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// ── Products ──────────────────────────────────────────────────────────────────
export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('vendor');
  if (error) throw error;
  return data;
}

// ── Subscription ──────────────────────────────────────────────────────────────
export async function fetchUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function fetchSubscriptionItems(subscriptionId: string) {
  const { data, error } = await supabase
    .from('subscription_items')
    .select('*, product:products(*)')
    .eq('subscription_id', subscriptionId)
    .neq('status', 'cancelled');
  if (error) throw error;
  return data;
}

export async function createSubscription(
  userId: string,
  deliveryDayPreference: number
) {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .insert({ user_id: userId, delivery_day_preference: deliveryDayPreference, status: 'active' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function upsertSubscriptionItems(
  subscriptionId: string,
  items: Array<{
    product_id: string;
    frequency_weeks: number;
    quantity: number;
    next_delivery_date: string;
  }>
) {
  const records = items.map((item) => ({
    subscription_id: subscriptionId,
    ...item,
    status: 'active',
  }));
  const { data, error } = await supabase
    .from('subscription_items')
    .insert(records)
    .select();
  if (error) throw error;
  return data;
}

export async function updateSubscriptionItemStatus(
  itemId: string,
  status: 'active' | 'paused'
) {
  const { error } = await supabase
    .from('subscription_items')
    .update({ status })
    .eq('id', itemId);
  if (error) throw error;
}

export async function updateSubscriptionItemFrequency(
  itemId: string,
  frequencyWeeks: number
) {
  const { error } = await supabase
    .from('subscription_items')
    .update({ frequency_weeks: frequencyWeeks })
    .eq('id', itemId);
  if (error) throw error;
}

// ── Delivery date helper ──────────────────────────────────────────────────────
/**
 * Returns the next ISO date string for the given delivery day preference
 * (1 = Monday … 7 = Sunday), starting from today, offset by `weeksOffset` weeks.
 */
export function calcNextDeliveryDate(
  deliveryDayPref: number,
  weeksOffset = 0
): string {
  const today = new Date();
  const todayDow = today.getDay() || 7; // getDay() returns 0 for Sunday
  let daysUntil = deliveryDayPref - todayDow;
  if (daysUntil <= 0) daysUntil += 7;
  const next = new Date(today);
  next.setDate(today.getDate() + daysUntil + weeksOffset * 7);
  return next.toISOString().split('T')[0];
}
