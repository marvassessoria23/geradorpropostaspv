

# Plano: generateHTML — documento somente leitura perfeito

## Diagnóstico
A `generateHTML` atual já faz base64 e clone, mas:
- Não remove `contenteditable` nem atributos de edição → usuário pode editar.
- Não tem wrapper visual `.slide-wrapper` → falta sombreamento e centralização.
- Não bloqueia seleção/cursor → parece editor, não documento final.

## Mudança (1 arquivo: `src/components/proposal/ProposalEditor.tsx`)

Substituir o corpo da função `generateHTML` existente pela versão fornecida pelo usuário, com:

1. **Limpeza de interatividade no clone:**
   - `querySelectorAll` removendo `button`, `[data-pdf-exclude]`, `[contenteditable]`, `.slide-controls`, `.slide-hover-controls`.
   - Loop em `clone.querySelectorAll('*')` removendo atributos `contenteditable`, `data-slide`, `spellcheck`, `tabindex` e aplicando `cursor: default`, `user-select: none`.
   - `img.draggable = false` + `pointer-events: none`.

2. **Conversão de imagens (mantida):** `urlToBase64` para `<img src>` e `background-image: url(...)` inline, em paralelo via `Promise.all`.

3. **Estrutura visual:** envolver cada slide em `<div class="slide-wrapper">` dentro de `.slide-container` com `flex column`, `gap: 4px`, sombreamento `box-shadow: 0 4px 24px rgba(0,0,0,0.5)`.

4. **CSS global de bloqueio:**
   - Reset universal com `user-select: none`, `cursor: default`, `print-color-adjust: exact`.
   - `[contenteditable] { pointer-events: none }`, `button { display: none }`.
   - Bloco `@media print` com `@page { size: A4 landscape; margin: 0 }`, remove sombras e gaps.

5. **try/catch/finally** garante `setIsGeneratingHTML(false)` mesmo em erro, com `alert` para feedback.

## Não modificado
- `generatePDF`, salvamento Supabase, upload de imagens, EditorPanel, componentes de página, overlay `isGeneratingHTML` (já existe), botão "Gerar HTML" (já existe).

## Resultado esperado
Arquivo `proposta.html` autocontido, abre offline com:
- Imagens em base64 renderizadas.
- Texto visível mas não editável nem selecionável.
- Slides centralizados com sombra (visualização web), e `Ctrl+P` imprime A4 paisagem sem margens.

