import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pause,
  Play,
  Edit3,
  Truck,
  Package,
  Check,
  X,
  ShoppingBag,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import FrequencyBadge from '../components/FrequencyBadge';
import type { CartItem, FrequencyWeeks } from '../types';
import { calcNextDelivery, addWeeks } from '../lib/supabase';

const FREQ_OPTIONS: { value: FrequencyWeeks; label: string }[] = [
  { value: 1, label: 'Semanal' },
  { value: 2, label: 'Quincenal' },
  { value: 4, label: 'Mensual' },
];

const FULL_DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function formatDate(d: Date) {
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function WeekCard({
  weekIndex,
  deliveryDate,
  items,
  pausedIds,
  onPause,
}: {
  weekIndex: number;
  deliveryDate: Date;
  items: CartItem[];
  pausedIds: Set<string>;
  onPause: (id: string) => void;
}) {
  const activeItems = items.filter((i) => !pausedIds.has(i.product.id));
  const subtotal = activeItems.reduce((s, i) => s + i.product.price * i.quantity, 0);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: weekIndex * 0.1 }}
      className="relative"
    >
      {/* Timeline connector */}
      {weekIndex < 3 && (
        <div className="absolute left-7 top-full w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent" />
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Week header */}
        <div className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0">
            S{weekIndex + 1}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">
              Semana {weekIndex + 1}
              {weekIndex === 0 && (
                <span className="ml-2 text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  Próxima
                </span>
              )}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {formatDate(deliveryDate)}
            </p>
          </div>
          <div className="text-right">
            {activeItems.length > 0 ? (
              <>
                <p className="text-base font-black text-gray-900">${subtotal.toFixed(2)}</p>
                <p className="text-xs text-gray-400">{activeItems.length} ítem{activeItems.length !== 1 ? 's' : ''}</p>
              </>
            ) : (
              <span className="text-xs text-gray-400">Sin entregas</span>
            )}
          </div>
        </div>

        {/* Items list */}
        <div className="divide-y divide-gray-50">
          {items.map((item) => {
            const paused = pausedIds.has(item.product.id);
            return (
              <div
                key={item.product.id}
                className={`flex items-center gap-3 px-5 py-3.5 transition-opacity ${paused ? 'opacity-40' : ''}`}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <FrequencyBadge weeks={item.frequency_weeks} />
                    <span className="text-xs text-gray-400">x{item.quantity}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => onPause(item.product.id)}
                    className={`mt-1 text-xs flex items-center gap-0.5 ${
                      paused ? 'text-brand-600 hover:text-brand-700' : 'text-gray-400 hover:text-gray-600'
                    } transition-colors`}
                  >
                    {paused ? (
                      <><Play className="w-3 h-3" /> Reactivar</>
                    ) : (
                      <><Pause className="w-3 h-3" /> Pausar</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {activeItems.length === 0 && (
          <div className="px-5 py-4 text-center text-xs text-gray-400">
            Todos los ítems pausados para esta semana
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FrequencyEditor({
  item,
  onSave,
  onClose,
}: {
  item: CartItem;
  onSave: (freq: FrequencyWeeks) => void;
  onClose: () => void;
}) {
  const [freq, setFreq] = useState<FrequencyWeeks>(item.frequency_weeks);
  const [qty, setQty] = useState(item.quantity);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Editar frecuencia</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.name}</p>
              <p className="text-xs text-gray-400">{item.product.vendor}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">FRECUENCIA</p>
            <div className="grid grid-cols-3 gap-2">
              {FREQ_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFreq(opt.value)}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    freq === opt.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">CANTIDAD</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold"
              >
                −
              </button>
              <span className="flex-1 text-center font-black text-xl text-gray-900">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(freq)}
            className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SubscriptionPage() {
  const { items, updateFrequency, removeItem, deliveryDayPreference } = useCartStore();
  const [pausedIds, setPausedIds] = useState<Set<string>>(new Set());
  const [editItem, setEditItem] = useState<CartItem | null>(null);

  const togglePause = (id: string) => {
    setPausedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Build 4-week timeline
  const weeks = useMemo(() => {
    const baseDate = calcNextDelivery(deliveryDayPreference);
    return [0, 1, 2, 3].map((weekOffset) => {
      const deliveryDate = addWeeks(baseDate, weekOffset);
      const weekNumber = weekOffset + 1; // 1-based

      const weekItems = items.filter((item) => {
        const freq = item.frequency_weeks;
        if (freq === 1) return true;
        if (freq === 2) return weekNumber === 1 || weekNumber === 3;
        if (freq === 4) return weekNumber === 1;
        return false;
      });

      return { weekOffset, deliveryDate, items: weekItems };
    });
  }, [items, deliveryDayPreference]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Tu plan está vacío</h2>
          <p className="text-gray-500 max-w-xs">
            Agrega productos desde el Marketplace para ver tu timeline de entregas aquí.
          </p>
        </div>
        <Link
          to="/marketplace"
          className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Ir al Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-900">Mi Plan de Entregas</h1>
              <p className="text-gray-500 mt-1">
                Entregas los {FULL_DAY_NAMES[deliveryDayPreference]} · {items.length} producto
                {items.length !== 1 ? 's' : ''} activo{items.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Link
              to="/checkout"
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-sm text-sm"
            >
              <Truck className="w-4 h-4" />
              Confirmar plan
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-white" />
              </div>
              <h2 className="font-bold text-gray-900">Próximas 4 semanas</h2>
            </div>

            {weeks.map(({ weekOffset, deliveryDate, items: weekItems }) => (
              <WeekCard
                key={weekOffset}
                weekIndex={weekOffset}
                deliveryDate={deliveryDate}
                items={weekItems}
                pausedIds={pausedIds}
                onPause={togglePause}
              />
            ))}
          </div>

          {/* Sidebar: all items management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                <Edit3 className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <h2 className="font-bold text-gray-900">Gestionar items</h2>
            </div>

            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400">{item.product.vendor}</p>
                    <div className="mt-1.5">
                      <FrequencyBadge weeks={item.frequency_weeks} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditItem(item)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Edit3 className="w-3 h-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => togglePause(item.product.id)}
                    className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 border rounded-lg transition-colors font-medium ${
                      pausedIds.has(item.product.id)
                        ? 'border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pausedIds.has(item.product.id) ? (
                      <><Play className="w-3 h-3" /> Activar</>
                    ) : (
                      <><Pause className="w-3 h-3" /> Pausar</>
                    )}
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-1.5 border border-red-100 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit frequency modal */}
      <AnimatePresence>
        {editItem && (
          <FrequencyEditor
            item={editItem}
            onSave={(freq) => {
              updateFrequency(editItem.product.id, freq);
              setEditItem(null);
            }}
            onClose={() => setEditItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
