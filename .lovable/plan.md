

# Persistência Global com Supabase

## Pré-requisito
Ativar Lovable Cloud no projeto para ter Supabase integrado. Isso criará os arquivos em `src/integrations/supabase/`.

## Alterações

### 1. Criar tabela `proposta_config`
Migration SQL:
```sql
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
```

RLS aberta (select/insert/update para todos) porque o sistema é uma ferramenta interna sem autenticação — qualquer pessoa que acesse vê e edita os mesmos dados.

### 2. Reescrever `ProposalEditor.tsx`
- Remover localStorage (remover `STORAGE_KEY`, `loadSavedData`, e o `useEffect` de auto-save local)
- Adicionar estados: `isLoading` (true inicialmente), `saveStatus` ('saved' | 'saving' | 'error')
- Adicionar `saveTimerRef = useRef<NodeJS.Timeout | null>(null)`
- **Carregar do Supabase ao montar**: `useEffect` assíncrono que faz `supabase.from('proposta_config').select('data').eq('id','config_global').single()`, seta `data` se existir, seta `isLoading = false`
- **Salvar com debounce de 1s**: `useEffect` que observa `data`, ignora se `isLoading`, faz `clearTimeout` + `setTimeout(1000)` para upsert no Supabase
- Mostrar tela de loading enquanto `isLoading === true`
- Mostrar indicador de salvamento no header (✓ Salvo / ⏳ Salvando... / ⚠ Erro)

### 3. Atualizar `EditorPanel.tsx`
- Remover o botão "Limpar e começar do zero" que usa localStorage
- Substituir por botão que faz upsert de `defaultProposalData` no Supabase e recarrega

### 4. Registrar tipo da tabela
Adicionar `proposta_config` aos tipos TypeScript gerados do Supabase para que o cliente tipado funcione.

## Arquivos Modificados
- Migration SQL (nova tabela)
- `src/components/proposal/ProposalEditor.tsx` — Supabase load/save substituindo localStorage
- `src/components/proposal/EditorPanel.tsx` — botão reset via Supabase
- `src/integrations/supabase/types.ts` — tipo da tabela

