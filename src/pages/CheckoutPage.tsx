import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Truck,
  Calendar,
  CreditCard,
  ChevronRight,
  Package,
  RefreshCw,
  Leaf,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { supabase } from '../lib/supabase';
import { nextDeliveryDate } from '../hooks/useSubscription';
import type { FrequencyWeeks } from '../types';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const FREQ_LABELS: Record<FrequencyWeeks, string> = {
  1: 'Semanal',
  2: 'Quincenal',
  4: 'Mensual',
};

type CheckoutStep = 'review' | 'delivery' | 'payment' | 'success';

interface DeliveryForm {
  name: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  deliveryDay: number;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>('review');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<DeliveryForm>({
    name: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    deliveryDay: 2, // Tuesday by default
  });

  const total = totalPrice();
  const nextDelivery = nextDeliveryDate(form.deliveryDay);

  function updateForm(field: keyof DeliveryForm, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleConfirmSubscription() {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      // Get current user (or use anonymous)
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id ?? `anon-${Date.now()}`;

      // Create user_subscription record
      const { data: subscription, error: subError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          status: 'active',
          delivery_day_preference: form.deliveryDay,
          next_delivery_date: nextDelivery.toISOString(),
        })
        .select()
        .single();

      if (subError) throw subError;

      // Create subscription_items records
      const itemsToInsert = items.map((item) => ({
        subscription_id: subscription.id,
        product_id: item.product.id,
        quantity: item.quantity,
        frequency_weeks: item.frequency_weeks,
        is_paused: false,
        next_delivery_date: nextDelivery.toISOString(),
      }));

      const { error: itemsError } = await supabase
        .from('subscription_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      clearCart();
      setStep('success');
    } catch (err) {
      // If Supabase not configured, still show success for demo
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      if (msg.includes('placeholder') || msg.includes('relation') || msg.includes('does not exist')) {
        clearCart();
        setStep('success');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  const steps: CheckoutStep[] = ['review', 'delivery', 'payment'];
  const stepLabels = ['Resumen', 'Entrega', 'Pago'];
  const stepIdx = steps.indexOf(step);

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Suscripción activa!</h2>
          <p className="text-gray-500 mb-2">
            Tu alacena inteligente está programada. Recibirás tus primeros productos el:
          </p>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8">
            <p className="text-green-700 font-semibold text-lg">
              {nextDelivery.toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/my-plan">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Ver mi Plan de Entregas
              </motion.button>
            </Link>
            <Link to="/marketplace">
              <button className="w-full py-3 border border-gray-200 rounded-2xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm">
                Seguir comprando
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sin productos en tu suscripción</h2>
          <p className="text-gray-500 mb-8">Agrega productos desde el Marketplace para continuar.</p>
          <Link to="/marketplace">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-semibold transition-colors">
              Ir al Marketplace →
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress steps */}
        {(step as string) !== 'success' && (
          <div className="flex items-center justify-center gap-0 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    stepIdx === i
                      ? 'bg-green-500 text-white'
                      : stepIdx > i
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {stepIdx > i ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                  )}
                  {stepLabels[i]}
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Review */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-500" />
                    <h2 className="font-semibold text-gray-900">Tu suscripción</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {items.map((item) => (
                      <div key={item.product.id} className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0">
                          {item.product.vendor === 'Optimum Nutrition' ? '💪' :
                           item.product.vendor === 'Garden of Life' ? '🌿' :
                           item.product.vendor === 'NOW Foods' ? '🧴' : '⚡'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{item.product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{item.product.vendor}</span>
                            <span className="text-xs text-gray-300">·</span>
                            <span className="text-xs text-gray-500">× {item.quantity}</span>
                            <span className="text-xs text-gray-300">·</span>
                            <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              <RefreshCw className="w-3 h-3" />
                              {FREQ_LABELS[item.frequency_weeks]}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-gray-900 text-sm">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">/{item.product.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <OrderSummary total={total} onNext={() => setStep('delivery')} nextLabel="Continuar a entrega" />
            </motion.div>
          )}

          {/* STEP 2: Delivery */}
          {step === 'delivery' && (
            <motion.div
              key="delivery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Truck className="w-5 h-5 text-green-500" />
                    <h2 className="font-semibold text-gray-900">Datos de entrega</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { field: 'name' as const, label: 'Nombre completo', placeholder: 'Juan García' },
                      { field: 'phone' as const, label: 'Teléfono', placeholder: '+52 555 000 0000' },
                      { field: 'address' as const, label: 'Dirección', placeholder: 'Calle, Número, Col.' },
                      { field: 'city' as const, label: 'Ciudad', placeholder: 'Ciudad de México' },
                      { field: 'zip' as const, label: 'Código postal', placeholder: '06600' },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field} className={field === 'address' ? 'sm:col-span-2' : ''}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                        <input
                          type="text"
                          value={form[field]}
                          onChange={(e) => updateForm(field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery day preference */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <h2 className="font-semibold text-gray-900">Día preferido de entrega</h2>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {DAY_NAMES.map((day, i) => (
                      <button
                        key={day}
                        onClick={() => updateForm('deliveryDay', i)}
                        className={`py-3 rounded-xl text-xs font-medium transition-all border ${
                          form.deliveryDay === i
                            ? 'bg-green-500 text-white border-green-500 shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  {form.deliveryDay !== undefined && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-2"
                    >
                      <Leaf className="w-4 h-4 text-green-500 shrink-0" />
                      <p className="text-sm text-green-700">
                        Primera entrega estimada:{' '}
                        <strong>
                          {nextDelivery.toLocaleDateString('es-MX', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </strong>
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              <OrderSummary
                total={total}
                onNext={() => setStep('payment')}
                onBack={() => setStep('review')}
                nextLabel="Continuar a pago"
              />
            </motion.div>
          )}

          {/* STEP 3: Payment */}
          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <h2 className="font-semibold text-gray-900">Método de pago</h2>
                  </div>

                  {/* Demo payment UI */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Número de tarjeta
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition pr-12"
                        />
                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Fecha de expiración
                        </label>
                        <input
                          type="text"
                          placeholder="MM / AA"
                          maxLength={7}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nombre en la tarjeta
                      </label>
                      <input
                        type="text"
                        placeholder="Juan García"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                      />
                    </div>
                  </div>

                  <div className="mt-5 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700">
                      Ambiente demo. No se procesará ningún cobro real. Para producción, integra Stripe o Conekta.
                    </p>
                  </div>

                  {error && (
                    <div className="mt-3 p-3 bg-red-50 rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-700">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <OrderSummary
                  total={total}
                  onNext={handleConfirmSubscription}
                  onBack={() => setStep('delivery')}
                  nextLabel={loading ? 'Procesando...' : 'Confirmar suscripción'}
                  disabled={loading}
                  highlight
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function OrderSummary({
  total,
  onNext,
  onBack,
  nextLabel,
  disabled,
  highlight,
}: {
  total: number;
  onNext: () => void;
  onBack?: () => void;
  nextLabel: string;
  disabled?: boolean;
  highlight?: boolean;
}) {
  const items = useCartStore((s) => s.items);
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 ${highlight ? 'border-green-200 shadow-green-100' : 'border-gray-100'}`}>
      <h3 className="font-semibold text-gray-900 mb-4">Resumen</h3>
      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span className="text-gray-500 truncate flex-1 mr-2">
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium text-gray-700 shrink-0">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3 mb-5">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total mensual</span>
          <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Se cobra mensualmente según frecuencia elegida</p>
      </div>
      {onBack && (
        <button
          onClick={onBack}
          className="w-full mb-2 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
        >
          ← Volver
        </button>
      )}
      <motion.button
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        onClick={onNext}
        disabled={disabled}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          disabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md'
        }`}
      >
        {nextLabel}
        {!disabled && <ChevronRight className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}
