

# Fix PDF Export (Black Patches + Missing Images) + Generation Overlay

## Changes

### 1. Replace `generatePDF` in `ProposalEditor.tsx` (lines 53-104)
Replace with the user's provided implementation that:
- Moves each real slide DOM node temporarily into an unscaled `position:fixed; opacity:0` wrapper instead of cloning
- Resets `transform`, `width`, `position` on each slide before capture
- Waits 150ms per slide for layout settling
- Restores each slide to its original parent after capture
- Uses `allowTaint: true`, PNG format, no fixed width/height constraints on html2canvas
- This fixes both black patches (no forced 720px height) and missing images (real DOM nodes preserve base64 src)

### 2. Add fullscreen overlay during PDF generation
- Render a fixed overlay `div` when `generating === true` covering the entire viewport
- Show spinner + "Gerando PDF, aguarde..." message
- Style: `position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.7)` with centered white text and a CSS spinner
- Prevents user interaction while slides are being moved in the DOM

### 3. Verify image sources
- Quick audit of page components to confirm all `<img>` tags use base64 data or the imported `logoImg` asset (ES module import). No external URLs or relative paths should exist. The logo import `@/assets/logo-paiva-nunes.png` is bundled by Vite as a data URL or asset path — this is safe since html2canvas captures from the real DOM.

## Files Modified
- `src/components/proposal/ProposalEditor.tsx` — new generatePDF + overlay

