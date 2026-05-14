import { motion } from 'framer-motion'

const frequencies = [
  { value: 1 as const, label: 'Semanal', desc: 'Cada semana' },
  { value: 2 as const, label: 'Quincenal', desc: 'Cada 2 semanas' },
  { value: 4 as const, label: 'Mensual', desc: 'Cada 4 semanas' },
]

type Props = {
  value: 1 | 2 | 4
  onChange: (v: 1 | 2 | 4) => void
  compact?: boolean
}

export default function FrequencySelector({ value, onChange, compact }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
        {frequencies.map(f => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`relative px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
              value === f.value ? 'text-white' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {value === f.value && (
              <motion.div
                layoutId="freq-compact"
                className="absolute inset-0 bg-gray-900 rounded-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{f.value === 1 ? '1S' : f.value === 2 ? '2S' : '4S'}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {frequencies.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`relative py-3 px-3 rounded-xl text-center transition-all duration-200 border ${
            value === f.value
              ? 'border-green-500 bg-green-50 text-green-800'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <div className="text-sm font-semibold">{f.label}</div>
          <div className="text-xs mt-0.5 opacity-70">{f.desc}</div>
        </button>
      ))}
    </div>
  )
}
