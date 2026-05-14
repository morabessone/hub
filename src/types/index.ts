export type FrequencyWeeks = 1 | 2 | 4;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vendor: string;
  objective: string;
  image_url: string;
  unit: string;
  stock: number;
  tags: string[];
}

export interface CartItem {
  product: Product;
  frequency_weeks: FrequencyWeeks;
  quantity: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  delivery_day_preference: number; // 1=Mon … 7=Sun
  status: 'active' | 'paused' | 'cancelled';
  created_at: string;
}

export interface SubscriptionItem {
  id: string;
  subscription_id: string;
  product_id: string;
  product?: Product;
  frequency_weeks: FrequencyWeeks;
  next_delivery_date: string;
  status: 'active' | 'paused';
  quantity: number;
}

export type MarketplaceTab = 'all' | 'brand' | 'objective';
