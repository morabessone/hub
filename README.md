# NutriLogistics

Suscripción Inteligente de Alimentos Fitness.

## Tech Stack

- **React 19** (Vite)
- **Tailwind CSS v4**
- **Zustand** (Estado global)
- **Supabase** (Backend)
- **Lucide Icons**
- **Framer Motion**
- **React Router v7**

## Setup

```bash
npm install
cp .env.example .env
# Add your Supabase credentials to .env
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── FrequencySelector.tsx
├── hooks/          # Custom React hooks
│   ├── useProducts.ts
│   └── useSubscription.ts
├── pages/          # Page components
│   ├── Landing.tsx
│   ├── Marketplace.tsx
│   ├── MyPlan.tsx
│   └── Checkout.tsx
├── lib/            # External service configs
│   └── supabase.ts
├── store/          # Zustand stores
│   └── useCartStore.ts
└── data/           # Mock data
    └── products.ts
```

## Features

- **Marketplace**: Browse products by brand, objective, or all at once
- **Smart Subscriptions**: Set individual delivery frequency per product (weekly, biweekly, monthly)
- **Delivery Timeline**: Visual 4-week timeline showing upcoming deliveries
- **Cross-Docking**: Consolidated deliveries based on user's preferred delivery day
- **Subscription Management**: Pause, edit frequency, or remove products anytime
