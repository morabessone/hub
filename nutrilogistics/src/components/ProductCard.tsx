import { motion } from 'framer-motion';
import { ShoppingCart, Star, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product, FrequencyWeeks } from '../types';
import { useCartStore } from '../store/useCartStore';
import { GOAL_LABELS } from '../lib/mockData';

const FREQ_OPTIONS: { value: FrequencyWeeks; label: string }[] = [
  { value: 1, label: 'Semanal' },
  { value: 2, label: 'Quincenal' },
  { value: 4, label: 'Mensual' },
];

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const inCart = items.some((i) => i.product.id === product.id);
  const [added, setAdded] = useState(false);
  const [freq, setFreq] = useState<FrequencyWeeks>(2);

  const goalMeta = GOAL_LABELS.find((g) => g.key === product.goal);

  const handleAdd = () => {
    addItem(product, freq);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {goalMeta && (
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${goalMeta.color}`}>
            {goalMeta.emoji} {goalMeta.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-brand-600 font-semibold uppercase tracking-wide mb-1">{product.vendor}</p>
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews_count.toLocaleString()})</span>
          <span className="ml-auto text-xs text-gray-400">{product.unit}</span>
        </div>

        {/* Frequency selector */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1.5 font-medium">Frecuencia de entrega</p>
          <div className="flex gap-1">
            {FREQ_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFreq(opt.value)}
                className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-all ${
                  freq === opt.value
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xl font-black text-gray-900">${product.price.toFixed(2)}</span>
            <span className="text-xs text-gray-400 ml-1">/ entrega</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            disabled={added}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              added || inCart
                ? 'bg-brand-500 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Agregado
              </>
            ) : inCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                En plan
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Agregar
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
