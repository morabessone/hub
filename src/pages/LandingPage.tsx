import { motion } from 'framer-motion';
import { ArrowRight, Zap, RefreshCw, Package, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12 },
  }),
};

const FEATURES = [
  {
    icon: RefreshCw,
    color: 'text-green-500',
    bg: 'bg-green-50',
    title: 'Frecuencia inteligente',
    desc: 'Cada producto tiene su propio ritmo: semanal, quincenal o mensual. Tú decides.',
  },
  {
    icon: Package,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    title: 'Alacena virtual',
    desc: 'Visualiza las próximas 4 semanas de entregas en un timeline interactivo.',
  },
  {
    icon: Zap,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    title: 'Cross-docking',
    desc: 'Optimizamos las rutas para que tus suplementos lleguen frescos y a tiempo.',
  },
  {
    icon: TrendingUp,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    title: 'Marketplace premium',
    desc: 'Las mejores marcas fitness organizadas por tus objetivos de rendimiento.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Carlos M.',
    role: 'Atleta de CrossFit',
    text: 'Nunca más me quedo sin proteína. El sistema de frecuencia es un game-changer.',
    rating: 5,
  },
  {
    name: 'Sofía R.',
    role: 'Runner & Coach',
    text: 'Me encanta ver el timeline de entregas. Planifico mis ciclos de suplementación perfectamente.',
    rating: 5,
  },
  {
    name: 'Andrés L.',
    role: 'Powerlifter',
    text: 'La mejor plataforma de suplementos en el mercado. Entrega puntual y calidad garantizada.',
    rating: 5,
  },
];

const BRANDS = ['Optimum Nutrition', 'MyProtein', 'Garden of Life', 'Cellucor', 'NOW Sports'];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center bg-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-green-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-50 to-blue-50 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-green-200"
            >
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Suscripción inteligente de suplementos
            </motion.div>

            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight mb-6"
            >
              Tu alacena{' '}
              <span className="bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent">
                fitness
              </span>{' '}
              en piloto automático
            </motion.h1>

            <motion.p
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl"
            >
              No solo compres suplementos — programa tu nutrición. Cada producto llega exactamente
              cuando lo necesitas, con la frecuencia que tú eliges.
            </motion.p>

            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-4 rounded-2xl text-base font-semibold hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Explorar Marketplace
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/plan"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-4 rounded-2xl text-base font-semibold border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                Ver Mi Plan
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Brands strip ──────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest text-center mb-5 font-medium">
            Marcas disponibles
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {BRANDS.map((brand) => (
              <span key={brand} className="text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Nutrición que trabaja mientras tú entrenas
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Un sistema de entregas programado que se adapta a tu ciclo de entrenamiento.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-white"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Así de simple</h2>
            <p className="text-xl text-gray-500">Tres pasos para tener tu alacena virtual activa</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-px bg-gradient-to-r from-green-200 via-blue-200 to-green-200" />
            {[
              { step: '01', title: 'Elige tus productos', desc: 'Navega el marketplace por marca u objetivo fitness. Agrega lo que necesitas.' },
              { step: '02', title: 'Programa frecuencias', desc: 'Asigna a cada producto su ritmo: semanal, quincenal o mensual.' },
              { step: '03', title: 'Recibe sin pensar', desc: 'Tu alacena virtual se encarga del resto. Pausar o editar en cualquier momento.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-400 text-white text-sm font-bold rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Atletas que confían en NutriLogistics
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Tu mejor versión empieza hoy
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Únete a miles de atletas que ya tienen su alacena virtual funcionando.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-green-400 transition-all shadow-xl hover:-translate-y-0.5"
            >
              Comenzar ahora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
