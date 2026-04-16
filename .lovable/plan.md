

# Inline Editing + Field Controls for All Slides

## Scope
Add two features without touching persistence, image upload, PDF generation, or print CSS.

## What Changes

### 1. New Component: `InlineEditable.tsx`
Reusable `contentEditable` wrapper. Props: `value`, `onChange`, `className`, `style`, `multiline`, `tag`. Shows gold outline on focus, dashed outline on hover. Syncs with panel via shared `data` state.

### 2. New Component: `FieldControls.tsx`
Toolbar with visibility toggle, move up/down, duplicate, delete buttons. Used only for dynamic array items (argumentos, team members, avaliacoes, fechamento steps). Fixed fields (titles, paragraphs) do not get controls — they are always visible and editable inline.

### 3. Types Update (`types.ts`)
Add `hidden?: boolean` to `ArgumentRow`, `Avaliacao`, `TeamMember`. No changes to `ProposalData` structure or `ProposalPage`.

### 4. Update All 10 Page Components
Each page component receives an `onChange` prop (same `(updates: Partial<ProposalData>) => void` from ProposalEditor). Replace static `{data.fieldName}` text renders with `<InlineEditable value={data.fieldName} onChange={(v) => onChange({ fieldName: v })} />` preserving all existing styles. Array items check `!item.hidden` before rendering.

Pages affected:
- **PageCover** — clientName, nomeEscritorio, subtituloEscritorio
- **PageDiagnostico** — diagnosticoTitle, diagnosticoGreeting, diagnosticoIntro, diagnosticoBody, diagnosticoJurisprudencia, diagnosticoConclusao
- **PageEstrategia** — estrategiaIntro, all movimento fields
- **PageArgumentos** — each row's argumento, fundamento, observacao
- **PageSobre** — sobreTitle, sobreText1/2/3
- **PageEquipe** — member name, role (within MemberCircle)
- **PageAvaliacoes** — av.nome, av.texto
- **PageInvestimento** — all honorario fields, parcelamento, validadeProposta
- **PageFechamento** — each step text, fechamentoCTA
- **PageContato** — telefone, instagram, social fields, contatoTexto, contatoSlogan

### 5. Update `ProposalEditor.tsx`
Pass `onChange={updateData}` to every page component. No changes to save logic, image logic, or PDF logic.

### 6. CSS Addition (`index.css`)
Add hover/focus styles for `[contenteditable]` elements. Exclude from print with `body.printing [contenteditable]` reset.

### 7. Tooltip on First Load
Show a dismissable tip "Clique em qualquer texto no preview para editar" for 5 seconds on mount.

## Files Modified
- `src/components/proposal/types.ts` — add `hidden?` to interfaces
- `src/components/proposal/InlineEditable.tsx` — new
- `src/components/proposal/FieldControls.tsx` — new
- `src/components/proposal/PageCover.tsx` — inline editable
- `src/components/proposal/PageDiagnostico.tsx` — inline editable
- `src/components/proposal/PageEstrategia.tsx` — inline editable
- `src/components/proposal/PageArgumentos.tsx` — inline editable + hidden filter
- `src/components/proposal/PageSobre.tsx` — inline editable
- `src/components/proposal/PageEquipe.tsx` — inline editable + hidden filter
- `src/components/proposal/PageAvaliacoes.tsx` — inline editable + hidden filter
- `src/components/proposal/PageInvestimento.tsx` — inline editable
- `src/components/proposal/PageFechamento.tsx` — inline editable + hidden filter
- `src/components/proposal/PageContato.tsx` — inline editable
- `src/components/proposal/ProposalEditor.tsx` — pass onChange to pages, add tooltip
- `src/components/proposal/EditorPanel.tsx` — add FieldControls to array items
- `src/index.css` — contenteditable hover/focus styles

## NOT Modified
- Save/load logic in ProposalEditor
- Image upload to Storage
- PDF generation (`generatePDF`)
- Print CSS (`@media print`)
- `supabase/` anything

