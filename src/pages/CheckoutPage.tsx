import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  RefreshCw,
  Calendar,
  Truck,
  CheckCircle2,
  Minus,
  Plus,
  Trash2,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { calcNextDeliveryDate, DAY_NAMES, formatDate } from '../lib/deliveryDate';
import type { FrequencyWeeks } from '../types';

const FREQUENCY_LABELS: Record<FrequencyWeeks, string> = {
  1: 'Semanal',
  2: 'Quincenal',
  4: 'Mensual',
};

const FREQUENCY_PRICE_SUFFIX: Record<FrequencyWeeks, string> = {
  1: '/ sem',
  2: '/ 2 sem',
  4: '/ mes',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateQuantity,
    updateFrequency,
    clearCart,
    deliveryDayPreference,
    setDeliveryDayPreference,
    totalPrice,
  } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    // Build subscription payload (would normally call Supabase)
    const subscriptionPayload = {
      delivery_day_preference: deliveryDayPreference,
      status: 'active',
      items: items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
        frequency_weeks: i.frequency_weeks,
        next_delivery_date: calcNextDeliveryDate(
          deliveryDayPreference,
          i.frequency_weeks
        ).toISOString(),
      })),
    };

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1400));
    console.log('[NutriLogistics] Subscription payload:', subscriptionPayload);

    setIsSubmitting(false);
    setSuccess(true);
    clearCart();
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">¡Suscripción activada!</h2>
          <p className="text-gray-500 mb-2">
            Tu primera entrega está programada para el{' '}
            <span className="font-semibold text-gray-900">
              {DAY_NAMES[deliveryDayPreference]}
            </span>
            .
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Próxima entrega:{' '}
            {formatDate(calcNextDeliveryDate(deliveryDayPreference, 1))}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/plan"
              className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors"
            >
              Ver Mi Plan de Entregas
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/marketplace"
              className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Seguir comprando
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Tu suscripción está vacía</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Agrega productos desde el Marketplace para comenzar tu plan.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors"
          >
            Ir al Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const firstDelivery = calcNextDeliveryDate(deliveryDayPreference, 1);
  const monthlyTotal = items.reduce((sum, i) => {
    const multiplier = i.frequency_weeks === 1 ? 4 : i.frequency_weeks === 2 ? 2 : 1;
    return sum + i.product.price * i.quantity * multiplier;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Confirmar Suscripción</h1>
              <p className="text-gray-500 text-sm">{items.length} producto{items.length !== 1 ? 's' : ''} en tu plan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Product list ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-gray-800 mb-1">Tu plan de suscripción</h2>
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{item.product.vendor}</p>
                          <p className="text-sm font-semibold text-gray-900 leading-snug">{item.product.name}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Frequency */}
                        <div className="flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 text-gray-400" />
                          <div className="flex gap-1">
                            {([1, 2, 4] as FrequencyWeeks[]).map((freq) => (
                              <button
                                key={freq}
                                onClick={() => updateFrequency(item.product.id, freq)}
                                className={`px-2 py-1 text-xs rounded-lg font-medium transition-all ${
                                  item.frequency_weeks === freq
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                {FREQUENCY_LABELS[freq]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          Próxima entrega: {formatDate(calcNextDeliveryDate(deliveryDayPreference, item.frequency_weeks))}
                        </p>
                        <p className="text-sm font-bold text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}{' '}
                          <span className="text-xs text-gray-400 font-normal">
                            {FREQUENCY_PRICE_SUFFIX[item.frequency_weeks]}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order summary ─────────────────────────────── */}
          <div className="space-y-4">
            {/* Delivery day selector */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-bold text-gray-800">Día de entrega preferido</h3>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {Object.entries(DAY_NAMES).map(([day, label]) => (
                  <button
                    key={day}
                    onClick={() => setDeliveryDayPreference(Number(day))}
                    className={`py-2 rounded-xl text-xs font-medium transition-all ${
                      deliveryDayPreference === Number(day)
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label.slice(0, 3)}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Primera entrega: {formatDate(firstDelivery)}
              </p>
            </div>

            {/* Price summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Resumen</h3>
              <div className="space-y-2.5">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate max-w-[60%]">
                      {item.product.name} ×{item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2.5 flex justify-between text-sm">
                  <span className="text-gray-500">Total por entrega</span>
                  <span className="font-bold text-gray-900">${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Est. mensual</span>
                  <span className="font-bold text-gray-900">${monthlyTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  <span className="text-green-600 font-semibold">Gratis</span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.div>
                  Procesando…
                </>
              ) : (
                <>
                  Activar Suscripción
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
            <p className="text-center text-xs text-gray-400">
              Cancela o modifica en cualquier momento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
