# NutriLogistics 🌿

**WebApp de Suscripción Inteligente de Alimentos Fitness**

Una plataforma donde los usuarios no solo compran suplementos, sino que _programan su alacena_. Cada producto tiene su propia frecuencia de entrega (semanal, quincenal o mensual), generando un timeline visual de las próximas 4 semanas.

---

## Tech Stack

| Tecnología | Uso |
|---|---|
| **React + Vite** | Framework frontend |
| **TypeScript** | Tipado estático |
| **Tailwind CSS v4** | Estilos utilitarios |
| **Framer Motion** | Animaciones y transiciones |
| **Zustand** | Estado global del carrito |
| **Supabase** | Backend: base de datos y auth |
| **React Router v7** | Navegación SPA |
| **Lucide React** | Iconografía |

---

## Estructura del Proyecto

```
src/
├── components/
│   ├── Navbar.tsx         # Barra de navegación con contador de ítems
│   └── ProductCard.tsx    # Card de producto con selector de frecuencia
├── hooks/
│   ├── useProducts.ts     # Fetch de productos (Supabase + fallback mock)
│   └── useSubscription.ts # Lógica del timeline de entregas
├── lib/
│   ├── supabase.ts        # Cliente Supabase
│   └── mockData.ts        # Datos demo para desarrollo
├── pages/
│   ├── LandingPage.tsx    # Hero, features, marcas, CTA
│   ├── MarketplacePage.tsx # Tabs: Todos / Por Marca / Por Objetivo
│   ├── MyPlanPage.tsx     # Timeline 4 semanas + gestión de ítems
│   └── CheckoutPage.tsx   # Flujo de 3 pasos: review → entrega → pago
├── store/
│   └── useCartStore.ts    # Zustand store con persistencia localStorage
└── types/
    └── index.ts           # Tipos TypeScript compartidos
```

---

## Setup Local

1. Clona el repo e instala dependencias:
   ```bash
   npm install
   ```

2. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

3. Edita `.env` con tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```

4. Ejecuta en desarrollo:
   ```bash
   npm run dev
   ```

> **Sin Supabase configurado**: La app funciona con datos mock. Todos los productos del marketplace se cargan desde `src/lib/mockData.ts`.

---

## Base de Datos Supabase

Ejecuta `supabase_schema.sql` en el SQL Editor de tu proyecto de Supabase. Este archivo crea:

- `products` — Catálogo de suplementos
- `user_subscriptions` — Suscripciones activas de cada usuario
- `subscription_items` — Ítems individuales con frecuencia por producto

Incluye RLS (Row Level Security) y datos de prueba.

---

## Lógica del Timeline de Entregas

| Semana | Frecuencias incluidas |
|--------|----------------------|
| Semana 1 | Semanal (1) + Quincenal (2) + Mensual (4) |
| Semana 2 | Semanal (1) |
| Semana 3 | Semanal (1) + Quincenal (2) |
| Semana 4 | Semanal (1) + Quincenal (2) + Mensual (4) |

---

## Páginas

| Ruta | Página |
|------|--------|
| `/` | Landing — Hero, features, marcas |
| `/marketplace` | Catálogo con tabs y filtros |
| `/my-plan` | Timeline de entregas + gestión |
| `/checkout` | Flujo de confirmación de suscripción |
