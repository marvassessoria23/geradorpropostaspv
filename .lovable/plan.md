

# Plano: corrigir quebra de PDF + imagens no HTML

## Diagnóstico
- **PDF (PageDiagnostico não quebra):** A lógica de subpáginas existe em `generatePDF` (linhas 302–412), mas `scrollHeight` é lido apenas 80ms após o reset de overflow. Em slides pesados pode não dar tempo do reflow propagar, retornando 720px e gerando 1 só página. Solução: aumentar wait, e medir altura com `overflow/maxHeight/height` explicitamente resetados antes do `getBoundingClientRect`/`scrollHeight`.
- **HTML (imagens não aparecem):** `generateHTML` (linhas 414–502) clona o DOM com `<img src="https://...supabase.co/...">`. Quando o arquivo é aberto via `file://`, navegadores bloqueiam ou as URLs com cache-buster podem falhar. Solução: pré-converter todas as `<img src>` e `background-image: url(...)` inline para base64 antes de serializar.

## Mudanças (1 arquivo: `src/components/proposal/ProposalEditor.tsx`)

### A. Reforçar `generatePDF` (linhas 332–402)
- Após aplicar os style overrides do slide, aguardar **150ms + 2 `requestAnimationFrame`** para garantir reflow completo.
- Ler `naturalHeight` usando `Math.max(slide.scrollHeight, slide.getBoundingClientRect().height, SLIDE_H)` para pegar o maior valor confiável.
- Manter o restante (captura `toPng` em altura natural, fatiamento em N páginas A4 de 210mm via `yOffsetMm` negativo) — já está correto.

### B. Reescrever `generateHTML` como `async` (linhas 414–502)
- Adicionar helper `urlToBase64(url)` que faz `fetch` + `FileReader.readAsDataURL`, com try/catch (devolve a URL original se falhar).
- Para cada slide clonado: percorrer `clone.querySelectorAll('img')` e converter `src` (paralelizado com `Promise.all`); percorrer todos os elementos com `style.backgroundImage` contendo `url(...)` e converter também.
- Adicionar estado `isGeneratingHTML` + overlay análogo ao do PDF (texto: "Gerando HTML... convertendo imagens").
- Fazer o botão "Gerar HTML" no header chamar a versão async, desabilitado enquanto `isGeneratingHTML`.

### C. Estado e overlay
- `const [isGeneratingHTML, setIsGeneratingHTML] = useState(false);` junto dos outros estados.
- Bloco `{isGeneratingHTML && ( ... )}` espelhando o overlay do PDF, próximo ao bloco existente em `linhas 666–677`.

## Não modificado
- Salvamento Supabase, upload de imagens, `EditorPanel`, `index.css`, todos os 10 componentes de página, sub-páginas do `PageEstrategia`, lógica de quebra de subpáginas (mantida intacta — apenas com timing mais robusto).

## Resultado esperado
- **PDF:** `PageDiagnostico` com texto longo é capturado em altura natural (>720px) e o jsPDF emite N páginas A4 paisagem por slide, sem distorção.
- **HTML:** arquivo `proposta.html` autocontido, abre offline com todas as imagens (logo, capa, fotos da equipe, fundos) renderizadas via base64.

