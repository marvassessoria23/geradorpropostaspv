

# Fix PDF Export + Add Data Persistence

## Problem 1: PDF Export — Switch to `window.print()` with Print CSS

The current `html-to-image` + `jsPDF` approach has persistent issues with scale transforms, base64 images, and fonts. Replace it entirely with `window.print()`, which uses the browser's native rendering engine for perfect fidelity.

### Changes:

**`src/index.css`** — Add `@media print` block at the end:
- Hide everything except `.print-area` (`body > *:not(.print-area) { display: none }`)
- Style `.proposal-page` slides to `297mm × 210mm`, `page-break-after: always`, `transform: none`, no margin
- Set `@page { size: A4 landscape; margin: 0 }`
- Force `-webkit-print-color-adjust: exact`

**`src/components/proposal/ProposalEditor.tsx`**:
- Remove `html-to-image` and `jsPDF` imports
- Replace `generatePDF` with simple `window.print()` call
- Add `print-area` class to the preview wrapper div that contains all slides
- Remove the generating overlay (print dialog is native)
- Remove `generating` state since print is synchronous from our perspective

## Problem 2: localStorage Persistence

### Changes:

**`src/components/proposal/ProposalEditor.tsx`**:
- Define `STORAGE_KEY = 'proposta_dados_v1'`
- Initialize `data` state with lazy initializer that loads from `localStorage` (falling back to `defaultProposalData`)
- Add `useEffect` that saves `data` to `localStorage` on every change, with `try/catch` for `QuotaExceededError` (shows alert warning about image sizes)
- Keep `updateData` as-is — it already updates `data` state, which triggers the save effect

**`src/components/proposal/EditorPanel.tsx`**:
- Add a "Limpar e começar do zero" button at the bottom of the panel
- On click: `localStorage.removeItem(STORAGE_KEY)` then `window.location.reload()`

## Files Modified
- `src/index.css` — print CSS
- `src/components/proposal/ProposalEditor.tsx` — window.print + localStorage
- `src/components/proposal/EditorPanel.tsx` — reset button
- `package.json` — remove `html-to-image` dependency

