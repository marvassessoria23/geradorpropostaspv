

# Fix PDF Print: Remove Scale During Print

## Problem
The `transform: scale()` on the preview wrapper (`.preview-wrapper`) is captured by `window.print()`, producing a tiny/blank PDF. The wrapper also lacks the class `preview-scale-wrapper` that the fix needs to target.

## Changes (3 files, 3 edits)

### 1. `ProposalEditor.tsx` — Rename wrapper class + fix `generatePDF`

**Line 401**: Change `className="preview-wrapper"` → `className="preview-scale-wrapper"`

**Lines 299-307**: Replace `generatePDF` with version that temporarily strips `transform`, `transformOrigin`, and sets `width: 297mm` on the `.preview-scale-wrapper` element before calling `window.print()`, then restores original styles after 1s.

```typescript
const generatePDF = () => {
  const previewWrapper = document.querySelector('.preview-scale-wrapper') as HTMLElement;
  const originalTransform = previewWrapper?.style.transform;
  const originalWidth = previewWrapper?.style.width;
  const originalTransformOrigin = previewWrapper?.style.transformOrigin;

  if (previewWrapper) {
    previewWrapper.style.transform = 'none';
    previewWrapper.style.width = '297mm';
    previewWrapper.style.transformOrigin = 'unset';
  }

  document.body.classList.add('printing');

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing');
      if (previewWrapper) {
        previewWrapper.style.transform = originalTransform || '';
        previewWrapper.style.width = originalWidth || '';
        previewWrapper.style.transformOrigin = originalTransformOrigin || '';
      }
    }, 1000);
  }, 300);
};
```

### 2. `src/index.css` — Add `transform: none !important` to `.print-area`

Add to the existing `body.printing .print-area` rule (line 270-275):
```css
transform: none !important;
```

No other print CSS changes — the rest already matches what was requested.

## Files Modified
- `src/components/proposal/ProposalEditor.tsx` — wrapper class rename + `generatePDF` fix
- `src/index.css` — add `transform: none` to `.print-area`

## NOT Modified
- Save/load logic, image upload, page components, any other CSS

