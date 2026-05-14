import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Pause,
  Play,
  RefreshCw,
  Package,
  ShoppingBag,
  ChevronRight,
  Truck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import type { FrequencyWeeks, SubscriptionItem } from '../types';
import { useCartStore } from '../store/useCartStore';

const WEEK_LABELS = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
const WEEK_COLORS = [
  'from-green-500 to-emerald-600',
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-orange-500 to-orange-600',
];
const WEEK_BG = ['bg-green-50', 'bg-blue-50', 'bg-purple-50', 'bg-orange-50'];
const WEEK_BORDER = ['border-green-200', 'border-blue-200', 'border-purple-200', 'border-orange-200'];
const WEEK_TEXT = ['text-green-700', 'text-blue-700', 'text-purple-700', 'text-orange-700'];

const FREQ_LABELS: Record<FrequencyWeeks, string> = {
  1: 'Semanal',
  2: 'Quincenal',
  4: 'Mensual',
};

const FREQ_COLORS: Record<FrequencyWeeks, string> = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-blue-100 text-blue-700',
  4: 'bg-purple-100 text-purple-700',
};

function formatDate(date: Date) {
  return date.toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' });
}

function SubscriptionItemRow({
  item,
  onTogglePause,
  onChangeFrequency,
}: {
  item: SubscriptionItem;
  onTogglePause: (id: string) => void;
  onChangeFrequency: (id: string, freq: FrequencyWeeks) => void;
}) {
  const [editingFreq, setEditingFreq] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: item.is_paused ? 0.5 : 1, x: 0 }}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        item.is_paused ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100 shadow-sm'
      }`}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-lg shrink-0">
        {item.product?.vendor === 'Optimum Nutrition' ? '💪' :
         item.product?.vendor === 'Garden of Life' ? '🌿' :
         item.product?.vendor === 'NOW Foods' ? '🧴' : '⚡'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {item.product?.name ?? `Producto #${item.product_id}`}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${FREQ_COLORS[item.frequency_weeks as FrequencyWeeks]}`}>
            {FREQ_LABELS[item.frequency_weeks as FrequencyWeeks]}
          </span>
          <span className="text-xs text-gray-400">× {item.quantity}</span>
          {item.product && (
            <span className="text-xs text-gray-400">${(item.product.price * item.quantity).toFixed(2)}</span>
          )}
        </div>

        {/* Frequency editor */}
        <AnimatePresence>
          {editingFreq && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex gap-1.5"
            >
              {([1, 2, 4] as FrequencyWeeks[]).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    onChangeFrequency(item.id, f);
                    setEditingFreq(false);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    item.frequency_weeks === f
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-green-300'
                  }`}
                >
                  {FREQ_LABELS[f]}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditingFreq(!editingFreq)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
          title="Editar frecuencia"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onTogglePause(item.id)}
          className={`p-1.5 rounded-lg transition-colors ${
            item.is_paused
              ? 'text-green-500 hover:bg-green-50'
              : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
          }`}
          title={item.is_paused ? 'Reanudar' : 'Pausar'}
        >
          {item.is_paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>
    </motion.div>
  );
}

export default function MyPlanPage() {
  const { subscriptionItems, schedule, togglePause } = useSubscription();
  const updateFrequency = useCartStore((s) => s.updateFrequency);
  const totalItems = useCartStore((s) => s.totalItems());

  const handleChangeFrequency = (itemId: string, freq: FrequencyWeeks) => {
    const item = subscriptionItems.find((i) => i.id === itemId);
    if (item) {
      updateFrequency(item.product_id, freq);
    }
  };

  const totalMonthly = subscriptionItems.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  if (subscriptionItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Tu alacena está vacía</h2>
          <p className="text-gray-500 mb-8">
            Agrega productos desde el Marketplace y programa tus entregas inteligentes.
          </p>
          <Link to="/marketplace">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-2xl font-semibold mx-auto transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Ir al Marketplace
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-500" />
                Mi Plan de Entregas
              </h1>
              <p className="text-gray-500 mt-1">
                {totalItems} productos · Próximas 4 semanas programadas
              </p>
            </div>
            <Link to="/checkout">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm"
              >
                <Truck className="w-4 h-4" />
                Confirmar Plan
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-white" />
              </span>
              Timeline de Entregas
            </h2>

            {/* Timeline connector */}
            <div className="relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-green-200 via-blue-200 to-orange-200" />

              <div className="space-y-6">
                {schedule.map((week, idx) => (
                  <motion.div
                    key={week.weekNumber}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-14"
                  >
                    {/* Week dot */}
                    <div className={`absolute left-3.5 top-4 w-5 h-5 rounded-full bg-gradient-to-br ${WEEK_COLORS[idx]} shadow-md flex items-center justify-center`}>
                      <span className="text-white text-[9px] font-bold">{week.weekNumber}</span>
                    </div>

                    <div className={`rounded-2xl border ${WEEK_BORDER[idx]} ${WEEK_BG[idx]} overflow-hidden`}>
                      {/* Week header */}
                      <div className="px-5 py-3 border-b border-white/60 flex items-center justify-between">
                        <div>
                          <h3 className={`font-semibold ${WEEK_TEXT[idx]}`}>
                            {WEEK_LABELS[idx]}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDate(week.startDate)} — {formatDate(week.endDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${WEEK_TEXT[idx]} bg-white/70 px-2.5 py-1 rounded-full`}>
                            {week.items.length} productos
                          </span>
                          {week.items.length > 0 && (
                            <span className={`text-xs font-bold ${WEEK_TEXT[idx]}`}>
                              ${week.items.reduce((s, i) => s + (i.product?.price ?? 0) * i.quantity, 0).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Week items */}
                      <div className="p-4">
                        {week.items.length === 0 ? (
                          <p className="text-sm text-gray-400 text-center py-3">
                            Sin entregas esta semana
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {week.items.map((item) => (
                              <SubscriptionItemRow
                                key={item.id}
                                item={item}
                                onTogglePause={togglePause}
                                onChangeFrequency={handleChangeFrequency}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-5">
            {/* Summary card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Resumen del plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Productos activos</span>
                  <span className="font-medium text-gray-900">
                    {subscriptionItems.filter((i) => !i.is_paused).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pausados</span>
                  <span className="font-medium text-gray-900">
                    {subscriptionItems.filter((i) => i.is_paused).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Entrega semanal</span>
                  <span className="font-medium text-gray-900">
                    {subscriptionItems.filter((i) => i.frequency_weeks === 1).length} productos
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Entrega quincenal</span>
                  <span className="font-medium text-gray-900">
                    {subscriptionItems.filter((i) => i.frequency_weeks === 2).length} productos
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Entrega mensual</span>
                  <span className="font-medium text-gray-900">
                    {subscriptionItems.filter((i) => i.frequency_weeks === 4).length} productos
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-700">Costo mensual est.</span>
                  <span className="font-bold text-gray-900">${totalMonthly.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* All items list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Todos los productos</h3>
              <div className="space-y-2">
                {subscriptionItems.map((item) => (
                  <SubscriptionItemRow
                    key={item.id}
                    item={item}
                    onTogglePause={togglePause}
                    onChangeFrequency={handleChangeFrequency}
                  />
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <Link to="/checkout" className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                <Truck className="w-5 h-5" />
                Confirmar y pagar
              </motion.button>
            </Link>

            <Link to="/marketplace" className="block">
              <button className="w-full py-3 border border-gray-200 text-gray-600 rounded-2xl font-medium hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Agregar más productos
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
