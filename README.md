# NutriLogistics

**Suscripción Inteligente de Alimentos Fitness**

Una WebApp moderna donde los usuarios "programan su alacena": cada suplemento tiene su propia frecuencia de entrega (semanal, quincenal o mensual), y la app gestiona el timeline de entregas automáticamente.

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React 19 + Vite 8, TypeScript                 |
| Styling     | Tailwind CSS v4 (`@tailwindcss/vite`)         |
| Icons       | Lucide React                                  |
| Animations  | Framer Motion                                 |
| State       | Zustand (con `persist` middleware)            |
| Backend     | Supabase (PostgreSQL + Auth + RLS)            |
| Routing     | React Router v7                               |

## Structure

```
src/
├── components/
│   ├── Navbar.tsx           # Sticky nav con badge de items en suscripción
│   ├── ProductCard.tsx      # Card de producto con botón Agregar/Agregado
│   └── FrequencySelector.tsx # Selector de frecuencia (semanal/quincenal/mensual)
├── pages/
│   ├── LandingPage.tsx      # Hero estilo Apple-Health + features + CTA
│   ├── MarketplacePage.tsx  # Tabs: Todos / Por Marca / Por Objetivo
│   ├── SubscriptionPlanPage.tsx # Timeline de 4 semanas + gestión de ítems
│   └── CheckoutPage.tsx     # Checkout multi-paso con lógica de cross-docking
├── store/
│   └── useCartStore.ts      # Zustand store con frecuencia por producto
├── lib/
│   ├── supabase.ts          # Cliente Supabase + helpers CRUD
│   └── mockData.ts          # Productos y datos de demo
└── types/
    └── index.ts             # TypeScript types compartidos
supabase/
└── schema.sql               # DDL completo con RLS policies + seed data
```

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

Crea un archivo `.env` en la raíz con tus credenciales:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Sin `.env`**: La app corre en **modo demo** con productos de mock y el carrito persiste en localStorage.

### 3. Inicializar la base de datos

Ejecuta `supabase/schema.sql` en tu Supabase SQL Editor. Incluye:
- Tablas: `products`, `user_subscriptions`, `subscription_items`
- Row Level Security (RLS) policies
- Trigger `set_updated_at`
- Datos de ejemplo (12 productos de 5 marcas)

### 4. Correr en desarrollo

```bash
npm run dev
```

### 5. Build de producción

```bash
npm run build
```

## Lógica de Negocio

### Frecuencias

| Valor (`frequency_weeks`) | Aparece en semanas |
|---------------------------|-------------------|
| `1` (Semanal)             | 1, 2, 3, 4        |
| `2` (Quincenal)           | 1, 3              |
| `4` (Mensual)             | 1                 |

### `calcNextDeliveryDate(deliveryDayPref, weeksOffset)`

Calcula la fecha ISO del próximo día de la semana preferido, desplazado `weeksOffset` semanas. Ejemplo: si hoy es jueves y el usuario prefiere entregas el lunes, devuelve el próximo lunes.

### Cross-Docking

Todos los ítems de una misma semana se agrupan en una sola entrega el día preferido por el usuario, independientemente de cuántos productos sean.

## Páginas

| Ruta          | Descripción                                    |
|---------------|------------------------------------------------|
| `/`           | Landing con Hero, features y CTA              |
| `/marketplace`| Catálogo con búsqueda, tabs y filtros         |
| `/mi-plan`    | Alacena Virtual: timeline de 4 semanas        |
| `/checkout`   | Checkout 2-paso + confirmación animada        |
