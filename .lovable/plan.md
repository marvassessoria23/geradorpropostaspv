

# Migrar Imagens para Supabase Storage

## Diagnóstico
A tabela `proposta_imagens` tem 12 fotos (~12MB cada, ~144MB total). Queries individuais de ~12MB ainda dão timeout. O salvamento também falha silenciosamente. Resultado: ao recarregar, todas as fotos somem.

## Solução
Substituir todo o sistema de base64-no-banco por Supabase Storage. Imagens viram URLs públicas permanentes salvas diretamente no JSON da `proposta_config`.

## Alterações

### 1. Migration SQL — Criar bucket de Storage
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('proposta-imagens', 'proposta-imagens', true);
-- RLS policies para permitir upload/read/update/delete público
```

### 2. `ProposalEditor.tsx` — Reescrever lógica de imagens
- Remover funções `saveImage`, `deleteImage`, `loadImage`, `loadImageIds`, `sanitizeForSave`, `extractImages`, `rehydrateWithImages`
- Remover `prevImagesRef`, `saveImagesImmediately`
- Adicionar função `uploadToStorage(id, base64) → publicUrl` que converte base64 para blob e faz upload via `supabase.storage.from('proposta-imagens').upload()`
- Expor `uploadToStorage` para o `EditorPanel` via prop ou callback no `updateData`
- No auto-save debounced, salvar apenas o JSON (que agora contém URLs, não base64)
- No load, simplesmente usar os dados do JSON — URLs públicas carregam sozinhas pelo navegador

### 3. `EditorPanel.tsx` — Upload imediato ao selecionar imagem
- No `ImageUploadField.onUpload`, chamar `uploadToStorage` antes de atualizar o estado
- Mostrar feedback de loading durante upload
- O estado recebe a URL pública, não o base64

### 4. Migrar imagens existentes (one-time)
- Adicionar lógica no load que detecta se algum campo tem `img:` reference ou base64 inline
- Se encontrar, fazer upload para Storage e substituir no estado
- Isso garante que as 12 fotos existentes no banco sejam migradas automaticamente

### 5. Cleanup
- Remover `beforeunload` backup de localStorage (não precisa mais, JSON é leve)
- A tabela `proposta_imagens` pode ser ignorada/removida depois

## Arquivos Modificados
- Migration SQL (criar bucket + policies)
- `src/components/proposal/ProposalEditor.tsx` — nova lógica Storage
- `src/components/proposal/EditorPanel.tsx` — upload assíncrono com feedback

