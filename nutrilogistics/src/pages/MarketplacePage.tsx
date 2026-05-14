import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { GOAL_LABELS, VENDORS } from '../lib/mockData';

type TabType = 'all' | 'brand' | 'goal';

const stagger = {
  container: { show: { transition: { staggerChildren: 0.05 } } },
  item: { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } },
};

export default function MarketplacePage() {
  const { products, loading } = useProducts();
  const [tab, setTab] = useState<TabType>('all');
  const [search, setSearch] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (selectedVendor) list = list.filter((p) => p.vendor === selectedVendor);
    if (selectedGoal) list = list.filter((p) => p.goal === selectedGoal);
    return list;
  }, [products, search, selectedVendor, selectedGoal]);

  // Grouped by vendor
  const byVendor = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach((p) => {
      if (!map[p.vendor]) map[p.vendor] = [];
      map[p.vendor].push(p);
    });
    return map;
  }, [filtered]);

  // Grouped by goal
  const byGoal = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach((p) => {
      if (!map[p.goal]) map[p.goal] = [];
      map[p.goal].push(p);
    });
    return map;
  }, [filtered]);

  const resetFilters = () => {
    setSearch('');
    setSelectedVendor(null);
    setSelectedGoal(null);
  };

  const hasActiveFilters = search || selectedVendor || selectedGoal;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-900">Marketplace</h1>
              <p className="text-gray-500 mt-1">
                {loading ? '...' : `${products.length} productos de ${VENDORS.length} marcas premium`}
              </p>
            </div>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar producto, marca..."
                className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 w-64"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {([['all', 'Todos'], ['brand', 'Por Marca'], ['goal', 'Por Objetivo']] as [TabType, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`relative px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    tab === key ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === key && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Limpiar
                  </button>
                )}
              </div>

              {/* Vendor filter */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Marca</p>
                <div className="space-y-1">
                  {VENDORS.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVendor(selectedVendor === v ? null : v)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                        selectedVendor === v
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal filter */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Objetivo</p>
                <div className="space-y-1">
                  {GOAL_LABELS.map((g) => (
                    <button
                      key={g.key}
                      onClick={() => setSelectedGoal(selectedGoal === g.key ? null : g.key)}
                      className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        selectedGoal === g.key
                          ? 'bg-brand-50 text-brand-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{g.emoji}</span>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                <p className="text-gray-500 text-sm">Cargando productos...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {tab === 'all' && (
                  <motion.div
                    key="all"
                    variants={stagger.container}
                    initial="hidden"
                    animate="show"
                    className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  >
                    {filtered.map((p) => (
                      <motion.div key={p.id} variants={stagger.item}>
                        <ProductCard product={p} />
                      </motion.div>
                    ))}
                    {filtered.length === 0 && (
                      <div className="col-span-3 text-center py-20 text-gray-400">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="text-lg font-semibold">Sin resultados</p>
                        <p className="text-sm mt-1">Intenta con otros filtros</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {tab === 'brand' && (
                  <motion.div key="brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                    {Object.entries(byVendor).map(([vendor, prods]) => (
                      <div key={vendor}>
                        <div className="flex items-center gap-3 mb-4">
                          <h2 className="text-lg font-black text-gray-900">{vendor}</h2>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {prods.length} productos
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                          {prods.map((p) => (
                            <ProductCard key={p.id} product={p} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {tab === 'goal' && (
                  <motion.div key="goal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                    {GOAL_LABELS.map((g) => {
                      const prods = byGoal[g.key] ?? [];
                      if (!prods.length) return null;
                      return (
                        <div key={g.key}>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-2xl">{g.emoji}</span>
                            <h2 className="text-lg font-black text-gray-900">{g.label}</h2>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              {prods.length} productos
                            </span>
                          </div>
                          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {prods.map((p) => (
                              <ProductCard key={p.id} product={p} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
