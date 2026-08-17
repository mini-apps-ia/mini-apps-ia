-- =============================================
-- Mini Apps IA - Schema Supabase (rodar no SQL Editor)
-- =============================================

-- Perfis criados automaticamente no cadastro
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- Assinatura de cada usuário por mini app
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan text not null, -- 'devocional' | 'conteudo'
  status text not null default 'pending', -- pending | authorized | cancelled | paused
  active boolean not null default false,
  mp_preapproval_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Histórico de devocionais gerados
create table if not exists public.devocionais (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text not null,
  created_at timestamptz not null default now()
);

-- Histórico de conteúdos gerados
create table if not exists public.conteudos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text,
  input jsonb,
  output text not null,
  created_at timestamptz not null default now()
);

-- Agendamento diário de devocional por usuário
create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ativo boolean not null default false,
  horario text not null default '07:00',
  tema_preferido text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- Trigger: cria o perfil no primeiro login
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.devocionais enable row level security;
alter table public.conteudos enable row level security;
alter table public.agendamentos enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "subscriptions_insert_own" on public.subscriptions;
create policy "subscriptions_insert_own"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

drop policy if exists "subscriptions_update_own" on public.subscriptions;
create policy "subscriptions_update_own"
  on public.subscriptions for update
  using (auth.uid() = user_id);

drop policy if exists "devocionais_all_own" on public.devocionais;
create policy "devocionais_all_own"
  on public.devocionais for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "conteudos_all_own" on public.conteudos;
create policy "conteudos_all_own"
  on public.conteudos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "agendamentos_all_own" on public.agendamentos;
create policy "agendamentos_all_own"
  on public.agendamentos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);