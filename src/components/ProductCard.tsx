import { Plus, Check, Package, Flame, Dumbbell } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '../lib/supabase'
import { useCartStore } from '../store/useCartStore'

const objectiveColors: Record<string, string> = {
  'Ganancia Muscular': 'bg-blue-50 text-blue-700',
  'Pérdida de Grasa': 'bg-orange-50 text-orange-700',
  'Rendimiento': 'bg-purple-50 text-purple-700',
  'Recuperación': 'bg-teal-50 text-teal-700',
  'Salud General': 'bg-green-50 text-green-700',
  'Energía': 'bg-yellow-50 text-yellow-700',
}

const vendorInitials = (vendor: string) =>
  vendor.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

const vendorColors: Record<string, string> = {
  'Optimum Nutrition': 'from-amber-400 to-amber-600',
  'Bob\'s Red Mill': 'from-red-400 to-red-600',
  'Justin\'s': 'from-yellow-400 to-yellow-600',
  'Dymatize': 'from-blue-400 to-blue-600',
  'Quest Nutrition': 'from-purple-400 to-purple-600',
  'Bulletproof': 'from-gray-600 to-gray-800',
  'Garden of Life': 'from-green-400 to-green-600',
  'Cellucor': 'from-red-500 to-red-700',
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { items, addItem, removeItem } = useCartStore()
  const isInCart = items.some(i => i.product.id === product.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className={`relative h-44 bg-gradient-to-br ${vendorColors[product.vendor] || 'from-gray-300 to-gray-500'} flex items-center justify-center`}>
        <span className="text-white/20 text-7xl font-black select-none">
          {vendorInitials(product.vendor)}
        </span>
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${objectiveColors[product.objective] || 'bg-gray-100 text-gray-700'}`}>
            {product.objective}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1">
          <span className="text-sm font-bold text-gray-900">${product.price}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{product.vendor}</p>
        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
          {product.calories_per_serving > 0 && (
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              {product.calories_per_serving} kcal
            </span>
          )}
          {product.protein_per_serving > 0 && (
            <span className="flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
              {product.protein_per_serving}g prot
            </span>
          )}
          <span className="flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-gray-400" />
            {product.serving_size}
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => isInCart ? removeItem(product.id) : addItem(product)}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            isInCart
              ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4" />
              En tu suscripción
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Agregar a mi suscripción
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
