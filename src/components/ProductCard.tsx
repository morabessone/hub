import { motion } from 'framer-motion';
import { Plus, Check, RefreshCw, Tag } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import type { FrequencyWeeks, Product } from '../types';

const FREQUENCY_OPTIONS: { label: string; value: FrequencyWeeks; desc: string }[] = [
  { label: 'Semanal', value: 1, desc: 'Cada 7 días' },
  { label: 'Quincenal', value: 2, desc: 'Cada 14 días' },
  { label: 'Mensual', value: 4, desc: 'Cada 28 días' },
];

const GOAL_COLORS: Record<string, string> = {
  'Pérdida de peso': 'bg-orange-100 text-orange-700',
  'Ganancia muscular': 'bg-blue-100 text-blue-700',
  'Energía': 'bg-yellow-100 text-yellow-700',
  'Recuperación': 'bg-purple-100 text-purple-700',
  'Bienestar general': 'bg-green-100 text-green-700',
  'default': 'bg-gray-100 text-gray-700',
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem, items, updateFrequency } = useCartStore();
  const [selectedFreq, setSelectedFreq] = useState<FrequencyWeeks>(1);
  const [showFreqPicker, setShowFreqPicker] = useState(false);

  const inCart = items.find((i) => i.product.id === product.id);
  const goalColor = GOAL_COLORS[product.goal] ?? GOAL_COLORS['default'];

  const handleAdd = () => {
    if (inCart) {
      updateFrequency(product.id, selectedFreq);
    } else {
      addItem(product, selectedFreq);
    }
    setShowFreqPicker(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {product.vendor === 'Garden of Life' ? '🌿' :
             product.vendor === 'Optimum Nutrition' ? '💪' :
             product.vendor === 'NOW Foods' ? '🧴' : '🥗'}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${goalColor}`}>
            {product.goal}
          </span>
        </div>
        {inCart && (
          <div className="absolute top-3 right-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h3>
        </div>
        <div className="flex items-center gap-1.5 mb-2">
          <Tag className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">{product.vendor}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>
          </div>
          {inCart && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              {inCart.frequency_weeks === 1 ? 'Semanal' : inCart.frequency_weeks === 2 ? 'Quincenal' : 'Mensual'}
            </span>
          )}
        </div>

        {/* Frequency picker */}
        <AnimatePresencePicker show={showFreqPicker}>
          <div className="mb-3 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs font-medium text-gray-600 mb-2">Frecuencia de entrega:</p>
            <div className="grid grid-cols-3 gap-1.5">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedFreq(opt.value)}
                  className={`text-center py-2 px-1 rounded-lg text-xs font-medium border transition-all ${
                    selectedFreq === opt.value
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div>{opt.label}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedFreq === opt.value ? 'text-green-100' : 'text-gray-400'}`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </AnimatePresencePicker>

        {/* CTA */}
        {!showFreqPicker ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowFreqPicker(true)}
            className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              inCart
                ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
          >
            {inCart ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Cambiar frecuencia
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Agregar a mi suscripción
              </>
            )}
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowFreqPicker(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Confirmar
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AnimatePresencePicker({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresenceInner show={show}>{children}</AnimatePresenceInner>
  );
}

function AnimatePresenceInner({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      {children}
    </motion.div>
  );
}
