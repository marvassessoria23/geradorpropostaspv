

# Fix PDF Export, Add Per-Slide Background Color

## Changes

### 1. Fix PDF generation (`ProposalEditor.tsx`)
Replace `generatePDF` with the user's provided implementation:
- Use `position:fixed` hidden container
- Clone slides individually via `.proposal-page` selector (not the whole preview wrapper)
- Reset `transform`, `transformOrigin`, `overflow` on each cloned slide
- Use `allowTaint: false`, `imageTimeout: 0`, `width/height: 1280/720`, `windowWidth/windowHeight: 1280/720`
- Add `onclone` to set `crossOrigin = 'anonymous'` on all images
- Add `compress: true` to jsPDF options

### 2. Add `customBgColor` to `ProposalPage` (`types.ts`)
- Add optional `customBgColor?: string` field to `ProposalPage` interface
- Define a `DEFAULT_BG_COLORS` map: dark pages (cover, equipe, investimento, fechamento) → `#0d2b45`, light pages (diagnostico, estrategia, argumentos, sobre, contato, avaliacoes) → `#f5f0e8` (avaliacoes could be `#e8c96a` per earlier spec)

### 3. Pass background color to each page component (`ProposalEditor.tsx`)
- When rendering each page, compute `bgColor = page.customBgColor || DEFAULT_BG_COLORS[page.type]`
- Pass `bgColor` prop to each page component

### 4. Update all 10 page components
- Add `bgColor?: string` to each component's props
- Apply `style={{ backgroundColor: bgColor }}` on the root `.slide` div instead of hardcoded class-based backgrounds

### 5. Add per-page color picker in `EditorPanel.tsx`
- At the top of each section's accordion content, add a color picker labeled "Cor de fundo desta página"
- Include a "Restaurar padrão" button that clears `customBgColor` (sets to `undefined`)
- Update via the page's entry in the `data.pages` array

