import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck,
  Check,
  ChevronLeft,
  CreditCard,
  MapPin,
  Calendar,
  Loader2,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import FrequencyBadge from '../components/FrequencyBadge';
import { calcNextDelivery, createSubscription, upsertSubscriptionItems } from '../lib/supabase';
import type { FrequencyWeeks } from '../types';

const DAY_OPTIONS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
];

const FREQ_MAP: Record<FrequencyWeeks, string> = {
  1: 'Semanal',
  2: 'Quincenal',
  4: 'Mensual',
};

export default function CheckoutPage() {
  const { items, deliveryDayPreference, setDeliveryDay, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<'review' | 'address' | 'confirm' | 'success'>('review');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [selectedDay, setSelectedDay] = useState(deliveryDayPreference);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 60 ? 0 : 4.99;
  const total = subtotal + shipping;
  const nextDelivery = calcNextDelivery(selectedDay);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const hasSupabase =
        import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (hasSupabase) {
        // Real Supabase flow - use a demo user_id
        const demoUserId = 'demo-user-' + Date.now();
        const sub = await createSubscription(demoUserId, selectedDay);
        const itemPayloads = items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          frequency_weeks: item.frequency_weeks,
          next_delivery_date: calcNextDelivery(selectedDay).toISOString().split('T')[0],
        }));
        await upsertSubscriptionItems(sub.id, itemPayloads);
      } else {
        // Demo mode
        await new Promise((r) => setTimeout(r, 1500));
      }

      setDeliveryDay(selectedDay);
      clearCart();
      setStep('success');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Carrito vacío</h2>
          <p className="text-gray-500">No tienes productos en tu suscripción todavía.</p>
        </div>
        <Link
          to="/marketplace"
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
        >
          Ir al Marketplace
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-xl shadow-brand-500/30"
        >
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center max-w-sm"
        >
          <h2 className="text-3xl font-black text-gray-900 mb-3">¡Suscripción creada!</h2>
          <p className="text-gray-500 leading-relaxed">
            Tu plan de entregas está activo. Primera entrega programada para el{' '}
            <span className="font-semibold text-gray-900">
              {nextDelivery.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
            .
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3"
        >
          <button
            onClick={() => navigate('/mi-plan')}
            className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Ver mi plan
          </button>
          <Link
            to="/marketplace"
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Seguir comprando
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link to="/marketplace" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mt-4">
            {(['review', 'address', 'confirm'] as const).map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? 'bg-gray-900 text-white'
                      : idx < ['review', 'address', 'confirm'].indexOf(step)
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {idx < ['review', 'address', 'confirm'].indexOf(step) ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className={`text-xs font-medium ${step === s ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s === 'review' ? 'Revisión' : s === 'address' ? 'Dirección' : 'Confirmar'}
                </span>
                {idx < 2 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main step content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-bold text-gray-900">Revisar suscripción</h2>
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.product.vendor} · {item.product.unit}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <FrequencyBadge weeks={item.frequency_weeks} />
                          <span className="text-xs text-gray-400">x{item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">/{FREQ_MAP[item.frequency_weeks].toLowerCase()}</p>
                      </div>
                    </div>
                  ))}

                  {/* Delivery day */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-500" />
                      Día de entrega preferido
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {DAY_OPTIONS.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => setSelectedDay(d.value)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                            selectedDay === d.value
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" />
                      Primera entrega:{' '}
                      <span className="font-semibold text-gray-700">
                        {calcNextDelivery(selectedDay).toLocaleDateString('es-MX', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => setStep('address')}
                    className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </motion.div>
              )}

              {step === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-500" />
                    Dirección de entrega
                  </h2>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Calle y número</label>
                      <input
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="Av. Insurgentes Sur 123"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Ciudad</label>
                        <input
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="Ciudad de México"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Estado</label>
                        <input
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          placeholder="CDMX"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Código Postal</label>
                      <input
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                        placeholder="06600"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-accent-500" />
                      Método de pago
                    </h3>
                    <div className="flex items-center gap-3 p-3 bg-accent-50 border border-accent-100 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Tarjeta guardada</p>
                        <p className="text-xs text-gray-400">•••• •••• •••• 4242</p>
                      </div>
                      <Check className="w-4 h-4 text-accent-600 ml-auto" />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('review')}
                      className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={() => setStep('confirm')}
                      className="flex-1 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      Revisar orden
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-bold text-gray-900">Confirmar suscripción</h2>

                  <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl border border-brand-100 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Plan de entregas activo</p>
                        <p className="text-sm text-gray-500">{items.length} productos · {DAY_OPTIONS.find(d => d.value === selectedDay)?.label}s</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 flex items-center gap-2">
                            <FrequencyBadge weeks={item.frequency_weeks} />
                            <span className="truncate max-w-[160px]">{item.product.name}</span>
                          </span>
                          <span className="font-semibold text-gray-900 flex-shrink-0">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('address')}
                      className="flex-1 py-3.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={loading}
                      className="flex-1 py-3.5 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Activar suscripción
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Resumen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  {shipping === 0 ? (
                    <span className="text-brand-600 font-semibold">Gratis</span>
                  ) : (
                    <span>${shipping.toFixed(2)}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Envío gratis en pedidos +$60
                  </p>
                )}
                <div className="border-t border-gray-100 pt-2 flex justify-between font-black text-gray-900 text-base">
                  <span>Total / entrega</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-brand-50 rounded-xl">
                <p className="text-xs font-semibold text-brand-700 flex items-center gap-1.5 mb-1">
                  <Truck className="w-3.5 h-3.5" />
                  Primera entrega
                </p>
                <p className="text-xs text-brand-600">
                  {calcNextDelivery(selectedDay).toLocaleDateString('es-MX', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
