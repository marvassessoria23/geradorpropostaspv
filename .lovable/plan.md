

# Plano: Botão "Gerar HTML" + revisão do PDF

## Diagnóstico
- **Parte 2 (PDF):** A função `generatePDF` atual (linhas 302–412) **já implementa** a lógica de quebra em subpáginas A4 com `naturalHeight = scrollHeight`, `numPages = ceil(naturalHeight / 720)` e `yOffsetMm = -p * A4_H_MM`. É funcionalmente equivalente à versão proposta. Mantenho como está.
- **Parte 1 (HTML):** Não existe. Preciso adicionar função `generateHTML` + botão no header.
- Imports `toPng`, `jsPDF`, `useState isGeneratingPDF`, overlay, todos `[data-slide]` — confirmados ✓.

## Mudança (1 arquivo: `ProposalEditor.tsx`)

### A. Adicionar função `generateHTML` logo após `generatePDF` (~linha 412)
- Coleta CSS de `document.styleSheets` (try/catch por sheet para evitar erros CORS).
- Clona cada `[data-slide]`, remove `button` e `[data-pdf-exclude]`, força `width/height/min/max: 1280px×720px`, `overflow: hidden`, `transform: none`, `pageBreakAfter: always`.
- Monta HTML standalone com:
  - Charset, viewport, fontes Playfair Display + Lato via Google Fonts.
  - Reset `*` com `print-color-adjust: exact`.
  - Bloco `@media print` com `@page { size: A4 landscape; margin: 0 }`.
  - CSS coletado da página atual.
- Cria `Blob` `text/html`, dispara download como `proposta.html`.

### B. Adicionar botão "🌐 Gerar HTML" no header
Inserir antes do botão "Gerar PDF" (linha 483), mesmo estilo mas variante outline (borda dourada, fundo transparente) para diferenciar visualmente.

## Não modificado
- `generatePDF` (já correto), salvamento Supabase, upload de imagens, EditorPanel, `index.css`, todos os 10 componentes de página, sub-páginas do PageEstrategia, overlay de loading.

## Resultado esperado
- **Botão "Gerar HTML":** baixa `proposta.html` autocontido, abre em qualquer browser preservando layout, fontes, cores; pronto para imprimir como PDF nativo (Ctrl+P → A4 paisagem).
- **Botão "Gerar PDF":** continua funcionando com a lógica atual (subpáginas automáticas para slides altos).

