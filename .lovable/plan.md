

# Fix Blank Slides + Slide Hide Button + Hidden Slide Indicators

## Problem Summary
1. Slides with all empty/hidden fields still render as blank white rectangles
2. The hover "hide slide" button exists in code but doesn't work (CSS `opacity:0` on a child inside a scaled container may not trigger hover correctly)
3. Hidden slides in the left panel need clearer visual indication

## Changes

### 1. Auto-hide slides with no visible content (`ProposalEditor.tsx`)
Add a `slideHasContent(page, data)` function that checks each page type's fields. If all fields are empty or hidden, the slide is excluded from `visiblePages`.

```typescript
const slideHasContent = (page: ProposalPage, data: ProposalData): boolean => {
  const hf = data.hiddenFields || {};
  const v = (key: string) => {
    const val = (data as any)[key];
    return val && String(val).trim() !== '' && !hf[key];
  };
  switch (page.type) {
    case 'estrategia':
      return v('estrategiaIntro') || v('movimento1Title') || v('movimento1Intro') || 
             v('movimento1Item1') || v('movimento1Item2') || v('movimento1Item3') || 
             v('movimento1Resultado') || v('movimento2Title') || v('movimento2Consignacao') || 
             v('movimento2Obrigacao') || v('movimento2Pedidos') || v('movimento2Observacoes') || 
             v('movimento3Title') || v('movimento3Body');
    case 'cover': return true; // cover always shows
    case 'diagnostico':
      return v('diagnosticoTitle') || v('diagnosticoGreeting') || v('diagnosticoIntro') || 
             v('diagnosticoBody') || v('diagnosticoJurisprudencia') || v('diagnosticoConclusao');
    // ... similar for all other page types
    default: return true;
  }
};

// Update visiblePages filter:
const visiblePages = data.pages.filter(p => p.visible && slideHasContent(p, data));
```

### 2. Fix slide hide button visibility (`ProposalEditor.tsx`)
Replace the CSS-only hover approach with React state (`hoveredSlide`). Use `onMouseEnter`/`onMouseLeave` on each slide wrapper to track which slide is hovered, then conditionally render the button.

```tsx
const [hoveredSlide, setHoveredSlide] = useState<string | null>(null);

// On each slide wrapper:
<div
  className="slide-wrapper"
  onMouseEnter={() => setHoveredSlide(page.id)}
  onMouseLeave={() => setHoveredSlide(null)}
  style={{ position: 'relative', ... }}
>
  {hoveredSlide === page.id && (
    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 1000 }}>
      <button onClick={(e) => { e.stopPropagation(); togglePageVisibility(page.id); }}
        style={{ background: 'rgba(13,43,69,0.9)', border: '1px solid #c9a84c', color: '#c9a84c', ... }}>
        🙈 Ocultar slide
      </button>
    </div>
  )}
  {slideContent}
</div>
```

Add `togglePageVisibility` helper that toggles `page.visible`.

### 3. Enhanced hidden slide indicators in left panel (`EditorPanel.tsx`)
Already partially done (line 739 has opacity-30 + line-through). Enhance with:
- Red "OCULTO" label next to hidden slide names
- Reduced opacity on the whole row
- Slight red tint background

### 4. CSS cleanup (`index.css`)
Remove the `.slide-wrapper:hover .slide-controls` rule (replaced by React state approach). Keep `[contenteditable]` styles untouched.

## Files Modified
- `src/components/proposal/ProposalEditor.tsx` — `slideHasContent` function, `hoveredSlide` state, toggle button fix
- `src/components/proposal/EditorPanel.tsx` — enhanced hidden slide indicators
- `src/index.css` — remove unused `.slide-controls` hover rule

## NOT Modified
- Save/load logic, image upload, PDF generation, print CSS, page components
