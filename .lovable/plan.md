

# Fix 3 Issues: Cover White Line, Photo Slider, Team Photos

## Problem 1 — White Line on Cover
Fix only in `PageCover.tsx` — do NOT touch `.slide` overflow in `index.css`.
- Add `overflow: 'hidden'` only on the cover slide's root div
- Remove any border/outline/gap between the two flex children
- Widen the gradient overlay on the photo side to blend seamlessly into the dark background

## Problem 2 — Cover Photo Position Slider
Verify wiring is solid in `PageCover.tsx` — the `coverPhotoPosition` prop should map to `objectPosition: center ${coverPhotoPosition}%`. Quick check and fix if needed.

## Problem 3 — Team Photos Too Small and Distorted
In `PageEquipe.tsx`:
- Increase `MemberCircle` photo from 80×80 to 100×100
- Add `objectPosition: 'center 20%'` on `<img>` to focus on faces
- Replace CSS grid with `display: flex`, `flexWrap: wrap`, gap `16px 20px`, `justifyContent: flex-start`

## Files Modified
- `src/components/proposal/PageCover.tsx`
- `src/components/proposal/PageEquipe.tsx`

