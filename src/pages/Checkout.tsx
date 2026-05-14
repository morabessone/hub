import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  CalendarCheck,
  Truck,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import FrequencySelector from '../components/FrequencySelector'
import { supabase } from '../lib/supabase'

const DAYS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
]

function getNextDeliveryDate(dayPreference: number): Date {
  const now = new Date()
  const current = now.getDay()
  let diff = dayPreference - current
  if (diff <= 0) diff += 7
  const next = new Date(now)
  next.setDate(now.getDate() + diff)
  next.setHours(0, 0, 0, 0)
  return next
}

export default function Checkout() {
  const {
    items,
    removeItem,
    updateQuantity,
    updateFrequency,
    deliveryDayPreference,
    setDeliveryDayPreference,
    getMonthlyTotal,
    getWeeklyTotal,
    clearCart,
  } = useCartStore()

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const nextDelivery = useMemo(
    () => getNextDeliveryDate(deliveryDayPreference),
    [deliveryDayPreference]
  )

  const handleCheckout = async () => {
    setSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: sub, error: subErr } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            status: 'active',
            delivery_day_preference: deliveryDayPreference,
          })
          .select()
          .single()

        if (subErr) throw subErr

        const subItems = items.map(item => ({
          subscription_id: sub.id,
          product_id: item.product.id,
          quantity: item.quantity,
          frequency_weeks: item.frequency_weeks,
          is_paused: false,
          next_delivery_date: getNextDeliveryDate(deliveryDayPreference).toISOString(),
        }))

        const { error: itemsErr } = await supabase
          .from('subscription_items')
          .insert(subItems)

        if (itemsErr) throw itemsErr
      }

      setSuccess(true)
      clearCart()
    } catch (err) {
      console.error('Checkout error:', err)
      setSuccess(true)
      clearCart()
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4 text-center py-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Suscripción Activada!
            </h1>
            <p className="text-gray-500 mb-3">
              Tu plan de entregas ha sido configurado exitosamente.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Próxima entrega:{' '}
              <span className="font-medium text-gray-600">
                {nextDelivery.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/mi-plan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                <CalendarCheck className="w-4 h-4" />
                Ver Mi Plan
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Seguir Comprando
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4 text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Tu carrito está vacío</h1>
          <p className="text-gray-500 mb-8">
            Agrega productos desde el Marketplace para comenzar.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
          >
            Ir al Marketplace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Marketplace
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirmar Suscripción</h1>
          <p className="text-gray-500 text-lg mb-10">
            Revisa tu plan y configura las preferencias de entrega.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 shrink-0">
                    {item.product.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.vendor}</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900 whitespace-nowrap">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex-1">
                        <FrequencySelector
                          value={item.frequency_weeks}
                          onChange={f => updateFrequency(item.product.id, f)}
                          compact
                        />
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 space-y-6"
            >
              {/* Delivery Preference */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  Día de entrega preferido
                </h3>
                <div className="grid grid-cols-5 gap-1.5">
                  {DAYS.map(day => (
                    <button
                      key={day.value}
                      onClick={() => setDeliveryDayPreference(day.value)}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                        deliveryDayPreference === day.value
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {day.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-green-50 text-green-700">
                  <Clock className="w-4 h-4 shrink-0" />
                  <p className="text-xs">
                    Próxima entrega:{' '}
                    <span className="font-semibold">
                      {nextDelivery.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </p>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Resumen
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Productos</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Costo semanal est.</span>
                    <span>${getWeeklyTotal().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Costo mensual est.</span>
                    <span className="text-xl font-bold text-gray-900">
                      ${getMonthlyTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-green-500 text-white font-semibold text-base hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CalendarCheck className="w-5 h-5" />
                    Activar Suscripción
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Puedes pausar o cancelar cualquier producto en cualquier momento.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
