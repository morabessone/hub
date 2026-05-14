import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarCheck,
  RefreshCw,
  Truck,
  Shield,
  Zap,
  Heart,
  Target,
  TrendingUp,
} from 'lucide-react'

const features = [
  {
    icon: CalendarCheck,
    title: 'Programa tu Alacena',
    description: 'Configura la frecuencia de cada producto: semanal, quincenal o mensual.',
  },
  {
    icon: RefreshCw,
    title: 'Entregas Inteligentes',
    description: 'Recibe exactamente lo que necesitas, cuando lo necesitas. Sin desperdicios.',
  },
  {
    icon: Truck,
    title: 'Cross-Docking Optimizado',
    description: 'Consolidamos tus productos de múltiples marcas en una sola entrega.',
  },
  {
    icon: Shield,
    title: 'Pausa cuando Quieras',
    description: 'Flexibilidad total. Pausa, edita o cancela cualquier producto individualmente.',
  },
]

const objectives = [
  { icon: TrendingUp, label: 'Ganancia Muscular', color: 'from-blue-500 to-blue-600' },
  { icon: Zap, label: 'Rendimiento', color: 'from-purple-500 to-purple-600' },
  { icon: Heart, label: 'Salud General', color: 'from-green-500 to-green-600' },
  { icon: Target, label: 'Pérdida de Grasa', color: 'from-orange-500 to-orange-600' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-white to-blue-50/60" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Suscripción Inteligente de Alimentos Fitness
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Programa tu
              <br />
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                nutrición perfecta
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              No solo compres suplementos. Programa tu alacena fitness con entregas
              automáticas personalizadas por producto. Cada ítem, a tu ritmo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/marketplace"
                className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-base hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/20"
              >
                Explorar Marketplace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/mi-plan"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-gray-700 font-semibold text-base border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <CalendarCheck className="w-4 h-4" />
                Ver Mi Plan
              </Link>
            </div>
          </motion.div>

          {/* Objective Pills */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-3 mt-16"
          >
            {objectives.map(obj => (
              <motion.div
                key={obj.label}
                variants={itemVariants}
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${obj.color} flex items-center justify-center`}>
                  <obj.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{obj.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cómo funciona
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Tu nutrición en piloto automático. Configura una vez, recibe siempre.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-12 sm:p-16 text-center"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Comienza a programar tu nutrición
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
                Elige tus productos, configura las frecuencias y deja que NutriLogistics
                se encargue del resto.
              </p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-green-500 text-white font-semibold hover:bg-green-400 transition-colors shadow-lg shadow-green-500/25"
              >
                Ir al Marketplace
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} NutriLogistics. Suscripción inteligente de alimentos fitness.
          </p>
        </div>
      </footer>
    </div>
  )
}
