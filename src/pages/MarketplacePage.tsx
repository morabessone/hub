import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { VENDORS, GOALS } from '../lib/mockData';

type Tab = 'all' | 'brand' | 'goal';

const TAB_LABELS: Record<Tab, string> = {
  all: 'Todos',
  brand: 'Por Marca',
  goal: 'Por Objetivo',
};

const GOAL_ICONS: Record<string, string> = {
  'Pérdida de peso': '🔥',
  'Ganancia muscular': '💪',
  'Energía': '⚡',
  'Recuperación': '🔄',
  'Bienestar general': '🌿',
};

const VENDOR_EMOJIS: Record<string, string> = {
  'Optimum Nutrition': '💪',
  'Garden of Life': '🌿',
  'NOW Foods': '🧴',
  'Cellucor': '⚡',
};

export default function MarketplacePage() {
  const { products, loading } = useProducts();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.vendor.toLowerCase().includes(search.toLowerCase()) ||
        p.goal.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        !selectedFilter ||
        (activeTab === 'brand' && p.vendor === selectedFilter) ||
        (activeTab === 'goal' && p.goal === selectedFilter);

      return matchSearch && matchFilter;
    });
  }, [products, search, selectedFilter, activeTab]);

  const grouped = useMemo(() => {
    if (activeTab === 'brand') {
      return VENDORS.map((vendor) => ({
        key: vendor,
        label: vendor,
        emoji: VENDOR_EMOJIS[vendor] ?? '🏷️',
        items: filtered.filter((p) => p.vendor === vendor),
      })).filter((g) => g.items.length > 0);
    }
    if (activeTab === 'goal') {
      return GOALS.map((goal) => ({
        key: goal,
        label: goal,
        emoji: GOAL_ICONS[goal] ?? '🎯',
        items: filtered.filter((p) => p.goal === goal),
      })).filter((g) => g.items.length > 0);
    }
    return null;
  }, [filtered, activeTab]);

  const filterOptions = activeTab === 'brand' ? VENDORS : activeTab === 'goal' ? GOALS : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {filtered.length} productos disponibles
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos, marcas..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4">
            {(Object.keys(TAB_LABELS) as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedFilter(null);
                }}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-green-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="market-tab"
                    className="absolute inset-0 bg-green-50 rounded-lg border border-green-200"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{TAB_LABELS[tab]}</span>
              </button>
            ))}

            {/* Filter chips */}
            {filterOptions.length > 0 && (
              <>
                <div className="w-px h-5 bg-gray-200 mx-2" />
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
                  {filterOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setSelectedFilter(selectedFilter === opt ? null : opt)
                      }
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        selectedFilter === opt
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                      }`}
                    >
                      {(activeTab === 'brand' ? VENDOR_EMOJIS[opt] : GOAL_ICONS[opt]) ?? ''}{' '}
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : grouped ? (
          <div className="space-y-12">
            {grouped.map((group) => (
              <motion.section
                key={group.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{group.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{group.label}</h2>
                    <p className="text-sm text-gray-400">{group.items.length} productos</p>
                  </div>
                  <div className="flex-1 h-px bg-gray-200 ml-4" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {group.items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Sin resultados</h3>
            <p className="text-gray-400">
              Prueba con otra búsqueda o limpia los filtros.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedFilter(null);
              }}
              className="mt-4 px-6 py-2 rounded-xl bg-green-50 text-green-600 font-medium hover:bg-green-100 transition-colors"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
