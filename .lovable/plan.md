

# Plano: refazer PDF (html2canvas), HTML, corrigir PageSobre, ocultar subslides

## Diagnóstico
- **PDF atual** usa `toPng` slide-a-slide com lógica complexa de overflow → instável. Trocar por `html2canvas` na `.print-area` inteira, com escala neutralizada.
- **HTML atual** usa `fetch+FileReader` para imagens (CORS / cache-buster pode falhar). Trocar por canvas DOM (`drawImage` no `<img>` já carregado).
- **PageSobre subslide 2** repete título "SOBRE A PAIVA NUNES" — corrigir para apenas continuação de texto.
- **Subslides** de Diagnóstico e Sobre não têm botão "Ocultar" no preview (Estrategia já tem via `HideButton`).

## Mudanças

### 1. `package.json` — instalar `html2canvas`
Adicionar dependência (via interface de pacotes do Lovable na fase build).

### 2. `src/components/proposal/types.ts`
Adicionar campos opcionais (`hiddenFields` já cobre via chaves dinâmicas — usar `subpage_diagnostico_2` e `subpage_sobre_2`, mesmo padrão do `PageEstrategia`). **Nenhuma mudança em types.ts.**

### 3. `src/components/proposal/ProposalEditor.tsx`
**a)** Importar `html2canvas`. Substituir `generatePDF` pela versão com `html2canvas` na `.print-area`, neutralizando o `transform: scale` do `.preview-scale-wrapper`, capturando em `scale: 1.5`, recortando em páginas A4 paisagem de 720px de altura.
**b)** Substituir `generateHTML` pela versão com `imgToBase64` via canvas DOM (usa `<img>` já renderizado, sem refetch). Manter sanitização (remover botões, contenteditable, etc.) e estrutura `.slide-container` + `.slide-wrapper`.
**c)** Manter overlays de loading (já existem).

### 4. `src/components/proposal/PageDiagnostico.tsx`
Adicionar `HideButton` interno (cópia do padrão do PageEstrategia) no subslide 2, com chave `subpage_diagnostico_2`. Atualizar `getDiagnosticoVisibleSubPages` para respeitar `data.hiddenFields?.subpage_diagnostico_2`.

### 5. `src/components/proposal/PageSobre.tsx`
- Remover título e badge do subslide 2 — apenas fundo bege, padding, e parágrafo `sobreText3` continuando.
- Adicionar `HideButton` no subslide 2 com chave `subpage_sobre_2`.
- Atualizar `getSobreVisibleSubPages` para respeitar `data.hiddenFields?.subpage_sobre_2`.

## Não modificado
- Salvamento Supabase, upload de imagens, `EditorPanel`, `index.css`, demais componentes de página.

## Resultado esperado
- **PDF:** captura única via `html2canvas` da `.print-area` em 1280px desnormalizado, dividida automaticamente em A4 paisagem 720px por página. Sem distorção, sem páginas em branco.
- **HTML:** offline, imagens em base64 via canvas DOM (mais robusto que fetch). Slides centralizados, somente leitura, Ctrl+P imprime A4 paisagem.
- **PageSobre slide 2:** apenas texto de continuação, sem título repetido.
- **Subslides:** cada um com botão "Ocultar sub-página" no hover (preview), persistido em `hiddenFields`.

