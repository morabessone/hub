export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  vendor: string;
  goal: string; // 'muscle_gain' | 'fat_loss' | 'endurance' | 'wellness'
  category: string;
  unit: string;
  stock: number;
  rating: number;
  reviews_count: number;
}

export type FrequencyWeeks = 1 | 2 | 4;

export interface CartItem {
  product: Product;
  quantity: number;
  frequency_weeks: FrequencyWeeks;
}

export interface SubscriptionItem {
  id: string;
  subscription_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  frequency_weeks: FrequencyWeeks;
  next_delivery_date: string;
  is_paused: boolean;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  status: 'active' | 'paused' | 'cancelled';
  delivery_day_preference: number; // 0=Sunday, 1=Monday ... 6=Saturday
  created_at: string;
  items?: SubscriptionItem[];
}

export type GoalLabel = {
  key: string;
  label: string;
  color: string;
  emoji: string;
};
