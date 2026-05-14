-- NutriLogistics – Supabase Schema
-- Run this in the Supabase SQL Editor to set up your database

-- ─── Products ────────────────────────────────────────────────────────────────

create table if not exists products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text,
  price         numeric(10,2) not null,
  image_url     text,
  vendor        text not null,
  goal          text not null check (goal in ('muscle_gain','fat_loss','endurance','wellness')),
  category      text,
  unit          text,
  stock         integer default 0,
  rating        numeric(3,2) default 0,
  reviews_count integer default 0,
  created_at    timestamptz default now()
);

-- ─── User Subscriptions ───────────────────────────────────────────────────────

create table if not exists user_subscriptions (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null,   -- references auth.users(id)
  status                   text not null default 'active' check (status in ('active','paused','cancelled')),
  delivery_day_preference  integer not null default 1 check (delivery_day_preference between 0 and 6),
  created_at               timestamptz default now(),
  updated_at               timestamptz default now()
);

create index if not exists idx_user_subscriptions_user_id on user_subscriptions(user_id);

-- ─── Subscription Items ───────────────────────────────────────────────────────

create table if not exists subscription_items (
  id                  uuid primary key default gen_random_uuid(),
  subscription_id     uuid not null references user_subscriptions(id) on delete cascade,
  product_id          uuid not null references products(id) on delete restrict,
  quantity            integer not null default 1 check (quantity > 0),
  frequency_weeks     integer not null default 2 check (frequency_weeks in (1, 2, 4)),
  next_delivery_date  date,
  is_paused           boolean not null default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now(),

  unique (subscription_id, product_id)
);

create index if not exists idx_subscription_items_subscription_id on subscription_items(subscription_id);
create index if not exists idx_subscription_items_next_delivery on subscription_items(next_delivery_date);

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table products             enable row level security;
alter table user_subscriptions   enable row level security;
alter table subscription_items   enable row level security;

-- Public read on products
create policy "Public can read products"
  on products for select using (true);

-- Users can only manage their own subscriptions
create policy "Users manage own subscriptions"
  on user_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own subscription items"
  on subscription_items for all
  using (
    subscription_id in (
      select id from user_subscriptions where user_id = auth.uid()
    )
  )
  with check (
    subscription_id in (
      select id from user_subscriptions where user_id = auth.uid()
    )
  );

-- ─── Updated At Trigger ───────────────────────────────────────────────────────

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_user_subscriptions_updated_at
  before update on user_subscriptions
  for each row execute function update_updated_at();

create trigger trg_subscription_items_updated_at
  before update on subscription_items
  for each row execute function update_updated_at();

-- ─── Seed Products (optional) ─────────────────────────────────────────────────

insert into products (name, description, price, image_url, vendor, goal, category, unit, stock, rating, reviews_count) values
  ('Impact Whey Protein Chocolate', 'Proteína de suero de alta calidad con 21g de proteína por porción.', 34.99, 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80', 'MyProtein', 'muscle_gain', 'Proteínas', '1kg', 150, 4.8, 2341),
  ('Creatine Monohydrate', 'Creatina monohidratada pura para maximizar la fuerza.', 18.50, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80', 'MyProtein', 'muscle_gain', 'Creatina', '500g', 200, 4.9, 5129),
  ('Gold Standard Whey Double Chocolate', '24g de proteína, baja en grasa y carbohidratos.', 54.99, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', 'Optimum Nutrition', 'muscle_gain', 'Proteínas', '2.27kg', 65, 4.9, 8921),
  ('C4 Original Pre-Workout Watermelon', 'El pre-entreno #1 en ventas. Energía explosiva y rendimiento extremo.', 32.99, 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80', 'Cellucor', 'endurance', 'Pre-Entreno', '390g', 95, 4.8, 9876),
  ('Sport Organic Plant Protein Vanilla', '30g de proteína de guisante, cáñamo y semillas de chía. Certificada orgánica.', 52.99, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', 'Garden of Life', 'wellness', 'Proteínas Veganas', '806g', 55, 4.7, 1203)
on conflict do nothing;
