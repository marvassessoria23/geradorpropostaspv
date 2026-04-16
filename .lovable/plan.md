

# Fix: Force 1280x720 capture size in generatePDF

## Problem
`slide.offsetWidth` returns the scaled visual size (~768px), so `toPng` captures at low resolution and `jsPDF` stretches → distorted PDF.

## Solution
Override `width`/`height` to fixed 1280x720 in `toPng` options + style, ignoring the visual scale.

## Change (1 file, 1 function)

### `src/components/proposal/ProposalEditor.tsx`
Replace the entire `generatePDF` function with the version provided in the user message:
- Pass `width: 1280, height: 720` as top-level `toPng` options
- Style override: `transform: 'none'`, `transformOrigin: 'top left'`, fixed `width/height/minHeight/maxHeight: 1280px/720px`, `overflow: hidden`, `position: relative`
- `pixelRatio: 1.5`
- Filter excludes: `BUTTON`, `.slide-controls`, `.slide-hover-controls`, `[data-pdf-exclude="true"]`
- Adds image at A4 landscape (297×210mm)

## Verifications (read-only, no edits unless missing)
- `useState` for `isGeneratingPDF` already exists ✓ (added in previous turn)
- Loading overlay JSX already exists ✓ (added in previous turn)
- All 10 page components have `data-slide` on root div ✓ (confirmed in earlier plan)
- Imports `toPng` from `html-to-image` and `jsPDF` from `jspdf` already present ✓ (added in previous turn)

If any of the above is missing during build, I will add it; otherwise only `generatePDF` body changes.

## NOT Modified
Save/load, images, page components, EditorPanel, CSS, anything else.

