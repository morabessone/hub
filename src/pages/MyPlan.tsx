import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CalendarCheck,
  Package,
  ShoppingBag,
  ChevronRight,
  Clock,
  Truck,
} from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import FrequencySelector from '../components/FrequencySelector'

function getNextMonday(): Date {
  const now = new Date()
  const day = now.getDay()
  const diff = day === 0 ? 1 : 8 - day
  const next = new Date(now)
  next.setDate(now.getDate() + diff)
  next.setHours(0, 0, 0, 0)
  return next
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  })
}

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + weeks * 7)
  return d
}

export default function MyPlan() {
  const { items, updateFrequency, removeItem } = useCartStore()

  const nextMonday = useMemo(() => getNextMonday(), [])

  const weeks = useMemo(() => {
    return [0, 1, 2, 3].map(weekOffset => {
      const weekStart = addWeeks(nextMonday, weekOffset)
      const weekEnd = addWeeks(weekStart, 0)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const weekItems = items.filter(item => {
        const freq = item.frequency_weeks
        if (freq === 1) return true
        if (freq === 2) return weekOffset % 2 === 0
        if (freq === 4) return weekOffset === 0
        return false
      })

      return {
        weekNumber: weekOffset + 1,
        startDate: weekStart,
        endDate: weekEnd,
        items: weekItems,
      }
    })
  }, [items, nextMonday])

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
              <CalendarCheck className="w-10 h-10 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Tu plan está vacío</h1>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Agrega productos desde el Marketplace para comenzar a programar tu alacena fitness.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Ir al Marketplace
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Mi Plan de Entregas</h1>
          <p className="text-gray-500 text-lg">
            Tu alacena virtual. Visualiza qué recibes cada semana.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-6 mb-16">
          {weeks.map((week, weekIdx) => (
            <motion.div
              key={week.weekNumber}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: weekIdx * 0.1 }}
              className="relative"
            >
              {/* Connector */}
              {weekIdx < 3 && (
                <div className="absolute left-6 top-full w-0.5 h-6 bg-gray-200 z-0" />
              )}

              <div className={`rounded-2xl border transition-all duration-300 ${
                weekIdx === 0
                  ? 'border-green-200 bg-green-50/50 shadow-sm'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}>
                {/* Week Header */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    weekIdx === 0
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className="text-lg font-bold">{week.weekNumber}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        Semana {week.weekNumber}
                      </h3>
                      {weekIdx === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-xs font-medium">
                          Próxima
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(week.startDate)} — {formatDate(week.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Package className="w-4 h-4" />
                    {week.items.length} {week.items.length === 1 ? 'producto' : 'productos'}
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {week.items.length > 0 ? (
                      week.items.map(item => (
                        <motion.div
                          key={item.product.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-4 px-6 py-3.5"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                            {item.product.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {item.product.vendor} · x{item.quantity}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                            {item.frequency_weeks === 1 ? 'Semanal' : item.frequency_weeks === 2 ? 'Quincenal' : 'Mensual'}
                          </span>
                          <Truck className="w-4 h-4 text-green-500" />
                        </motion.div>
                      ))
                    ) : (
                      <div className="px-6 py-6 text-center text-sm text-gray-400">
                        No hay entregas esta semana
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Product Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Gestionar Productos</h2>
          <div className="space-y-3">
            {items.map(item => (
              <motion.div
                key={item.product.id}
                layout
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 shrink-0">
                    {item.product.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">{item.product.vendor} · ${item.product.price}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Frecuencia de entrega</p>
                      <FrequencySelector
                        value={item.frequency_weeks}
                        onChange={f => updateFrequency(item.product.id, f)}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Checkout CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <Link
            to="/checkout"
            className="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-colors group"
          >
            <div>
              <p className="font-semibold">Confirmar Mi Suscripción</p>
              <p className="text-sm text-gray-400">{items.length} productos programados</p>
            </div>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
