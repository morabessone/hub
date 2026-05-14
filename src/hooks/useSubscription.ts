import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { SubscriptionItem, UserSubscription } from '../lib/supabase'

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [items, setItems] = useState<SubscriptionItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchSubscription() {
      const url = import.meta.env.VITE_SUPABASE_URL
      if (!url) return

      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: sub } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()

        if (!sub) return

        setSubscription(sub)

        const { data: subItems } = await supabase
          .from('subscription_items')
          .select('*, product:products(*)')
          .eq('subscription_id', sub.id)

        if (subItems) setItems(subItems)
      } catch {
        // silently fail when Supabase is not configured
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  const pauseItem = async (itemId: string) => {
    const { error } = await supabase
      .from('subscription_items')
      .update({ is_paused: true })
      .eq('id', itemId)

    if (!error) {
      setItems(prev =>
        prev.map(i => (i.id === itemId ? { ...i, is_paused: true } : i))
      )
    }
  }

  const resumeItem = async (itemId: string) => {
    const { error } = await supabase
      .from('subscription_items')
      .update({ is_paused: false })
      .eq('id', itemId)

    if (!error) {
      setItems(prev =>
        prev.map(i => (i.id === itemId ? { ...i, is_paused: false } : i))
      )
    }
  }

  const updateFrequency = async (itemId: string, frequency: 1 | 2 | 4) => {
    const { error } = await supabase
      .from('subscription_items')
      .update({ frequency_weeks: frequency })
      .eq('id', itemId)

    if (!error) {
      setItems(prev =>
        prev.map(i => (i.id === itemId ? { ...i, frequency_weeks: frequency } : i))
      )
    }
  }

  return { subscription, items, loading, pauseItem, resumeItem, updateFrequency }
}
