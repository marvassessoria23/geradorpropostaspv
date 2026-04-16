

# Plano: PDF com auto-quebra em subpáginas (1280x720)

## Diagnóstico
- A captura atual força `height: 720px` + `overflow: hidden`, então tudo que passa de 720px é cortado e nada quebra para a próxima página.
- O scale visual (`.preview-scale-wrapper`) não é o problema — o `style` override do `toPng` já neutraliza isso.
- Estrutura está OK: todos os 10 componentes têm `[data-slide]` na div raiz, sub-páginas do PageEstrategia incluídas. Wrapper de scale é separado e isolado.

## Estratégia (1 arquivo: `ProposalEditor.tsx`)

Em vez de tentar dividir conteúdo a nível de React (refatoração enorme em todos os PageX), faço o split **na camada de imagem**:

1. Para cada `[data-slide]`, força largura `1280px` e **altura natural** (`scrollHeight`, sem cap em 720px) e `overflow: visible`.
2. Captura com `toPng` em alta resolução — gera uma única imagem com todo o conteúdo do slide.
3. Calcula quantas "páginas A4 paisagem" cabem nessa altura: `numPages = ceil(altura / 720)`.
4. Adiciona N páginas no PDF, cada uma exibindo uma **fatia vertical** da mesma imagem usando o offset Y do `addImage` (`pdf.addImage(img, 'PNG', 0, -sliceOffsetMm, 297, totalImageHeightMm)` dentro de uma página com clipping via `pdf.rect` + `clip`).
5. Restaura os estilos originais do slide depois da captura.

Resultado: slides curtos saem como 1 página normal (1280x720). Slides longos quebram automaticamente em 2, 3, N páginas A4 paisagem, sem distorção, sem corte, sem precisar mexer em nenhum componente.

### Implementação resumida

```typescript
const A4_W_MM = 297, A4_H_MM = 210;
const SLIDE_W = 1280, SLIDE_H = 720;
const MM_PER_PX = A4_W_MM / SLIDE_W; // ratio fixo

for (const slide of slides) {
  // salva estilos originais
  const saved = { /* width, height, minH, maxH, overflow, transform, transformOrigin, position */ };
  Object.assign(slide.style, {
    width: '1280px', height: 'auto',
    minHeight: '720px', maxHeight: 'none',
    overflow: 'visible', transform: 'none',
    transformOrigin: 'top left', position: 'relative',
  });
  await new Promise(r => setTimeout(r, 80));

  const naturalHeight = Math.max(slide.scrollHeight, SLIDE_H);
  const dataUrl = await toPng(slide, {
    width: SLIDE_W, height: naturalHeight,
    pixelRatio: 1.5, cacheBust: true,
    filter: /* mesmo de antes: exclui BUTTON, .slide-controls, [data-pdf-exclude] */,
  });

  // restaura estilos
  Object.assign(slide.style, saved);

  const totalHeightMm = naturalHeight * MM_PER_PX;
  const numPages = Math.ceil(naturalHeight / SLIDE_H);

  const img = new Image();
  img.src = dataUrl;
  await new Promise(r => { img.onload = r; });

  for (let p = 0; p < numPages; p++) {
    if (firstPage === false) pdf.addPage('a4', 'landscape');
    firstPage = false;
    const yOffsetMm = -p * A4_H_MM; // desloca a imagem pra cima a cada página
    pdf.addImage(dataUrl, 'PNG', 0, yOffsetMm, A4_W_MM, totalHeightMm);
  }
}
```

`yOffsetMm` negativo move a imagem para cima e a A4 (297×210) atua como uma "janela" mostrando apenas a fatia correta. jsPDF naturalmente recorta o que está fora dos limites da página.

## Não modificado
- Salvamento Supabase, upload de imagens, todos os 10 componentes de página, `EditorPanel`, CSS global, `index.css`, sub-páginas do `PageEstrategia`, lógica de scale do preview, overlay `isGeneratingPDF`.

## Verificações automáticas no início da função
- `setIsGeneratingPDF(true)` e overlay já existem ✓
- `toPng`/`jsPDF` já importados ✓
- Todos `[data-slide]` confirmados em todos os componentes ✓

## Resultado esperado
- Slides que cabem em 720px: 1 página A4 paisagem cada, sem distorção, fontes nítidas (pixelRatio 1.5).
- Slides com texto longo: quebram automaticamente em 2+ páginas A4 paisagem, mantendo a continuidade do conteúdo.
- Nenhum slide cortado pela metade. Nenhum conteúdo perdido.

