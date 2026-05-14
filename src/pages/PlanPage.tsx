import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Package,
  Pause,
  Play,
  RefreshCw,
  Pencil,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_SUBSCRIPTION_ITEMS } from '../lib/mockData';
import type { FrequencyWeeks, SubscriptionItem } from '../types';

const FREQUENCY_LABELS: Record<FrequencyWeeks, string> = {
  1: 'Semanal',
  2: 'Quincenal',
  4: 'Mensual',
};
const FREQUENCY_BADGE: Record<FrequencyWeeks, string> = {
  1: 'bg-green-100 text-green-700',
  2: 'bg-blue-100 text-blue-700',
  4: 'bg-purple-100 text-purple-700',
};

/** Returns which weeks (1-4) this item appears in */
function getActiveWeeks(freq: FrequencyWeeks): number[] {
  if (freq === 1) return [1, 2, 3, 4];
  if (freq === 2) return [1, 3];
  return [1]; // monthly
}

/** Build a DeliveryWeek summary from the subscription items */
function buildWeeks(items: SubscriptionItem[]) {
  const activeItems = items.filter((i) => i.status !== 'paused');
  const weeks: Array<{ week: number; items: SubscriptionItem[] }> = [1, 2, 3, 4].map((w) => ({
    week: w,
    items: activeItems.filter((i) => getActiveWeeks(i.frequency_weeks as FrequencyWeeks).includes(w)),
  }));
  return weeks;
}

function getWeekDateRange(weekOffset: number): string {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() + weekOffset * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

interface ItemRowProps {
  item: SubscriptionItem;
  onTogglePause: (id: string) => void;
  onChangeFrequency: (id: string, freq: FrequencyWeeks) => void;
}

function ItemRow({ item, onTogglePause, onChangeFrequency }: ItemRowProps) {
  const [editingFreq, setEditingFreq] = useState(false);
  const product = item.product;
  if (!product) return null;

  const isPaused = item.status === 'paused';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
        isPaused ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-100 shadow-sm'
      }`}
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              FREQUENCY_BADGE[item.frequency_weeks as FrequencyWeeks]
            }`}
          >
            {FREQUENCY_LABELS[item.frequency_weeks as FrequencyWeeks]}
          </span>
          <span className="text-xs text-gray-400">×{item.quantity}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditingFreq(!editingFreq)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          title="Editar frecuencia"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onTogglePause(item.id)}
          className={`p-1.5 rounded-lg transition-colors ${
            isPaused
              ? 'hover:bg-green-50 text-green-500'
              : 'hover:bg-orange-50 text-orange-500'
          }`}
          title={isPaused ? 'Reactivar' : 'Pausar'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Frequency editor */}
      <AnimatePresence>
        {editingFreq && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10"
          >
            <p className="text-xs font-semibold text-gray-500 mb-2">Cambiar frecuencia</p>
            <div className="flex gap-2">
              {([1, 2, 4] as FrequencyWeeks[]).map((freq) => (
                <button
                  key={freq}
                  onClick={() => {
                    onChangeFrequency(item.id, freq);
                    setEditingFreq(false);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    item.frequency_weeks === freq
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {FREQUENCY_LABELS[freq]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PlanPage() {
  const [items, setItems] = useState<SubscriptionItem[]>(MOCK_SUBSCRIPTION_ITEMS);

  const weeks = buildWeeks(items);
  const activeCount = items.filter((i) => i.status === 'active').length;
  const pausedCount = items.filter((i) => i.status === 'paused').length;

  const togglePause = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'paused' ? 'active' : 'paused' }
          : item
      )
    );
  };

  const changeFrequency = (id: string, freq: FrequencyWeeks) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, frequency_weeks: freq } : item))
    );
  };

  const weekColors = ['border-l-green-400', 'border-l-blue-400', 'border-l-purple-400', 'border-l-orange-400'];
  const weekBg = ['bg-green-50', 'bg-blue-50', 'bg-purple-50', 'bg-orange-50'];
  const weekText = ['text-green-700', 'text-blue-700', 'text-purple-700', 'text-orange-700'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Mi Plan de Entregas</h1>
              <p className="text-gray-500 mt-1">
                Alacena virtual — próximas 4 semanas
              </p>
            </div>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Agregar productos
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">{activeCount} productos activos</span>
            </div>
            {pausedCount > 0 && (
              <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-xl border border-orange-100">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{pausedCount} pausados</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Timeline ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-bold text-gray-800">Timeline de entregas</h2>
            </div>

            {weeks.map(({ week, items: weekItems }, idx) => (
              <motion.div
                key={week}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className={`bg-white rounded-2xl border-l-4 ${weekColors[idx]} border border-gray-100 shadow-sm overflow-hidden`}
              >
                <div className="p-4 border-b border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 ${weekBg[idx]} ${weekText[idx]} rounded-lg flex items-center justify-center text-sm font-bold`}>
                        {week}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Semana {week}</p>
                        <p className="text-xs text-gray-400">{getWeekDateRange(idx)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium">
                        {weekItems.length} producto{weekItems.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Frequency legend for this week */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {([1, 2, 4] as FrequencyWeeks[]).filter((f) =>
                      getActiveWeeks(f).includes(week)
                    ).map((f) => (
                      <span
                        key={f}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${FREQUENCY_BADGE[f]}`}
                      >
                        Incluye {FREQUENCY_LABELS[f]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4">
                  {weekItems.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      Sin entregas programadas esta semana
                    </p>
                  ) : (
                    <div className="space-y-2 relative">
                      {weekItems.map((item) => (
                        <ItemRow
                          key={item.id}
                          item={item}
                          onTogglePause={togglePause}
                          onChangeFrequency={changeFrequency}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Sidebar: All items ────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-bold text-gray-800">Todos los productos</h2>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;
                const isPaused = item.status === 'paused';
                return (
                  <motion.div key={item.id} layout className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400">${product.price.toFixed(2)} / entrega</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${FREQUENCY_BADGE[item.frequency_weeks as FrequencyWeeks]}`}>
                        {FREQUENCY_LABELS[item.frequency_weeks as FrequencyWeeks]}
                      </span>
                      <button
                        onClick={() => togglePause(item.id)}
                        className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                          isPaused
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        {isPaused ? '▶ Reactivar' : '⏸ Pausar'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick checkout card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white">
              <p className="text-sm font-bold mb-1">¿Todo listo?</p>
              <p className="text-xs text-gray-400 mb-4">
                Confirma tu plan y programa tus entregas.
              </p>
              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              >
                Ir al Checkout
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
