

# Fix Empty Fields, Add FieldControls to Estratégia, Add Slide Hide Button

## Problem Summary
1. Empty fields in PageEstrategia (and other pages) render as blank space instead of being hidden
2. Estratégia section in EditorPanel has no FieldControls (no hide/delete/move/duplicate)
3. No way to hide slides directly from the preview

## Changes

### 1. All Page Components — Hide Empty Fields
Wrap every `InlineEditable` and text element with a conditional check: only render if the value is non-empty (`value && value.trim() !== ''`). Apply to all 10 page components.

Example pattern:
```tsx
{data.movimento1Title && data.movimento1Title.trim() !== '' && (
  <div style={{ background: '...' }}>
    <InlineEditable tag="h3" value={data.movimento1Title} ... />
  </div>
)}
```

Files: `PageEstrategia.tsx`, `PageDiagnostico.tsx`, `PageCover.tsx`, `PageSobre.tsx`, `PageArgumentos.tsx`, `PageEquipe.tsx`, `PageAvaliacoes.tsx`, `PageInvestimento.tsx`, `PageFechamento.tsx`, `PageContato.tsx`

### 2. EditorPanel — Add FieldControls to Estratégia Fields
Currently the estratégia section just renders 3 hardcoded movement blocks with no controls. Add:
- **FieldControls** (hide/show toggle) on each field within movimentos (title, intro, items, resultado, consignação, etc.)
- Track hidden state using a new `hiddenFields: Record<string, boolean>` in `ProposalData`
- Each field key like `movimento1Title`, `movimento1Intro`, etc. can be toggled
- In the preview, check `!data.hiddenFields?.[fieldKey]` before rendering

Also add FieldControls to **fechamento steps** (move up/down, duplicate, delete — already has add/remove but missing reorder and duplicate).

### 3. ProposalEditor — Slide Hide Button on Preview Hover
Add a floating button on each slide wrapper in the preview that appears on hover:
- Button in top-right corner with opacity 0, shown on parent hover
- Clicking toggles `page.visible`
- Hidden slides are filtered from preview (already done via `visiblePages`)
- Add CSS `.slide-wrapper:hover .slide-controls { opacity: 1 }` to `index.css`

### 4. Types Update
Add to `ProposalData`:
```typescript
hiddenFields?: Record<string, boolean>;
```

## Files Modified
- `src/components/proposal/types.ts` — add `hiddenFields`
- `src/components/proposal/ProposalEditor.tsx` — slide hover controls
- `src/components/proposal/EditorPanel.tsx` — FieldControls for estratégia fields + fechamento steps reorder
- `src/components/proposal/PageEstrategia.tsx` — empty field guards + hiddenFields check
- `src/components/proposal/PageDiagnostico.tsx` — empty field guards
- `src/components/proposal/PageCover.tsx` — empty field guards
- `src/components/proposal/PageSobre.tsx` — empty field guards
- `src/components/proposal/PageArgumentos.tsx` — empty field guards
- `src/components/proposal/PageAvaliacoes.tsx` — empty field guards
- `src/components/proposal/PageInvestimento.tsx` — empty field guards
- `src/components/proposal/PageFechamento.tsx` — empty field guards + step reorder
- `src/components/proposal/PageContato.tsx` — empty field guards
- `src/index.css` — `.slide-wrapper:hover .slide-controls` rule

## NOT Modified
- Save/load logic, image upload, PDF generation, print CSS

