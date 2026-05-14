import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  vendor: string
  category: string
  objective: string
  serving_size: string
  calories_per_serving: number
  protein_per_serving: number
  is_active: boolean
  created_at: string
}

export type UserSubscription = {
  id: string
  user_id: string
  status: 'active' | 'paused' | 'cancelled'
  delivery_day_preference: number
  created_at: string
  updated_at: string
}

export type SubscriptionItem = {
  id: string
  subscription_id: string
  product_id: string
  quantity: number
  frequency_weeks: 1 | 2 | 4
  is_paused: boolean
  next_delivery_date: string
  created_at: string
  product?: Product
}
