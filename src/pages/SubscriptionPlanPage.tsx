import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  PauseCircle,
  PlayCircle,
  Pencil,
  ShoppingBag,
  Calendar,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import FrequencySelector from '../components/FrequencySelector';
import type { FrequencyWeeks } from '../types';

function getWeekLabel(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset * 7);
  return d.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const WEEK_COLORS = [
  { bg: 'bg-green-500', light: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', dot: 'bg-green-500' },
  { bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
  { bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
  { bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
];

export default function SubscriptionPlanPage() {
  const { items, updateFrequency, removeItem } = useCartStore();
  const [paused, setPaused] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);

  const togglePause = (id: string) => {
    setPaused((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Map week number (1-indexed) -> items that appear in that week
  // Week 1: all freqs (1, 2, 4)
  // Week 2: freq 1 only
  // Week 3: freq 1 and 2
  // Week 4: freq 1 only
  const weekItems = useMemo(() => {
    const activeItems = items.filter((i) => !paused.has(i.product.id));
    return [
      activeItems.filter((i) => [1, 2, 4].includes(i.frequency_weeks)), // week 1
      activeItems.filter((i) => i.frequency_weeks === 1),                // week 2
      activeItems.filter((i) => [1, 2].includes(i.frequency_weeks)),    // week 3
      activeItems.filter((i) => i.frequency_weeks === 1),                // week 4
    ];
  }, [items, paused]);

  const pausedItems = useMemo(
    () => items.filter((i) => paused.has(i.product.id)),
    [items, paused]
  );

  const weeklyTotal = useMemo(
    () =>
      items
        .filter((i) => !paused.has(i.product.id))
        .reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    [items, paused]
  );

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Inbox className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tu plan está vacío</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Agrega productos desde el Marketplace para programar tus entregas.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-green-600 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Ir al Marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 pb-24 bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-500" />
                Mi Plan de Entregas
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {items.length} producto{items.length > 1 ? 's' : ''} programado
                {items.length > 1 ? 's' : ''} · Próximas 4 semanas
              </p>
            </div>
            <Link
              to="/checkout"
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-green-200 hover:shadow-md whitespace-nowrap"
            >
              Confirmar plan
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Summary chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs font-medium text-green-700">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              {items.filter((i) => i.frequency_weeks === 1).length} semanal
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              {items.filter((i) => i.frequency_weeks === 2).length} quincenal
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              {items.filter((i) => i.frequency_weeks === 4).length} mensual
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
              Total estimado: ${weeklyTotal.toFixed(2)} / semana
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* ── 4-Week Timeline ─────────────────────────────────────────── */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Timeline — Próximas 4 semanas
          </h2>

          <div className="space-y-4">
            {weekItems.map((wItems, wi) => {
              const colors = WEEK_COLORS[wi];
              const weekDate = getWeekLabel(wi);
              return (
                <motion.div
                  key={wi}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: wi * 0.1 }}
                  className="flex gap-4"
                >
                  {/* Week indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${colors.bg} text-white flex items-center justify-center font-bold text-sm shadow-md`}
                    >
                      {wi + 1}
                    </div>
                    {wi < 3 && <div className="w-0.5 flex-1 bg-slate-200 my-2" />}
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-2">
                    <div className={`px-5 py-3 ${colors.light} border-b ${colors.border} flex items-center justify-between`}>
                      <div>
                        <span className={`text-sm font-bold ${colors.text}`}>
                          Semana {wi + 1}
                        </span>
                        <span className="text-slate-400 text-xs ml-2">· {weekDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {wi === 0 && (
                          <>
                            <FreqChip label="Semanal" color="green" />
                            <FreqChip label="Quincenal" color="blue" />
                            <FreqChip label="Mensual" color="purple" />
                          </>
                        )}
                        {wi === 1 && <FreqChip label="Semanal" color="green" />}
                        {wi === 2 && (
                          <>
                            <FreqChip label="Semanal" color="green" />
                            <FreqChip label="Quincenal" color="blue" />
                          </>
                        )}
                        {wi === 3 && <FreqChip label="Semanal" color="green" />}
                      </div>
                    </div>

                    {wItems.length === 0 ? (
                      <div className="px-5 py-6 text-center text-slate-400 text-sm">
                        No hay entregas esta semana
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50">
                        {wItems.map((item) => {
                          const isEditing = editingId === item.product.id;
                          return (
                            <div key={item.product.id} className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-800 truncate">
                                    {item.product.name}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {item.product.vendor} · x{item.quantity}
                                  </p>
                                </div>
                                <span className="text-sm font-bold text-slate-900 shrink-0">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => setEditingId(isEditing ? null : item.product.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                    title="Editar frecuencia"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <AnimatePresence>
                                {isEditing && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-3 pb-1">
                                      <p className="text-xs text-slate-500 mb-2 font-medium">
                                        Cambiar frecuencia:
                                      </p>
                                      <FrequencySelector
                                        value={item.frequency_weeks}
                                        onChange={(v) => {
                                          updateFrequency(item.product.id, v);
                                          setEditingId(null);
                                        }}
                                        compact
                                      />
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {wItems.length > 0 && (
                      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {wItems.length} ítem{wItems.length > 1 ? 's' : ''}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          ${wItems
                            .reduce((a, i) => a + i.product.price * i.quantity, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── All Items Manager ───────────────────────────────────────── */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Gestionar productos
          </h2>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {items.map((item, idx) => {
              const isPaused = paused.has(item.product.id);
              const isEditing = editingId === `manage-${item.product.id}`;
              return (
                <div
                  key={item.product.id}
                  className={`${idx > 0 ? 'border-t border-slate-100' : ''}`}
                >
                  <div className="flex items-center gap-4 px-5 py-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className={`w-12 h-12 rounded-xl object-cover shrink-0 ${isPaused ? 'opacity-40 grayscale' : ''}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-semibold truncate ${isPaused ? 'text-slate-400' : 'text-slate-900'}`}>
                          {item.product.name}
                        </p>
                        {isPaused && (
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full border border-slate-200 font-medium">
                            Pausado
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{item.product.vendor}</span>
                        <span className="text-slate-200">·</span>
                        <FreqBadge freq={item.frequency_weeks} />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditingId(isEditing ? null : `manage-${item.product.id}`)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Editar frecuencia"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => togglePause(item.product.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isPaused
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-amber-500 hover:bg-amber-50'
                        }`}
                        title={isPaused ? 'Reanudar' : 'Pausar'}
                      >
                        {isPaused ? (
                          <PlayCircle className="w-4 h-4" />
                        ) : (
                          <PauseCircle className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors text-xs"
                        title="Eliminar del plan"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isEditing && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4">
                          <FrequencySelector
                            value={item.frequency_weeks}
                            onChange={(v) => {
                              updateFrequency(item.product.id, v as FrequencyWeeks);
                              setEditingId(null);
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {pausedItems.length > 0 && (
              <div className="px-5 py-3 bg-amber-50 border-t border-amber-100 text-xs text-amber-700 font-medium">
                <Package className="w-3.5 h-3.5 inline mr-1.5" />
                {pausedItems.length} producto{pausedItems.length > 1 ? 's' : ''} pausado
                {pausedItems.length > 1 ? 's' : ''} — no aparecerán en el timeline
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function FreqChip({ label, color }: { label: string; color: 'green' | 'blue' | 'purple' }) {
  const cls = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  }[color];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
  );
}

function FreqBadge({ freq }: { freq: FrequencyWeeks }) {
  const map: Record<FrequencyWeeks, { label: string; cls: string }> = {
    1: { label: 'Semanal', cls: 'bg-green-50 text-green-700 border-green-200' },
    2: { label: 'Quincenal', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    4: { label: 'Mensual', cls: 'bg-purple-50 text-purple-700 border-purple-200' },
  };
  const { label, cls } = map[freq];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cls}`}>
      {label}
    </span>
  );
}
