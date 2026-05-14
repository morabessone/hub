import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          vendor: string;
          goal: string;
          unit: string;
          stock: number;
          is_active: boolean;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: string;
          delivery_day_preference: number;
          created_at: string;
          next_delivery_date: string;
        };
      };
      subscription_items: {
        Row: {
          id: string;
          subscription_id: string;
          product_id: string;
          quantity: number;
          frequency_weeks: number;
          is_paused: boolean;
          next_delivery_date: string;
        };
      };
    };
  };
};
