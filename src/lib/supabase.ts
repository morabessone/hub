import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[NutriLogistics] Supabase env vars not set. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key'
);

// ── Products ────────────────────────────────────────────────────────────────

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('vendor');
  if (error) throw error;
  return data;
}

// ── Subscriptions ────────────────────────────────────────────────────────────

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

export async function createUserSubscription(
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
    quantity: number;
    frequency_weeks: number;
    next_delivery_date: string;
  }>
) {
  const rows = items.map((i) => ({ ...i, subscription_id: subscriptionId, status: 'active' }));
  const { data, error } = await supabase
    .from('subscription_items')
    .upsert(rows, { onConflict: 'subscription_id,product_id' })
    .select();
  if (error) throw error;
  return data;
}

export async function updateItemStatus(
  itemId: string,
  status: 'active' | 'paused' | 'skipped'
) {
  const { error } = await supabase
    .from('subscription_items')
    .update({ status })
    .eq('id', itemId);
  if (error) throw error;
}

export async function updateItemFrequency(
  itemId: string,
  frequencyWeeks: number
) {
  const { error } = await supabase
    .from('subscription_items')
    .update({ frequency_weeks: frequencyWeeks })
    .eq('id', itemId);
  if (error) throw error;
}
