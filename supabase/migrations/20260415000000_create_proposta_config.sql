create table proposta_config (
  id text primary key default 'config_global',
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

alter table proposta_config enable row level security;

create policy "Allow public read" on proposta_config for select using (true);
create policy "Allow public update" on proposta_config for update using (true);
create policy "Allow public insert" on proposta_config for insert with check (true);

insert into proposta_config (id, data) values ('config_global', '{}');
