import { motion } from 'framer-motion';
import { ShoppingBag, Check, Star } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import type { Product } from '../types';

interface Props {
  product: Product;
  index?: number;
}

const OBJECTIVE_COLORS: Record<string, string> = {
  'Ganancia Muscular': 'bg-blue-50 text-blue-700 border-blue-100',
  'Pérdida de Grasa': 'bg-orange-50 text-orange-700 border-orange-100',
  'Rendimiento': 'bg-purple-50 text-purple-700 border-purple-100',
  'Recuperación': 'bg-teal-50 text-teal-700 border-teal-100',
  'Nutrición Limpia': 'bg-green-50 text-green-700 border-green-100',
  'Fuerza y Potencia': 'bg-red-50 text-red-700 border-red-100',
  'Salud General': 'bg-sky-50 text-sky-700 border-sky-100',
};

export default function ProductCard({ product, index = 0 }: Props) {
  const { addItem, removeItem, items } = useCartStore();
  const inCart = items.some((i) => i.product.id === product.id);

  const objectiveClass =
    OBJECTIVE_COLORS[product.objective] ?? 'bg-slate-50 text-slate-600 border-slate-100';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        {/* Vendor badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold rounded-full shadow-sm border border-slate-100">
          {product.vendor}
        </span>

        {/* Rating mock */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-slate-700">4.8</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full border mb-2 ${objectiveClass}`}>
            {product.objective}
          </span>
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
            {product.unit}
          </span>
          {product.stock < 30 && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              Pocas unidades
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
          <div>
            <span className="text-xl font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-slate-400 text-xs ml-1">/ entrega</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => (inCart ? removeItem(product.id) : addItem(product))}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
              inCart
                ? 'bg-green-500 text-white hover:bg-red-500'
                : 'bg-slate-900 text-white hover:bg-green-500'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Agregado</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
