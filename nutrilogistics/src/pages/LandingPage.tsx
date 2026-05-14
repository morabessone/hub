import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Truck,
  RefreshCw,
  Shield,
  ChevronRight,
  TrendingUp,
  Leaf,
  Flame,
} from 'lucide-react';

const FEATURES = [
  {
    icon: RefreshCw,
    color: 'text-brand-600 bg-brand-50',
    title: 'Entrega Programada',
    desc: 'Define la frecuencia de cada producto: semanal, quincenal o mensual.',
  },
  {
    icon: Truck,
    color: 'text-accent-600 bg-accent-50',
    title: 'Sin Preocupaciones',
    desc: 'Tu alacena fitness siempre abastecida. Modifica o pausa en cualquier momento.',
  },
  {
    icon: Shield,
    color: 'text-purple-600 bg-purple-50',
    title: 'Marcas Premium',
    desc: 'Solo trabajamos con las marcas más reconocidas del mercado fitness.',
  },
  {
    icon: Zap,
    color: 'text-amber-600 bg-amber-50',
    title: 'Optimizado por Objetivo',
    desc: 'Filtra por tu meta: ganar músculo, perder grasa, resistencia o bienestar.',
  },
];

const STATS = [
  { value: '+2,500', label: 'Suscriptores activos' },
  { value: '48h', label: 'Primera entrega' },
  { value: '15+', label: 'Marcas premium' },
  { value: '4.9★', label: 'Valoración media' },
];

const GOALS = [
  { icon: TrendingUp, label: 'Ganar Músculo', color: 'from-blue-500 to-blue-700', bg: 'bg-blue-50' },
  { icon: Flame,     label: 'Perder Grasa',  color: 'from-orange-400 to-red-600', bg: 'bg-orange-50' },
  { icon: Zap,       label: 'Resistencia',   color: 'from-purple-500 to-purple-700', bg: 'bg-purple-50' },
  { icon: Leaf,      label: 'Bienestar',     color: 'from-green-400 to-green-600', bg: 'bg-green-50' },
];

const stagger: { container: Variants; item: Variants } = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-brand-100 to-accent-100 opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-100 to-brand-100 opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Copy */}
            <motion.div
              variants={stagger.container}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6"
            >
              <motion.div variants={stagger.item}>
                <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full border border-brand-100">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  Suscripciones inteligentes · fitness
                </span>
              </motion.div>

              <motion.h1
                variants={stagger.item}
                className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight text-gray-900"
              >
                Tu alacena fitness,{' '}
                <span className="bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                  siempre lista.
                </span>
              </motion.h1>

              <motion.p
                variants={stagger.item}
                className="text-lg text-gray-500 leading-relaxed max-w-md"
              >
                Programa tus suplementos y alimentos fitness con la frecuencia exacta que necesitas.
                Sin quedarte sin stock. Sin compras de emergencia.
              </motion.p>

              <motion.div variants={stagger.item} className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors shadow-lg shadow-gray-900/20"
                >
                  Explorar Marketplace
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/mi-plan"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/30"
                >
                  Ver mi plan
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Visual card stack */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:flex justify-center items-center"
            >
              <div className="relative w-72">
                {/* Back card */}
                <div className="absolute -top-4 -right-6 w-64 h-36 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl shadow-xl opacity-60 rotate-3" />
                {/* Middle card */}
                <div className="absolute -top-2 -right-3 w-64 h-36 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl shadow-xl opacity-80 rotate-1" />
                {/* Front card */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  <p className="text-xs text-gray-400 font-medium mb-3">PRÓXIMA ENTREGA · LUN 19 MAY</p>
                  <div className="space-y-3">
                    {[
                      { name: 'Gold Standard Whey', freq: 'Quincenal', color: 'bg-blue-100' },
                      { name: 'C4 Pre-Workout', freq: 'Semanal', color: 'bg-purple-100' },
                      { name: 'Creatine Monohydrate', freq: 'Mensual', color: 'bg-green-100' },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${item.color} flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.freq}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">3 productos</span>
                    <span className="text-sm font-black text-gray-900">$97.48</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black text-white">{s.value}</p>
                <p className="text-sm text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Goals ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-3">Encuentra tu objetivo</h2>
            <p className="text-gray-500 text-lg">Productos seleccionados para cada meta específica</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {GOALS.map(({ icon: Icon, label, color, bg }) => (
              <Link key={label} to={`/marketplace?goal=${encodeURIComponent(label)}`}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className={`${bg} rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer border border-transparent hover:border-gray-200 transition-all`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 text-center">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black text-gray-900 mb-3">¿Por qué NutriLogistics?</h2>
            <p className="text-gray-500 text-lg">La plataforma más inteligente para gestionar tu nutrición</p>
          </motion.div>
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <motion.div
                key={title}
                variants={stagger.item}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-brand-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
              Empieza a programar{' '}
              <span className="text-brand-400">tu alacena hoy</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Primera entrega en 48 horas. Sin compromisos. Cancela cuando quieras.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/30 text-lg"
            >
              Crear mi plan ahora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
