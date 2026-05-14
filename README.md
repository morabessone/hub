# NutriLogistics 🥗

**Suscripción Inteligente de Alimentos Fitness** — WebApp que permite a los usuarios programar su alacena virtual con entregas automáticas.

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| UI | React 19 + Vite 6 |
| Estilos | Tailwind CSS v4 |
| Estado | Zustand (persistido en localStorage) |
| Backend | Supabase (PostgreSQL + Auth) |
| Iconos | Lucide React |
| Animaciones | Framer Motion |
| Routing | React Router v7 |

## Estructura del Proyecto

```
src/
├── components/
│   ├── Navbar.tsx          # Navegación con badge de ítems en suscripción
│   └── ProductCard.tsx     # Card de producto con selector de frecuencia
├── hooks/                  # Custom hooks (extensible)
├── lib/
│   ├── supabase.ts         # Cliente Supabase + helpers de queries
│   ├── deliveryDate.ts     # Lógica de cálculo de fecha de entrega
│   └── mockData.ts         # Datos de demostración
├── pages/
│   ├── LandingPage.tsx     # Hero + features + testimonials + CTA
│   ├── MarketplacePage.tsx # Tabs: Todos / Por Marca / Por Objetivo + filtros
│   ├── PlanPage.tsx        # Alacena virtual — timeline 4 semanas
│   └── CheckoutPage.tsx    # Checkout + selector de día de entrega
├── store/
│   └── useCartStore.ts     # Zustand: carrito con frecuencia por ítem
└── types/
    └── index.ts            # Tipos TypeScript compartidos
```

## Variables de Entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Llena con tus credenciales de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

## Esquema SQL esperado en Supabase

```sql
-- Productos
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  vendor text not null,
  category text,
  goal text[],
  unit text,
  stock int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Suscripciones de usuario
create table user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  status text check (status in ('active','paused','cancelled')) default 'active',
  delivery_day_preference int check (delivery_day_preference between 1 and 7) default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ítems de suscripción (frecuencia individual)
create table subscription_items (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references user_subscriptions on delete cascade not null,
  product_id uuid references products not null,
  quantity int default 1,
  frequency_weeks int check (frequency_weeks in (1,2,4)) not null,
  next_delivery_date date,
  status text check (status in ('active','paused','skipped')) default 'active',
  unique (subscription_id, product_id)
);
```

## Desarrollo Local

```bash
npm install
npm run dev
```

## Build de Producción

```bash
npm run build
npm run preview
```

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing: Hero + Features + Testimonials |
| `/marketplace` | Catálogo con tabs y filtros por marca/objetivo |
| `/plan` | Alacena virtual: timeline 4 semanas + gestión de ítems |
| `/checkout` | Confirmación de suscripción + cálculo de fecha de entrega |

## Lógica de Negocio Clave

### Frecuencia de entregas
Cada ítem tiene `frequency_weeks` ∈ {1, 2, 4}:
- **Semanal (1)**: aparece en semanas 1, 2, 3, 4
- **Quincenal (2)**: aparece en semanas 1 y 3
- **Mensual (4)**: aparece solo en semana 1

### Cálculo de fecha de entrega
`calcNextDeliveryDate(deliveryDayPreference, frequencyWeeks)`:
1. Avanza 2 días (tiempo de procesamiento mínimo)
2. Busca el próximo día preferido de la semana (1=Lun … 7=Dom)
3. Retorna esa fecha como `next_delivery_date`
