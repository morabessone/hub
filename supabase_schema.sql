-- NutriLogistics - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  vendor text not null,
  goal text not null,
  unit text not null,
  stock integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- User subscriptions
create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  status text check (status in ('active', 'paused', 'cancelled')) default 'active',
  delivery_day_preference integer check (delivery_day_preference between 0 and 6) default 2,
  next_delivery_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Subscription items (the individual products in a subscription)
create table if not exists public.subscription_items (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.user_subscriptions(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity integer default 1 check (quantity > 0),
  frequency_weeks integer check (frequency_weeks in (1, 2, 4)) default 1,
  is_paused boolean default false,
  next_delivery_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table public.products enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.subscription_items enable row level security;

-- Products: public read
create policy "Products are viewable by everyone"
  on public.products for select using (true);

-- Subscriptions: user can only see their own
create policy "Users can view own subscriptions"
  on public.user_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
  on public.user_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subscriptions"
  on public.user_subscriptions for update
  using (auth.uid() = user_id);

-- Subscription items: via subscription ownership
create policy "Users can view own subscription items"
  on public.subscription_items for select
  using (
    exists (
      select 1 from public.user_subscriptions
      where id = subscription_items.subscription_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert own subscription items"
  on public.subscription_items for insert
  with check (
    exists (
      select 1 from public.user_subscriptions
      where id = subscription_items.subscription_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update own subscription items"
  on public.subscription_items for update
  using (
    exists (
      select 1 from public.user_subscriptions
      where id = subscription_items.subscription_id
      and user_id = auth.uid()
    )
  );

-- Seed demo products
insert into public.products (name, description, price, vendor, goal, unit, stock) values
  ('Proteína Whey Gold Standard', 'Proteína de suero de alta calidad, 24g por porción. Ideal para recuperación muscular post-entreno.', 59.99, 'Optimum Nutrition', 'Ganancia muscular', '2 lbs', 50),
  ('Creatina Monohidratada', 'Creatina pura micronizada. Aumenta fuerza y rendimiento en entrenamientos de alta intensidad.', 24.99, 'Optimum Nutrition', 'Ganancia muscular', '300g', 80),
  ('Multivitamínico Sport', 'Complejo vitamínico completo para atletas activos. Más de 30 nutrientes esenciales.', 34.99, 'Garden of Life', 'Bienestar general', '90 cáps', 120),
  ('Colágeno Marino + Vitamina C', 'Colágeno hidrolizado tipo I y III para articulaciones, piel y recuperación muscular.', 42.99, 'Garden of Life', 'Recuperación', '200g', 60),
  ('Pre-Workout C4 Original', 'Energía explosiva antes del entrenamiento. Con beta-alanina, cafeína y vitaminas B.', 39.99, 'Cellucor', 'Energía', '390g', 45),
  ('BCAA 2:1:1 Instantáneo', 'Aminoácidos de cadena ramificada para reducir la fatiga y acelerar la recuperación.', 29.99, 'NOW Foods', 'Recuperación', '400g', 90),
  ('Fat Burner Termogénico', 'Fórmula termogénica con extracto de té verde, L-carnitina y piperina para quemar grasa.', 44.99, 'Cellucor', 'Pérdida de peso', '60 cáps', 70),
  ('Omega-3 Ultra Concentrado', 'Aceite de pescado de alta concentración EPA/DHA para inflamación y salud cardiovascular.', 27.99, 'NOW Foods', 'Bienestar general', '90 perlas', 100),
  ('Proteína Vegana Pea & Rice', 'Proteína de guisante y arroz integral. 20g por porción. Sin gluten ni lactosa.', 54.99, 'Garden of Life', 'Ganancia muscular', '1.5 lbs', 40),
  ('Glucosamina + Condroitina', 'Soporte articular premium con MSM para mayor movilidad y salud del cartílago.', 31.99, 'NOW Foods', 'Recuperación', '120 cáps', 55),
  ('L-Carnitina Líquida 3000', 'Transporta ácidos grasos a las mitocondrias. Máxima absorción en forma líquida.', 22.99, 'Optimum Nutrition', 'Pérdida de peso', '465ml', 65),
  ('Magnesio Bisglicinato 400', 'Magnesio altamente biodisponible para recuperación muscular, sueño y reducción del estrés.', 18.99, 'NOW Foods', 'Bienestar general', '120 cáps', 130)
on conflict do nothing;
