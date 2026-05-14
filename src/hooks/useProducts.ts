import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'
import { PRODUCTS } from '../data/products'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      const url = import.meta.env.VITE_SUPABASE_URL
      if (!url) {
        setProducts(PRODUCTS)
        return
      }

      setLoading(true)
      try {
        const { data, error: err } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('name')

        if (err) throw err
        setProducts(data?.length ? data : PRODUCTS)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error loading products')
        setProducts(PRODUCTS)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading, error }
}
