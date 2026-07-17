create extension if not exists pgcrypto;

create table if not exists public.news_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  feed_url text not null unique,
  site_url text,
  default_category text not null check (default_category in ('nz-pacific','australia','politics','business','community','sports')),
  source_type text not null default 'commercial' check (source_type in ('official','commercial')),
  auto_publish boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('nz-pacific','australia','politics','business','community','sports','sams-view')),
  summary text not null,
  source_name text not null,
  source_url text not null,
  image_url text,
  community_angle text,
  author text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  source_id uuid references public.news_sources(id) on delete set null,
  import_method text not null default 'manual' check (import_method in ('manual','rss','submission')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.stories drop constraint if exists stories_source_url_key;
create index if not exists stories_source_url_idx on public.stories(source_url);
create index if not exists stories_status_published_idx on public.stories(status, published_at desc);
create index if not exists stories_category_idx on public.stories(category);

create table if not exists public.import_logs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.news_sources(id) on delete set null,
  source_name text not null,
  imported_count integer not null default 0,
  skipped_count integer not null default 0,
  error_message text,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.story_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  location text,
  category text not null,
  title text not null,
  story text not null,
  source_url text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.news_sources enable row level security;
alter table public.stories enable row level security;
alter table public.import_logs enable row level security;
alter table public.contact_messages enable row level security;
alter table public.story_submissions enable row level security;
-- No public policies are intentionally created. The application accesses these tables only through server-side routes using the service-role key.
