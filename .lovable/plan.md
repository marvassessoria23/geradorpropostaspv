

# Fix PDF Generation — Print CSS & Logic

## Problem
The `print-area` class is on a deeply nested div, but the CSS rule `body > *:not(.print-area)` only targets direct children of `<body>`. Since `print-area` is inside multiple wrapper divs, it gets hidden along with everything else → blank PDF.

## Solution

### 1. `ProposalEditor.tsx` — Update `generatePDF`
```typescript
const generatePDF = () => {
  document.body.classList.add('printing');
  setTimeout(() => {
    window.print();
    document.body.classList.remove('printing');
  }, 500);
};
```

### 2. `index.css` — Replace entire `@media print` block
Replace lines 243–297 with the user's provided CSS that uses `body.printing` as the selector scope:
- `body.printing > *` hides everything
- `body.printing .print-area` shows only the slides container
- `body.printing .proposal-page` formats each slide as A4 landscape page
- `body.printing .preview-wrapper` removes scale transforms
- Add `color-adjust: exact !important` for full browser coverage
- Keep `@page { size: A4 landscape; margin: 0mm; }`

### 3. No structural changes needed
The `print-area` class is already on the correct container (line 342). The `no-print` class on the editor panel will be redundant but harmless.

## Files Modified
- `src/components/proposal/ProposalEditor.tsx` — `generatePDF` function (3 lines)
- `src/index.css` — `@media print` block replacement

