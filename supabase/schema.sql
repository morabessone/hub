-- NutriLogistics — Supabase Schema
-- Run this in your Supabase SQL Editor

-- ── Extensions ────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Products ──────────────────────────────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  price       numeric(10, 2) not null,
  vendor      text not null,
  objective   text not null,
  image_url   text,
  unit        text,
  stock       integer default 0,
  tags        text[] default '{}',
  created_at  timestamptz default now()
);

-- ── User Subscriptions ────────────────────────────────────────────────────────
create table if not exists user_subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid references auth.users(id) on delete cascade not null,
  delivery_day_preference smallint not null check (delivery_day_preference between 1 and 7),
  -- 1=Monday, 2=Tuesday, ..., 7=Sunday
  status                  text not null default 'active'
                            check (status in ('active', 'paused', 'cancelled')),
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

create index if not exists idx_user_subscriptions_user_id
  on user_subscriptions(user_id);

-- ── Subscription Items ────────────────────────────────────────────────────────
create table if not exists subscription_items (
  id                  uuid primary key default uuid_generate_v4(),
  subscription_id     uuid references user_subscriptions(id) on delete cascade not null,
  product_id          uuid references products(id) on delete restrict not null,
  frequency_weeks     smallint not null check (frequency_weeks in (1, 2, 4)),
  -- 1 = weekly, 2 = biweekly, 4 = monthly
  quantity            integer not null default 1 check (quantity > 0),
  next_delivery_date  date not null,
  status              text not null default 'active'
                        check (status in ('active', 'paused', 'cancelled')),
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index if not exists idx_subscription_items_subscription_id
  on subscription_items(subscription_id);
create index if not exists idx_subscription_items_product_id
  on subscription_items(product_id);
create index if not exists idx_subscription_items_next_delivery
  on subscription_items(next_delivery_date);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table products enable row level security;
alter table user_subscriptions enable row level security;
alter table subscription_items enable row level security;

-- Products: public read
create policy "Products are publicly readable"
  on products for select using (true);

-- Subscriptions: users manage their own
create policy "Users manage own subscriptions"
  on user_subscriptions for all
  using (auth.uid() = user_id);

-- Subscription items: users manage items in their own subscriptions
create policy "Users manage own subscription items"
  on subscription_items for all
  using (
    exists (
      select 1 from user_subscriptions
      where user_subscriptions.id = subscription_items.subscription_id
        and user_subscriptions.user_id = auth.uid()
    )
  );

-- ── Trigger: update updated_at ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_user_subscriptions_updated_at
  before update on user_subscriptions
  for each row execute function set_updated_at();

create trigger trg_subscription_items_updated_at
  before update on subscription_items
  for each row execute function set_updated_at();

-- ── Sample Data (optional — remove for production) ───────────────────────────
insert into products (name, description, price, vendor, objective, image_url, unit, stock, tags)
values
  ('Gold Standard 100% Whey – Vanilla', 'Proteína de suero de alta calidad, 24g de proteína por porción.', 59.99, 'Optimum Nutrition', 'Ganancia Muscular', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80', '2 lbs / 907g', 50, ARRAY['proteína','whey','post-entrenamiento']),
  ('Gold Standard 100% Whey – Chocolate', 'La fórmula más vendida del mundo, 25g de proteína por scoop.', 59.99, 'Optimum Nutrition', 'Ganancia Muscular', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80', '2 lbs / 907g', 45, ARRAY['proteína','whey','post-entrenamiento']),
  ('Micronized Creatine Monohydrate', 'Creatina micronizada pura para máxima fuerza y potencia.', 24.99, 'Optimum Nutrition', 'Fuerza y Potencia', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80', '300g / 60 servicios', 80, ARRAY['creatina','fuerza','potencia']),
  ('Impact Whey Protein – Strawberry', 'Proteína de alta calidad a precio imbatible, 21g por porción.', 44.99, 'MyProtein', 'Ganancia Muscular', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', '1 kg / 40 servicios', 60, ARRAY['proteína','whey','economico']),
  ('THE Pre-Workout', 'Fórmula avanzada con cafeína, beta-alanina y citrulina.', 34.99, 'MyProtein', 'Rendimiento', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80', '420g / 30 servicios', 35, ARRAY['pre-entreno','energía','cafeína']),
  ('Essential BCAA 2:1:1', 'Aminoácidos ramificados esenciales para recuperación muscular.', 19.99, 'MyProtein', 'Recuperación', 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?w=400&q=80', '250g / 50 servicios', 70, ARRAY['bcaa','aminoácidos','recuperación']),
  ('Sport Organic Protein – Vanilla', 'Proteína orgánica certificada USDA, fuente vegana.', 49.99, 'Garden of Life', 'Nutrición Limpia', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80', '806g / 20 servicios', 25, ARRAY['vegano','orgánico','proteína vegetal']),
  ('Raw Organic Perfect Food Green Superfood', '34 superalimentos orgánicos crudos, probióticos y enzimas.', 39.99, 'Garden of Life', 'Nutrición Limpia', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', '240g / 30 servicios', 30, ARRAY['superfoods','vegano','orgánico','greens']),
  ('C4 Original Pre-Workout – Icy Blue Razz', 'El pre-entrenamiento más vendido de América, 150mg cafeína.', 29.99, 'Cellucor', 'Rendimiento', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80', '195g / 30 servicios', 55, ARRAY['pre-entreno','energía','cafeína','pump']),
  ('C4 Ripped Pre-Workout', 'Energía + quema de grasa con L-Carnitina y CLA.', 34.99, 'Cellucor', 'Pérdida de Grasa', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80', '200g / 30 servicios', 40, ARRAY['pre-entreno','quemagrasa','definición']),
  ('Pea Protein – Natural Unflavored', 'Proteína de guisante sin saborizantes, 24g por porción.', 27.99, 'NOW Sports', 'Nutrición Limpia', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80', '680g / 24 servicios', 45, ARRAY['proteína vegetal','sin alérgenos','limpio']),
  ('Ultra Omega-3 Fish Oil', 'Aceite de pescado, 750mg EPA + 500mg DHA por softgel.', 22.99, 'NOW Sports', 'Salud General', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80', '180 softgels', 90, ARRAY['omega-3','salud cardiovascular','suplemento'])
on conflict do nothing;
