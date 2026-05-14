export type FrequencyWeeks = 1 | 2 | 4;

export interface Product {
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
}

export interface CartItem {
  product: Product;
  frequency_weeks: FrequencyWeeks;
  quantity: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  status: 'active' | 'paused' | 'cancelled';
  delivery_day_preference: number;
  created_at: string;
  next_delivery_date: string;
}

export interface SubscriptionItem {
  id: string;
  subscription_id: string;
  product_id: string;
  quantity: number;
  frequency_weeks: FrequencyWeeks;
  is_paused: boolean;
  next_delivery_date: string;
  product?: Product;
}

export interface DeliveryWeek {
  weekNumber: 1 | 2 | 3 | 4;
  startDate: Date;
  endDate: Date;
  items: SubscriptionItem[];
}
