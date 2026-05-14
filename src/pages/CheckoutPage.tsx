import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Truck,
  CreditCard,
  CheckCircle2,
  Package,
  Calendar,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { calcNextDeliveryDate } from '../lib/supabase';
import type { FrequencyWeeks } from '../types';

const DELIVERY_DAYS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
];

const FREQ_LABEL: Record<FrequencyWeeks, string> = {
  1: 'Semanal',
  2: 'Quincenal',
  4: 'Mensual',
};

type Step = 'delivery' | 'review' | 'success';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, subtotal } = useCartStore();
  const [step, setStep] = useState<Step>('delivery');
  const [deliveryDay, setDeliveryDay] = useState(1);
  const [loading, setLoading] = useState(false);

  const sub = subtotal();

  const handleConfirm = async () => {
    setLoading(true);
    // Simulate API call (replace with real Supabase call)
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setStep('success');
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <p className="text-xl font-bold text-slate-800 mb-2">Tu suscripción está vacía</p>
          <p className="text-slate-500 text-sm mb-6">
            Agrega productos desde el Marketplace para continuar.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-all"
          >
            Ir al Marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 pb-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Steps indicator */}
        {step !== 'success' && (
          <div className="flex items-center gap-3 mb-8">
            {[
              { id: 'delivery', icon: Truck, label: 'Entrega' },
              { id: 'review', icon: Package, label: 'Revisar' },
            ].map((s, i) => {
              const isActive = step === s.id;
              const isDone =
                (step === 'review' && s.id === 'delivery');
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : isDone
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    {s.label}
                  </div>
                  {i < 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── Step 1: Delivery preferences ──────────────────────────── */}
          {step === 'delivery' && (
            <motion.div
              key="delivery"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">Preferencia de entrega</h2>
                    <p className="text-slate-500 text-sm">¿Qué día de la semana prefieres recibir tus pedidos?</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {DELIVERY_DAYS.map((day) => (
                    <motion.button
                      key={day.value}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeliveryDay(day.value)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                        deliveryDay === day.value
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {day.label}
                    </motion.button>
                  ))}
                </div>

                <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Primera entrega estimada
                    </p>
                    <p className="text-slate-500 text-sm">
                      {new Date(calcNextDeliveryDate(deliveryDay)).toLocaleDateString('es-MX', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep('review')}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-green-600 text-white rounded-full text-sm font-semibold transition-all"
                >
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Review ─────────────────────────────────────────── */}
          {step === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900">Revisar suscripción</h2>
                  <p className="text-slate-500 text-sm">
                    {items.length} producto{items.length > 1 ? 's' : ''} · Entrega preferida:{' '}
                    <strong className="text-slate-700">
                      {DELIVERY_DAYS.find((d) => d.value === deliveryDay)?.label}
                    </strong>
                  </p>
                </div>

                <div className="divide-y divide-slate-50">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 px-6 py-4">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {item.product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">{item.product.vendor}</span>
                          <span className="text-xs text-slate-300">·</span>
                          <span className="text-xs text-slate-500">x{item.quantity}</span>
                          <span className="text-xs text-slate-300">·</span>
                          <span className="text-xs font-medium text-slate-600">
                            {FREQ_LABEL[item.frequency_weeks]}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-slate-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-400">
                          Próxima: {calcNextDeliveryDate(deliveryDay)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal (semana 1)</span>
                    <span className="font-semibold text-slate-900">${sub.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Envío</span>
                    <span className="text-green-600 font-semibold">Gratis</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2 mt-2">
                    <span className="text-slate-900">Total</span>
                    <span className="text-slate-900">${sub.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment method (mock) */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-slate-500" />
                  <h3 className="font-semibold text-slate-900">Método de pago</h3>
                </div>
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl">
                  <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <span className="text-sm text-slate-700 font-medium">•••• •••• •••• 4242</span>
                  <span className="ml-auto text-xs text-slate-400">12/27</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('delivery')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-full text-sm font-medium transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex items-center gap-2 px-7 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-full text-sm font-bold transition-all shadow-md hover:shadow-green-200"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirmar suscripción
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Success ───────────────────────────────────────── */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </motion.div>

              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                ¡Suscripción activada!
              </h2>
              <p className="text-slate-500 text-base max-w-sm mx-auto mb-8 leading-relaxed">
                Tu alacena virtual está programada. Recibirás tus productos según la frecuencia
                que configuraste para cada uno.
              </p>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-sm mx-auto mb-8 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-slate-800">Resumen de entregas</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Primera entrega</span>
                    <span className="font-semibold text-slate-800">
                      {new Date(calcNextDeliveryDate(deliveryDay)).toLocaleDateString('es-MX', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Productos</span>
                    <span className="font-semibold text-slate-800">{items.length} ítems</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total semana 1</span>
                    <span className="font-bold text-slate-900">${sub.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => { clearCart(); navigate('/mi-plan'); }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  Ver mi plan
                </button>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-medium hover:border-slate-300 transition-all"
                >
                  Seguir comprando
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
