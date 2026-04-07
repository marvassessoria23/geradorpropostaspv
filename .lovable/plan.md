

# Redesign: Split-Panel Editor with Form-Based Editing and Page Management

## Overview

Major refactor of the proposal editor from inline-editing on the preview to a professional split-panel interface: form fields on the left, live preview on the right. Add page management (add/duplicate/remove), automatic numbering, view mode toggle, and embed the uploaded logo.

## Architecture

```text
┌─────────────────────────────────────────────────┐
│  Header (toolbar: settings, PDF, view toggle)   │
├──────────────────────┬──────────────────────────┤
│   Edit Panel (40%)   │   Preview Panel (60%)    │
│                      │                          │
│  Section tabs/nav    │  Live proposal render    │
│  Form fields         │  (pages or continuous)   │
│  Page management     │                          │
│  Team management     │                          │
└──────────────────────┴──────────────────────────┘
```

## Changes

### 1. Copy logo to project
- Copy `user-uploads://LOGO_PAIVA_NUNES.png` to `src/assets/logo-paiva-nunes.png`
- Use in PageCover and header instead of SVG placeholder

### 2. Update `types.ts` - Add page management types
- Add `ProposalPage` interface with `id`, `type` (section key), `visible`, `order`
- Add `pages: ProposalPage[]` to `ProposalData` to replace `visibleSections`
- Add `viewMode: "pages" | "continuous"` to `ProposalData`
- Keep all existing content fields

### 3. Create `EditorPanel.tsx` - Left-side form panel
- Sidebar with section navigation (accordion or tabs per page type)
- For each section, render appropriate form fields:
  - **Capa**: client name, subtitle
  - **Diagnostico**: greeting, intro, body, jurisprudencia, conclusao (all as textareas)
  - **Estrategia**: intro, each movimento's fields
  - **Argumentos**: table editor (add/remove rows)
  - **Sobre**: institutional texts
  - **Equipe**: team member cards with photo upload, name, role, category
  - **Investimento**: fee fields
  - **Fechamento**: steps list, CTA
  - **Contato**: phone, social, website, slogan
- Page management buttons per section: duplicate, remove, move up/down
- "Add Page" button that lets user pick a page type to insert
- Settings section: text size, view mode toggle

### 4. Refactor `ProposalEditor.tsx`
- Split layout into two panels using CSS grid/flex (left 40%, right 60%)
- Left: `<EditorPanel>` with scrollable form
- Right: scrollable preview area rendering all visible pages
- Remove inline `EditableText` from all page components - pages become read-only display
- Automatic page numbering: compute from visible pages array index
- View mode toggle: "pages" (with gaps between pages) vs "continuous" (no gaps, scroll)

### 5. Update all Page components to display-only
- Remove `EditableText` imports, replace with plain elements (`<p>`, `<h2>`, etc.)
- Remove `onChange` prop - pages only receive `data` for display
- Add `pageNumber` prop for automatic numbering
- **PageCover**: use imported logo image instead of SVG
- All pages keep exact same visual styling

### 6. Page management logic in ProposalEditor
- `addPage(type)`: append a new page of given type, auto-number
- `duplicatePage(id)`: clone page data and insert after original
- `removePage(id)`: remove page, re-number remaining
- Pages stored as ordered array; numbering derived from index

### 7. Automatic page break / overflow handling
- For long-content sections (diagnostico, estrategia), measure content height
- If content exceeds page aspect-ratio bounds, split into continuation pages in the preview
- Use CSS `break-inside: avoid` for PDF generation

### 8. View mode toggle
- Add toggle button in header: "Páginas" / "Contínuo"
- Pages mode: each page rendered with gap, aspect-ratio 16:9
- Continuous mode: pages stack without gaps, full-width scrollable document

## Technical Notes
- All editing happens via controlled form inputs (Input, Textarea from shadcn/ui)
- Preview updates in real-time via React state
- No AI dependency - pure client-side logic
- PDF generation unchanged (html2canvas + jsPDF from preview)
- Logo imported as ES module from `src/assets/`

