import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { MOCK_PRODUCTS } from '../lib/mockData';
import { supabase } from '../lib/supabase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        setProducts(data && data.length > 0 ? (data as Product[]) : MOCK_PRODUCTS);
      } catch {
        // Fall back to mock data if Supabase is not configured
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}
