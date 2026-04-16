

# Plano: dividir PageDiagnostico (e similares) em subslides de 720px fixos

## Diagnóstico
- `PageDiagnostico.tsx` renderiza **1 único `[data-slide]`** sem altura fixa. Quando o texto cresce, o slide passa de 720px e quebra a captura PDF/HTML.
- `PageEstrategia.tsx` já implementa o padrão correto: retorna múltiplos `[data-slide]` em fragmento (`<>...</>`), cada um envolto em `<div data-proposal-page>`, e expõe `getEstrategiaVisibleSubPages` para o `ProposalEditor` ajustar `globalPageCounter`.
- `PageSobre.tsx`: 1 slide com texto + foto lateral, pode estourar com `sobreText1/2/3` longos.
- `PageContato.tsx`: cartão centralizado, conteúdo curto. Avaliação: **risco baixo** — manter como está, apenas adicionar `height: 720px` fixo + `overflow: hidden` defensivo.

## Mudanças (3 arquivos de página + 1 ajuste no editor)

### A. `PageDiagnostico.tsx` — dividir em até 2 subslides
- **Slide 1:** badge "CONTEXTO DA DEMANDA" + título + saudação + `diagnosticoIntro` + `diagnosticoBody`.
- **Slide 2 (condicional):** apenas se `diagnosticoJurisprudencia` ou `diagnosticoConclusao` tiverem conteúdo visível.
- Cada slide: `<div data-proposal-page>` envolvendo `<div className="slide watermark-light" data-slide style={{ width: 1280, height: 720, overflow: 'hidden', position: 'relative', padding: '48px 64px', backgroundColor: bg }}>`.
- Page number: slide 1 = `pageNumber`, slide 2 = `pageNumber + 1`.
- Exportar helper `getDiagnosticoVisibleSubPages(data): boolean[]` retornando `[temSlide1, temSlide2]`.

### B. `PageSobre.tsx` — dividir em até 2 subslides
- **Slide 1:** título + `sobreText1` + `sobreText2` + foto lateral (se houver) + badge "redes sociais".
- **Slide 2 (condicional):** apenas se `sobreText3` tiver conteúdo (parágrafo final isolado, layout sem foto, ocupa largura total).
- Cada slide com `width: 1280, height: 720, overflow: hidden` fixo.
- Exportar `getSobreVisibleSubPages(data): boolean[]`.

### C. `PageContato.tsx` — apenas reforço defensivo
- Adicionar `width: 1280, height: 720, overflow: 'hidden'` ao `[data-slide]` raiz. Sem divisão (conteúdo curto, centralizado).

### D. `ProposalEditor.tsx` — ajuste mínimo no contador de páginas
- Importar `getDiagnosticoVisibleSubPages` e `getSobreVisibleSubPages`.
- No bloco de `visiblePages.map` (linhas 716–725), adicionar mesmo padrão usado para `estrategia`:
  ```tsx
  if (page.type === "diagnostico") {
    const subs = getDiagnosticoVisibleSubPages(data);
    const extra = subs.filter(Boolean).length - 1;
    if (extra > 0) globalPageCounter += extra;
  }
  if (page.type === "sobre") { /* idem */ }
  ```

## Não modificado
- `generatePDF`, `generateHTML`, salvamento Supabase, upload de imagens, `EditorPanel`, `PageEstrategia`, demais páginas, `index.css`, `types.ts`.

## Resultado esperado
- Cada `[data-slide]` no DOM tem **exatamente 720px de altura**. PDF e HTML não distorcem mais.
- `PageDiagnostico` longo → 2 páginas A4 paisagem distintas, naturalmente paginadas.
- `PageSobre` longo → 2 páginas A4 paisagem distintas.
- Contadores de página continuam corretos no rodapé de cada slide.

