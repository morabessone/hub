import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Package,
  Calendar,
} from 'lucide-react';

const FEATURES = [
  {
    icon: RotateCcw,
    title: 'Frecuencia Inteligente',
    desc: 'Cada producto tiene su propio ritmo: semanal, quincenal o mensual. Tú controlas cuándo llega cada suplemento.',
    color: 'from-green-400 to-emerald-600',
  },
  {
    icon: Calendar,
    title: 'Timeline Visual',
    desc: 'Ve exactamente qué llega cada semana con nuestro planificador visual de 4 semanas.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: Package,
    title: 'Cross-Docking',
    desc: 'Agrupamos todos tus pedidos del día en una sola entrega para maximizar la frescura.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    icon: ShieldCheck,
    title: 'Marcas Verificadas',
    desc: 'Solo trabajamos con marcas certificadas NSF, Informed Sport y USDA Organic.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Optimizado para Tus Metas',
    desc: 'Filtra por objetivo: ganancia muscular, pérdida de grasa, rendimiento o nutrición limpia.',
    color: 'from-rose-400 to-pink-600',
  },
  {
    icon: Zap,
    title: 'Pausa Cuando Quieras',
    desc: 'Sin contratos ni penalidades. Pausa, edita o cancela cada ítem con un clic.',
    color: 'from-cyan-400 to-sky-600',
  },
];

const STATS = [
  { value: '500+', label: 'Productos disponibles' },
  { value: '12k+', label: 'Suscripciones activas' },
  { value: '98%', label: 'Tasa de satisfacción' },
  { value: '4h', label: 'Tiempo de entrega' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-green-100/60 via-blue-50/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-radial from-blue-100/40 to-transparent rounded-full blur-3xl" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              <motion.div variants={item}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-200 rounded-full text-green-700 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Nueva experiencia de suscripción fitness
                </span>
              </motion.div>

              <motion.h1
                variants={item}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight"
              >
                Tu alacena
                <br />
                <span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                  fitness,
                </span>
                <br />
                en piloto
                <br />
                automático.
              </motion.h1>

              <motion.p
                variants={item}
                className="text-lg text-slate-500 leading-relaxed max-w-lg"
              >
                Programa cada suplemento con su propia frecuencia. Recibe exactamente lo que necesitas, cuando lo necesitas, sin pensar en ello.
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap gap-3">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-green-600 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-green-200 hover:shadow-xl text-sm"
                >
                  Explorar Marketplace
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/mi-plan"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-full border border-slate-200 hover:border-slate-300 transition-all text-sm"
                >
                  Ver mi Plan
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={item}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4"
              >
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Visual mock */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">MI PLAN ESTA SEMANA</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5">3 entregas programadas</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Timeline weeks */}
                  {['Semana 1 · Lunes 20 May', 'Semana 2 · Lunes 27 May', 'Semana 3 · Lunes 3 Jun'].map(
                    (week, wi) => (
                      <div key={week} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              wi === 0
                                ? 'bg-green-500'
                                : wi === 1
                                ? 'bg-blue-500'
                                : 'bg-purple-500'
                            }`}
                          >
                            {wi + 1}
                          </div>
                          {wi < 2 && <div className="w-0.5 flex-1 bg-slate-100 my-1" />}
                        </div>
                        <div className="flex-1 pb-3">
                          <p className="text-xs font-semibold text-slate-500 mb-2">{week}</p>
                          <div className="space-y-1.5">
                            {wi === 0 && (
                              <>
                                <MockItem label="Gold Standard Whey" freq="Semanal" color="blue" />
                                <MockItem label="C4 Pre-Workout" freq="Quincenal" color="purple" />
                                <MockItem label="Omega-3 Fish Oil" freq="Mensual" color="green" />
                              </>
                            )}
                            {wi === 1 && <MockItem label="Gold Standard Whey" freq="Semanal" color="blue" />}
                            {wi === 2 && (
                              <>
                                <MockItem label="Gold Standard Whey" freq="Semanal" color="blue" />
                                <MockItem label="C4 Pre-Workout" freq="Quincenal" color="purple" />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-3 flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Auto-programado</p>
                    <p className="text-xs text-slate-400">Siguiente: Lun 20 May</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Diseñado para{' '}
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                atletas serios
              </span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg max-w-xl mx-auto">
              No es solo un carrito de compras. Es un sistema inteligente de gestión de nutrición.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl p-12 shadow-2xl shadow-green-200/40"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Comienza tu alacena
              <br />
              virtual hoy.
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
              Sin compromisos. Cancela o pausa en cualquier momento. Primer mes con 20% de descuento.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-all text-sm shadow-lg"
            >
              Empezar ahora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function MockItem({ label, freq, color }: { label: string; freq: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    green: 'bg-green-50 text-green-600 border-green-100',
  };
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
      <span className="text-xs font-medium text-slate-700 truncate">{label}</span>
      <span className={`ml-2 shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${colors[color]}`}>
        {freq}
      </span>
    </div>
  );
}
