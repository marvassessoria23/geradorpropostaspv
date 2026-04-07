

# Complete Overhaul: Premium Legal Proposal Generator

## Overview

Full rewrite of all page components, types, editor panel, and CSS to match the original Google Slides design with exact colors, new "Avaliações" section, Lato font, and proper slide structure.

## Key Changes

### 1. Update types.ts
- Add `PageType: "avaliacoes"` 
- Add new fields: `nomeEscritorio`, `subtituloEscritorio`, `logoImage` (upload), `fotoSobre`, `fotoProximosPassos` (rename from `fechamentoImage`)
- Add `avaliacoes` data: `notaGoogle`, `totalAvaliacoes`, `avaliacoes: Array<{id, nome, nota, texto}>`
- Add `youtube`, `linkedin`, `tiktok` to contact fields
- Rename `fechamentoImage` to `fotoProximosPassos`, `contatoImage` to `fotoContato`
- Update `defaultPages` to include `avaliacoes` between `equipe` and `investimento`
- Update `PAGE_TYPE_LABELS` accordingly

### 2. Update index.css - Design tokens and fonts
- Replace `Inter` with `Lato` in Google Fonts import
- Update CSS variables to exact colors from the spec:
  - `--proposal-dark: #0d2b45` (was `hsl(200 55% 18%)`)
  - `--proposal-cream: #f5f0e8`
  - `--proposal-gold: #c9a84c`
  - `--proposal-gold-light: #e8c96a`
  - `--proposal-text-dark: #1a3a5c`
- Update `.font-body` to use `'Lato', sans-serif`
- Change `.proposal-page` to use fixed dimensions: `width: 1280px; min-height: 720px; overflow: visible` (no aspect-ratio constraint)
- Add `.proposal-page-light` with `#f5f0e8` background and watermark
- Update `.page-number` to white text on gold circle, bottom-left
- Add dark slide geometric decorations (circles/diamonds at low opacity)

### 3. Update tailwind.config.ts
- Update color values to match hex spec

### 4. Rewrite all 10 page components

**PageCover (dark)**: Split layout - left side with title "Proposta de Honorários" in gold, client name in white, logo at bottom-left. Right side: uploaded photo with gradient overlay. Geometric decorations on dark bg.

**PageDiagnostico (light)**: Gold badge bar "CONTEXTO DA DEMANDA", title, greeting, paragraphs. Decorative circles top-right. Light bg `#f5f0e8`.

**PageEstrategia (light, split)**: Gold sidebar bar + title + content. Right side optional photo. Multiple sub-pages for movements. Light bg with gold vertical bar accent.

**PageArgumentos (light)**: Large H1 title, 3-column table with navy header, alternating cream rows.

**PageSobre (light)**: Gold sidebar + title + text + CTA button. Optional right photo.

**PageEquipe (dark)**: Dark bg, gold title, team grid by category. Member photos 80x80 circular with gold border. Grid: gestao max 4 cols, juridico/admin max 7 cols.

**PageAvaliacoes (NEW, gold bg `#e8c96a`)**: Google rating display, grid of review cards with reviewer name, star rating, text.

**PageInvestimento (dark)**: Two side-by-side cards, footer with payment info.

**PageFechamento/ProximosPassos (dark, split)**: Vertical timeline with numbered steps, CTA text. Right side: uploaded photo.

**PageContato (light, split)**: Left side: uploaded photo. Right side: logo, contact icons (phone, instagram, youtube, linkedin, tiktok, website), text, slogan.

### 5. Rewrite EditorPanel.tsx
- Add tabs for all sections including new "Avaliações" and "Aparência"
- **Aparência tab**: color pickers for `corFundo` (dark bg) and `corDestaque` (gold), logo size slider, logo position select
- **Capa tab**: add `nomeEscritorio`, `subtituloEscritorio`, `logoImage` upload
- **Avaliações tab**: `notaGoogle`, `totalAvaliacoes`, dynamic array of reviews with add/remove
- **Contato tab**: add `youtube`, `linkedin`, `tiktok` fields
- **Sobre tab**: add `fotoSobre` upload
- Keep all existing page management (reorder, duplicate, remove, visibility)

### 6. Update ProposalEditor.tsx
- Add `PageAvaliacoes` import and render case
- Update page numbering to account for new page
- Preview scaling: use `transform: scale()` based on container width for proper slide proportions
- PDF: await `document.fonts.ready` before capture, use scale:2

### 7. Create PageAvaliacoes.tsx (new)
- Gold/yellow background (`#e8c96a`)
- Title "O que nossos clientes dizem"
- Google rating badge (star + number + total)
- Grid of review cards (white bg, reviewer name, stars, text)
- Page number circle

## Technical Notes
- All slides use fixed 1280x720 reference, scaled in preview via CSS transform
- Overflow: visible on all slides (never clip content)
- No changes to the split-panel architecture (left form / right preview)
- Lato font loaded from Google Fonts alongside Playfair Display
- All image uploads remain base64 via FileReader

