export type FrequencyWeeks = 1 | 2 | 4;

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  vendor: string;
  category: string;
  goal: string[];
  unit: string;
  stock: number;
  is_active: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  frequency_weeks: FrequencyWeeks;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  status: 'active' | 'paused' | 'cancelled';
  delivery_day_preference: number; // 1=Monday ... 7=Sunday
  created_at: string;
  updated_at: string;
}

export interface SubscriptionItem {
  id: string;
  subscription_id: string;
  product_id: string;
  quantity: number;
  frequency_weeks: FrequencyWeeks;
  next_delivery_date: string;
  status: 'active' | 'paused' | 'skipped';
  product?: Product;
}

export type MarketplaceTab = 'all' | 'brand' | 'goal';

export interface DeliveryWeek {
  weekNumber: 1 | 2 | 3 | 4;
  startDate: Date;
  endDate: Date;
  items: SubscriptionItem[];
}
