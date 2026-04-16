

# Plano: PDF Definitivo com html-to-image + jsPDF

## Diagnóstico
- `html-to-image` **não está instalado**. `jspdf` provavelmente também não está. Preciso instalar ambos.
- Todos os 10 componentes de página já têm `data-slide` na div raiz (incluindo as 4 sub-páginas de Estratégia). Nada a ajustar aí.
- `.print-area` envolve a área scrollável, e dentro dela `.preview-scale-wrapper` aplica `transform: scale()`. O `html-to-image` captura cada `[data-slide]` individualmente passando `transform: 'none'` no style override, então o scale não interfere — não preciso reestruturar o JSX.
- Botão "Ocultar slide" (no hover) e tooltip de dica precisam ser excluídos da captura via filtro (`tagName === 'BUTTON'` já cobre o botão; tooltip recebe `data-pdf-exclude="true"`).
- CSS `@media print` (linhas 253–305 de `index.css`) e toda lógica `body.classList.add('printing')` / `window.print()` serão removidos.

## Mudanças (3 arquivos)

### 1. `package.json` — instalar dependências
```bash
npm install html-to-image jspdf
```

### 2. `src/components/proposal/ProposalEditor.tsx`
- Importar `toPng` de `html-to-image` e `jsPDF` de `jspdf`.
- Adicionar estado `isGeneratingPDF`.
- Substituir `generatePDF` pela versão assíncrona que itera `document.querySelectorAll('[data-slide]')`, gera PNG de cada slide com `pixelRatio: 2`, monta PDF A4 paisagem (297×210mm) e salva como `proposta.pdf`. Filtro exclui `BUTTON`, `.slide-controls`, `.slide-hover-controls` e `[data-pdf-exclude="true"]`.
- Adicionar overlay full-screen "Gerando PDF…" enquanto `isGeneratingPDF` for `true`.
- Adicionar `data-pdf-exclude="true"` no tooltip "💡 Clique em qualquer texto…" (linha 471).
- Botão de ocultar slide já é `<button>` → filtrado automaticamente.

### 3. `src/index.css`
- Remover completamente o bloco `@media print { … }` (linhas 253–305). Mantém o resto do arquivo intacto.

## Não modificado
- Salvamento (Supabase), upload de imagens, todos os componentes de página (`PageCover`, `PageDiagnostico`, `PageEstrategia`, etc.), lógica de auto-ocultar slides, sub-páginas, EditorPanel, classe `preview-scale-wrapper` (mantida para layout visual).

## Resultado esperado
- Clicar em "Gerar PDF" mostra overlay, gera um arquivo `proposta.pdf` A4 paisagem, uma página por slide visível, sem botões/tooltips, com fontes e cores corretas, sem dependência de `window.print()`.

