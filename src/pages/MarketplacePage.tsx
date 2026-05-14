import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS, OBJECTIVES, VENDORS } from '../lib/mockData';
import type { MarketplaceTab } from '../types';

type Tab = MarketplaceTab;

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'brand', label: 'Por Marca' },
  { id: 'objective', label: 'Por Objetivo' },
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.vendor.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesObjective = !selectedObjective || p.objective === selectedObjective;
      const matchesVendor = !selectedVendor || p.vendor === selectedVendor;
      return matchesSearch && matchesObjective && matchesVendor;
    });
  }, [search, selectedObjective, selectedVendor]);

  const byVendor = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach((p) => {
      if (!map[p.vendor]) map[p.vendor] = [];
      map[p.vendor].push(p);
    });
    return map;
  }, [filtered]);

  const byObjective = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach((p) => {
      if (!map[p.objective]) map[p.objective] = [];
      map[p.objective].push(p);
    });
    return map;
  }, [filtered]);

  const activeFiltersCount =
    (selectedObjective ? 1 : 0) + (selectedVendor ? 1 : 0);

  return (
    <main className="min-h-screen pt-16 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title row */}
          <div className="py-6">
            <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
            <p className="text-slate-500 text-sm mt-1">
              {filtered.length} productos disponibles para suscripción
            </p>
          </div>

          {/* Search + Tabs + Filters row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pb-4">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar productos, marcas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                activeFiltersCount > 0 || showFilters
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pb-4 grid sm:grid-cols-2 gap-4">
                  {/* Objective filter */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                      Objetivo
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {OBJECTIVES.map((obj) => (
                        <button
                          key={obj}
                          onClick={() =>
                            setSelectedObjective((v) => (v === obj ? null : obj))
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                            selectedObjective === obj
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {obj}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vendor filter */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                      Marca
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {VENDORS.map((v) => (
                        <button
                          key={v}
                          onClick={() =>
                            setSelectedVendor((cur) => (cur === v ? null : v))
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                            selectedVendor === v
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedObjective(null);
                      setSelectedVendor(null);
                    }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium mb-4 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Limpiar filtros
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <AnimatePresence mode="wait">
          {activeTab === 'all' && (
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'brand' && (
            <motion.div
              key="brand"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {Object.entries(byVendor).length === 0 ? (
                <EmptyState />
              ) : (
                Object.entries(byVendor).map(([vendor, products]) => (
                  <section key={vendor}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-bold shadow">
                        {vendor.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-900 text-lg">{vendor}</h2>
                        <p className="text-slate-400 text-sm">
                          {products.length} producto{products.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {products.map((p, i) => (
                        <ProductCard key={p.id} product={p} index={i} />
                      ))}
                    </div>
                  </section>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'objective' && (
            <motion.div
              key="objective"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {Object.entries(byObjective).length === 0 ? (
                <EmptyState />
              ) : (
                Object.entries(byObjective).map(([objective, products]) => (
                  <section key={objective}>
                    <div className="flex items-center gap-3 mb-5">
                      <ObjectiveBadge objective={objective} />
                      <div>
                        <h2 className="font-bold text-slate-900 text-lg">{objective}</h2>
                        <p className="text-slate-400 text-sm">
                          {products.length} producto{products.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {products.map((p, i) => (
                        <ProductCard key={p.id} product={p} index={i} />
                      ))}
                    </div>
                  </section>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 text-slate-400">
      <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
      <p className="text-lg font-semibold text-slate-600">No se encontraron productos</p>
      <p className="text-sm mt-1">Intenta con otros filtros o términos de búsqueda</p>
    </div>
  );
}

const OBJ_COLORS: Record<string, string> = {
  'Ganancia Muscular': 'from-blue-500 to-blue-700',
  'Pérdida de Grasa': 'from-orange-400 to-orange-600',
  'Rendimiento': 'from-purple-500 to-purple-700',
  'Recuperación': 'from-teal-500 to-teal-700',
  'Nutrición Limpia': 'from-green-500 to-emerald-700',
  'Fuerza y Potencia': 'from-red-500 to-red-700',
  'Salud General': 'from-sky-500 to-sky-700',
};

function ObjectiveBadge({ objective }: { objective: string }) {
  const grad = OBJ_COLORS[objective] ?? 'from-slate-500 to-slate-700';
  return (
    <div
      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xs font-bold shadow`}
    >
      {objective.slice(0, 2).toUpperCase()}
    </div>
  );
}
