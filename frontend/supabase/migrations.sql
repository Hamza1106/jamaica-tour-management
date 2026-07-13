-- ─────────────────────────────────────────────────────────────────────────────
-- Jamaica Tour Booker — Supabase Migration
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- Project: rjkvcfhfkfqvpzmqitcb
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. ENUMS ──────────────────────────────────────────────────────────────────
create type if not exists booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
create type if not exists booking_type as enum ('airport', 'tour', 'custom');
create type if not exists user_role as enum ('user', 'admin');

-- ── 2. PROFILES (extends auth.users) ─────────────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        user_role not null default 'user',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Auto-update updated_at
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create or replace trigger profiles_updated_at
  before update on profiles
  for each row execute procedure touch_updated_at();

-- ── 3. BOOKINGS ───────────────────────────────────────────────────────────────
create table if not exists bookings (
  id            text primary key default ('RES-' || upper(substring(gen_random_uuid()::text, 1, 8))),
  user_id       uuid not null references auth.users(id) on delete cascade,
  type          booking_type not null default 'airport',
  -- customer info (snapshot at time of booking)
  full_name     text not null,
  email         text not null,
  phone         text not null,
  -- trip details
  pickup        text not null,
  dropoff       text not null,
  scheduled_at  timestamptz not null,
  passengers    int not null default 1 check (passengers between 1 and 20),
  vehicle_id    text not null,
  -- tour (optional)
  tour_slug     text,
  tour_name     text,
  -- financials
  total_usd     numeric(10,2) not null check (total_usd >= 0),
  -- status & notes
  status        booking_status not null default 'pending',
  notes         text,
  -- timestamps
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create or replace trigger bookings_updated_at
  before update on bookings
  for each row execute procedure touch_updated_at();

-- Indexes for common queries
create index if not exists bookings_user_id_idx   on bookings(user_id);
create index if not exists bookings_status_idx    on bookings(status);
create index if not exists bookings_created_idx   on bookings(created_at desc);
create index if not exists bookings_scheduled_idx on bookings(scheduled_at desc);

-- ── 4. ROW LEVEL SECURITY ─────────────────────────────────────────────────────

-- Helper: is current user an admin?
create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;


-- Drop existing policies to allow re-run
do $$ begin
  drop policy if exists "Users can read own profile" on profiles;
  drop policy if exists "Users can update own profile" on profiles;
  drop policy if exists "Admins can read all profiles" on profiles;
  drop policy if exists "Users can insert own bookings" on bookings;
  drop policy if exists "Users can read own bookings" on bookings;
  drop policy if exists "Users can cancel own pending bookings" on bookings;
  drop policy if exists "Admins can read all bookings" on bookings;
  drop policy if exists "Admins can update any booking" on bookings;
  drop policy if exists "Admins can delete bookings" on bookings;
end $$;

-- PROFILES RLS
alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Admins can read all profiles"
  on profiles for select using (is_admin());

-- BOOKINGS RLS
alter table bookings enable row level security;

create policy "Users can insert own bookings"
  on bookings for insert with check (auth.uid() = user_id);

create policy "Users can read own bookings"
  on bookings for select using (auth.uid() = user_id);

create policy "Users can cancel own pending bookings"
  on bookings for update
  using (auth.uid() = user_id and status = 'pending')
  with check (status = 'cancelled');

create policy "Admins can read all bookings"
  on bookings for select using (is_admin());

create policy "Admins can update any booking"
  on bookings for update using (is_admin());

create policy "Admins can delete bookings"
  on bookings for delete using (is_admin());

-- ── 5. REALTIME ───────────────────────────────────────────────────────────────
-- Enable realtime for bookings table (admin dashboard live updates)
alter publication supabase_realtime add table bookings;

-- ── 6. MAKE YOURSELF ADMIN ───────────────────────────────────────────────────
-- After running this migration, run this separately with your own user's email:
--
-- update profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'your@email.com');
--
