import { motion } from 'framer-motion';
import type { FrequencyWeeks } from '../types';
import { FREQUENCY_OPTIONS } from '../lib/mockData';

interface Props {
  value: FrequencyWeeks;
  onChange: (v: FrequencyWeeks) => void;
  compact?: boolean;
}

export default function FrequencySelector({ value, onChange, compact = false }: Props) {
  return (
    <div className={`flex ${compact ? 'gap-1' : 'gap-2'}`}>
      {FREQUENCY_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt.value)}
            className={`relative flex-1 rounded-xl border transition-all text-center
              ${compact ? 'px-2 py-1.5' : 'px-3 py-2.5'}
              ${
                active
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
          >
            <div className={`font-semibold ${compact ? 'text-xs' : 'text-sm'}`}>
              {opt.label}
            </div>
            {!compact && (
              <div className="text-xs opacity-70 mt-0.5">{opt.sublabel}</div>
            )}
            {active && (
              <motion.div
                layoutId="freq-indicator"
                className="absolute inset-0 rounded-xl border-2 border-green-500 pointer-events-none"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
