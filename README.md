# NutriLogistics 🥗⚡

> **Suscripción Inteligente de Alimentos Fitness** — programa tu alacena con productos premium entregados a tu frecuencia exacta.

## Tech Stack

| Tecnología | Uso |
|---|---|
| **React + Vite** | Framework principal (TypeScript) |
| **Tailwind CSS v3** | Estilos utility-first |
| **Framer Motion** | Animaciones y transiciones |
| **Zustand** | Estado global del carrito (con persistencia localStorage) |
| **Supabase** | Backend: Auth, Base de datos PostgreSQL, RLS |
| **Lucide React** | Iconografía |
| **React Router v6** | Navegación SPA |

## Estructura de Carpetas

```
nutrilogistics/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Navegación con badge de items en suscripción
│   │   ├── ProductCard.tsx     # Card de producto con selector de frecuencia
│   │   └── FrequencyBadge.tsx  # Badge reutilizable (Semanal/Quincenal/Mensual)
│   ├── hooks/
│   │   └── useProducts.ts      # Hook con fallback a mock data
│   ├── pages/
│   │   ├── LandingPage.tsx     # Hero + Features + CTA
│   │   ├── MarketplacePage.tsx # Marketplace con tabs + filtros + búsqueda
│   │   ├── SubscriptionPage.tsx# Mi Plan: Timeline 4 semanas + gestión
│   │   └── CheckoutPage.tsx    # Checkout 3 pasos + integración Supabase
│   ├── lib/
│   │   ├── supabase.ts         # Cliente Supabase + helpers
│   │   └── mockData.ts         # Datos demo (14 productos, 6 marcas)
│   ├── store/
│   │   └── useCartStore.ts     # Zustand store con frecuencia por ítem
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── supabase_schema.sql         # Schema SQL completo con RLS + seed
└── .env.example                # Variables de entorno requeridas
```

## Configuración Rápida

### 1. Instalar dependencias

```bash
cd nutrilogistics
npm install
```

### 2. Configurar Supabase (opcional)

```bash
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

Sin credenciales, la app funciona en **modo demo** con 14 productos de 6 marcas reales.

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

### 4. Base de datos Supabase

Ejecuta `supabase_schema.sql` en el SQL Editor de tu proyecto Supabase. El script crea:
- Tabla `products` con RLS (lectura pública)
- Tabla `user_subscriptions` con RLS por usuario
- Tabla `subscription_items` con constraint unique `(subscription_id, product_id)`
- Triggers de `updated_at` automáticos
- 5 productos de seed de ejemplo

## Lógica de Negocio

### Frecuencias de Entrega

Cada ítem tiene su propia `frequency_weeks`:

| Valor | Label | Semanas de entrega |
|---|---|---|
| `1` | Semanal | 1, 2, 3, 4 |
| `2` | Quincenal | 1, 3 |
| `4` | Mensual | 1 |

### Cálculo de Próxima Entrega

```
calcNextDelivery(deliveryDayPreference, minDaysAhead=3)
```

Calcula el siguiente día de la semana preferido con mínimo 3 días de anticipación.

### Timeline Visual (Mi Plan de Entregas)

La página `SubscriptionPage` muestra las próximas 4 semanas con los ítems que corresponden a cada semana según su frecuencia.

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Landing page con Hero, Stats, Goals y Features |
| `/marketplace` | Grid de productos con tabs (Todos/Por Marca/Por Objetivo) y sidebar de filtros |
| `/mi-plan` | Timeline de 4 semanas + panel de gestión de ítems |
| `/checkout` | Checkout en 3 pasos (Revisión → Dirección → Confirmación) |
