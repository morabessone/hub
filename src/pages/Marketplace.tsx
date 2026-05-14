import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { PRODUCTS, OBJECTIVES, VENDORS } from '../data/products'

type TabKey = 'all' | 'brand' | 'objective'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'brand', label: 'Por Marca' },
  { key: 'objective', label: 'Por Objetivo' },
]

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [search, setSearch] = useState('')
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => p.is_active)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.vendor.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [search])

  const grouped = useMemo(() => {
    if (activeTab === 'brand') {
      const groups: Record<string, typeof PRODUCTS> = {}
      for (const p of filtered) {
        if (!groups[p.vendor]) groups[p.vendor] = []
        groups[p.vendor].push(p)
      }
      if (selectedVendor) {
        return { [selectedVendor]: groups[selectedVendor] || [] }
      }
      return groups
    }
    if (activeTab === 'objective') {
      const groups: Record<string, typeof PRODUCTS> = {}
      for (const p of filtered) {
        if (!groups[p.objective]) groups[p.objective] = []
        groups[p.objective].push(p)
      }
      if (selectedObjective) {
        return { [selectedObjective]: groups[selectedObjective] || [] }
      }
      return groups
    }
    return { all: filtered }
  }, [activeTab, filtered, selectedVendor, selectedObjective])

  const clearFilters = () => {
    setSearch('')
    setSelectedVendor(null)
    setSelectedObjective(null)
  }

  const hasActiveFilters = search || selectedVendor || selectedObjective

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-500 text-lg">
            Explora productos fitness de las mejores marcas y agrégalos a tu suscripción.
          </p>
        </motion.div>

        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos, marcas..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  setSelectedVendor(null)
                  setSelectedObjective(null)
                }}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 bg-gray-900 rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Filter Pills for brand/objective tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'brand' && (
            <motion.div
              key="brand-pills"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex flex-wrap gap-2">
                {VENDORS.map(vendor => (
                  <button
                    key={vendor}
                    onClick={() => setSelectedVendor(selectedVendor === vendor ? null : vendor)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      selectedVendor === vendor
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {vendor}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'objective' && (
            <motion.div
              key="objective-pills"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex flex-wrap gap-2">
                {OBJECTIVES.map(obj => (
                  <button
                    key={obj}
                    onClick={() => setSelectedObjective(selectedObjective === obj ? null : obj)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                      selectedObjective === obj
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {obj}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Groups */}
        <div className="space-y-12">
          {Object.entries(grouped).map(([groupName, products]) => (
            <motion.div
              key={groupName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {groupName !== 'all' && (
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-gray-900">{groupName}</h2>
                  <span className="text-sm text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {products.length} productos
                  </span>
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {Object.values(grouped).every(g => g.length === 0) && (
          <div className="text-center py-20">
            <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No se encontraron productos con esos filtros.</p>
          </div>
        )}
      </div>
    </div>
  )
}
