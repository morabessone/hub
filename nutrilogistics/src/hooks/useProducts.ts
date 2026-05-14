import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { MOCK_PRODUCTS } from '../lib/mockData';
import { fetchProducts } from '../lib/supabase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const hasSupabase =
        import.meta.env.VITE_SUPABASE_URL &&
        import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!hasSupabase) {
        // Demo mode – use local mock data
        await new Promise((r) => setTimeout(r, 400));
        setProducts(MOCK_PRODUCTS);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchProducts();
        setProducts(data ?? []);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los productos. Mostrando demo.');
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { products, loading, error };
}
