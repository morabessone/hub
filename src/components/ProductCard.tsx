import { motion } from 'framer-motion';
import { Plus, Check, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import type { FrequencyWeeks, Product } from '../types';

const FREQUENCY_LABELS: Record<FrequencyWeeks, string> = {
  1: 'Semanal',
  2: 'Quincenal',
  4: 'Mensual',
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { items, addItem, updateFrequency } = useCartStore();
  const cartItem = items.find((i) => i.product.id === product.id);
  const inCart = !!cartItem;
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    addItem(product, 4);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleFrequencyChange = (freq: FrequencyWeeks) => {
    updateFrequency(product.id, freq);
  };

  const goalColors: Record<string, string> = {
    Músculo: 'bg-blue-50 text-blue-600',
    Fuerza: 'bg-orange-50 text-orange-600',
    Definición: 'bg-purple-50 text-purple-600',
    Energía: 'bg-yellow-50 text-yellow-600',
    Recuperación: 'bg-green-50 text-green-600',
    Bienestar: 'bg-teal-50 text-teal-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {!imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{product.name[0]}</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200">
            {product.unit}
          </span>
        </div>
        {product.stock < 20 && (
          <div className="absolute top-3 right-3">
            <span className="bg-orange-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              Últimas unidades
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">
            {product.vendor}
          </p>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        </div>

        {/* Goals */}
        <div className="flex flex-wrap gap-1">
          {product.goal.map((g) => (
            <span
              key={g}
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${goalColors[g] ?? 'bg-gray-100 text-gray-600'}`}
            >
              {g}
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-2">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400">/ entrega</span>
          </div>

          {/* Frequency selector (shown when in cart) */}
          {inCart && (
            <div className="bg-gray-50 rounded-xl p-2">
              <div className="flex items-center gap-1 mb-1.5">
                <RefreshCw className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">Frecuencia de entrega</span>
              </div>
              <div className="flex gap-1">
                {([1, 2, 4] as FrequencyWeeks[]).map((freq) => (
                  <button
                    key={freq}
                    onClick={() => handleFrequencyChange(freq)}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
                      cartItem?.frequency_weeks === freq
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {FREQUENCY_LABELS[freq]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={added}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              added
                ? 'bg-green-100 text-green-700 cursor-default'
                : inCart
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                ¡Agregado!
              </>
            ) : inCart ? (
              <>
                <Plus className="w-4 h-4" />
                Agregar más
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Agregar a mi suscripción
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
