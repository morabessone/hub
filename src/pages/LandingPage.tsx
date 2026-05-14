import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, RefreshCw, Package, Shield, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: 'Frecuencia Inteligente',
    desc: 'Cada producto tiene su propio ritmo: semanal, quincenal o mensual. Tu alacena, a tu ritmo.',
    color: 'text-blue-500 bg-blue-50',
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: 'Alacena Virtual',
    desc: 'Visualiza tus próximas 4 semanas de entregas en un timeline claro y sencillo.',
    color: 'text-green-500 bg-green-50',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Marcas Premium',
    desc: 'Optimum Nutrition, Garden of Life, NOW Foods y más. Solo lo mejor para tu rendimiento.',
    color: 'text-yellow-500 bg-yellow-50',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Sin Compromiso',
    desc: 'Pausa, ajusta o cancela cualquier producto en cualquier momento. Tú tienes el control.',
    color: 'text-purple-500 bg-purple-50',
  },
];

const stats = [
  { value: '500+', label: 'Clientes activos' },
  { value: '40+', label: 'Productos premium' },
  { value: '98%', label: 'Entregas a tiempo' },
  { value: '4.9★', label: 'Calificación media' },
];

const brandEmojis: Record<string, string> = {
  'Optimum Nutrition': '💪',
  'Garden of Life': '🌿',
  'NOW Foods': '🧴',
  'Cellucor': '⚡',
};

const brands = Object.keys(brandEmojis);

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Suscripciones ahora disponibles
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
              Tu nutrición,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                automatizada.
              </span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-xl">
              Programa tu alacena fitness de una vez. Cada suplemento llega exactamente cuando lo necesitas, con la frecuencia que tú eliges.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/marketplace">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-lg shadow-green-500/25"
                >
                  Explorar Marketplace
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/my-plan">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
                >
                  Ver mi Plan
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-white/10"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Más que una tienda, una{' '}
              <span className="text-green-500">rutina inteligente</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Diseñado para atletas que no quieren pensar en abastecerse, sino en rendir.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-4">
              Marcas en nuestro catálogo
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {brands.map((brand, i) => (
                <motion.div
                  key={brand}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl">{brandEmojis[brand]}</span>
                  <span className="font-semibold text-gray-700">{brand}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Empieza a programar tu alacena hoy
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Sin suscripción mínima. Sin contratos. Solo resultados.
            </p>
            <Link to="/marketplace">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 font-bold px-10 py-4 rounded-2xl text-lg hover:shadow-xl transition-shadow"
              >
                Ver productos →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🌿</span>
            <span className="text-white font-bold text-xl">NutriLogistics</span>
          </div>
          <p className="text-sm">© 2026 NutriLogistics. Tu salud, en piloto automático.</p>
        </div>
      </footer>
    </div>
  );
}
