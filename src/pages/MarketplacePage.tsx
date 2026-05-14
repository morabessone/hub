import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS, ALL_GOALS, ALL_VENDORS } from '../lib/mockData';
import type { MarketplaceTab } from '../types';

const TABS: { id: MarketplaceTab; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'brand', label: 'Por Marca' },
  { id: 'goal', label: 'Por Objetivo' },
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('all');
  const [search, setSearch] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.vendor.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());

      const matchGoal = !selectedGoal || p.goal.includes(selectedGoal);
      const matchVendor = !selectedVendor || p.vendor === selectedVendor;

      return matchSearch && matchGoal && matchVendor;
    });
  }, [search, selectedGoal, selectedVendor]);

  const grouped = useMemo(() => {
    if (activeTab === 'brand') {
      return ALL_VENDORS.reduce<Record<string, typeof filtered>>((acc, vendor) => {
        const prods = filtered.filter((p) => p.vendor === vendor);
        if (prods.length) acc[vendor] = prods;
        return acc;
      }, {});
    }
    if (activeTab === 'goal') {
      return ALL_GOALS.reduce<Record<string, typeof filtered>>((acc, goal) => {
        const prods = filtered.filter((p) => p.goal.includes(goal));
        if (prods.length) acc[goal] = prods;
        return acc;
      }, {});
    }
    return { Todos: filtered };
  }, [activeTab, filtered]);

  const goalColors: Record<string, string> = {
    Músculo: 'bg-blue-500',
    Fuerza: 'bg-orange-500',
    Definición: 'bg-purple-500',
    Energía: 'bg-yellow-500',
    Recuperación: 'bg-green-500',
    Bienestar: 'bg-teal-500',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page header ───────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Marketplace</h1>
          <p className="text-gray-500">
            {MOCK_PRODUCTS.length} productos de las mejores marcas fitness
          </p>

          {/* Search + filter row */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos, marcas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                showFilters || selectedGoal || selectedVendor
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {(selectedGoal || selectedVendor) && (
                <span className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                  {[selectedGoal, selectedVendor].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Goals */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Objetivo
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_GOALS.map((g) => (
                        <button
                          key={g}
                          onClick={() => setSelectedGoal(selectedGoal === g ? null : g)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selectedGoal === g
                              ? `${goalColors[g] ?? 'bg-gray-900'} text-white border-transparent`
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Vendors */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Marca
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_VENDORS.map((v) => (
                        <button
                          key={v}
                          onClick={() => setSelectedVendor(selectedVendor === v ? null : v)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            selectedVendor === v
                              ? 'bg-gray-900 text-white border-transparent'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {(selectedGoal || selectedVendor) && (
                  <button
                    onClick={() => { setSelectedGoal(null); setSelectedVendor(null); }}
                    className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Limpiar filtros
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tabs */}
          <div className="mt-6 flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products grid ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg font-medium">No se encontraron productos</p>
            <button
              onClick={() => { setSearch(''); setSelectedGoal(null); setSelectedVendor(null); }}
              className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([group, products]) => (
              <motion.section
                key={group}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab !== 'all' && (
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {activeTab === 'goal' && (
                        <div className={`w-3 h-3 rounded-full ${goalColors[group] ?? 'bg-gray-400'}`} />
                      )}
                      <h2 className="text-lg font-bold text-gray-900">{group}</h2>
                      <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {products.length}
                      </span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
