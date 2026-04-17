
# Plano: corrigir PDF por scroll, fatiar Diagnóstico e restaurar imagens no HTML

## Diagnóstico
- `html2canvas` já está instalado.
- Hoje o `generatePDF` captura a `.print-area` inteira de uma vez; isso mantém problemas de escala/altura.
- Hoje o `generateHTML` converte imagens com `canvas.drawImage`; isso falha em alguns casos de CORS.
- Hoje o `PageDiagnostico` só separa em 2 subslides por grupo fixo de campos; ele não fatia texto excedente. O slide 2 só olha `diagnosticoJurisprudencia` e `diagnosticoConclusao`.

## Mudanças

### 1) `src/components/proposal/ProposalEditor.tsx`
Substituir as duas funções:

- **PDF**
  - Trocar a captura única por captura **slide a slide** com `html2canvas`.
  - Para cada `[data-slide]`: rolar até ele, aguardar reflow curto, capturar o slide visível e adicionar 1 página ao `jsPDF`.
  - Ao final, voltar o scroll ao topo.
  - Não usar container invisível nem clone offscreen.

- **HTML**
  - Trocar a conversão de imagens para `fetch -> blob -> FileReader`.
  - Converter todas as `<img>` clonadas com `Promise.all`.
  - Manter o documento final somente leitura.
  - Preservar a remoção de botões/overlays/elementos de edição no clone.

- **Ignorar controles**
  - Garantir `data-html2canvas-ignore="true"` nos overlays e controles que não devem entrar na captura/exportação.

### 2) `src/components/proposal/PageDiagnostico.tsx`
Refazer a lógica de conteúdo para **fatiar texto**, não só detectar overflow:

- Criar helper de divisão por parágrafo com limite de caracteres.
- Aplicar a divisão aos textos longos do diagnóstico:
  - `diagnosticoIntro`
  - `diagnosticoBody`
  - `diagnosticoJurisprudencia`
  - `diagnosticoConclusao`
- Montar o **Slide 1** com título/saudação + primeira parte do conteúdo.
- Se houver excedente, montar o **Slide 2** automaticamente com **apenas continuação do texto**, sem repetir badge, título ou saudação.
- Atualizar `getDiagnosticoVisibleSubPages` para considerar o excedente real.
- Manter a opção de ocultar subslide 2 via `hiddenFields`.

### 3) Controles ignorados pelo html2canvas
Ajustar os componentes que já têm botões de hover/ocultar para marcar esses controles com `data-html2canvas-ignore`, sem alterar comportamento:
- `ProposalEditor.tsx`
- `PageDiagnostico.tsx`
- `PageEstrategia.tsx`
- `PageSobre.tsx` (se ainda houver controle de subslide no preview)

## Cuidados para manter intacto
Não mexer em:
- salvamento
- backend/Lovable Cloud
- `EditorPanel`
- estrutura geral dos outros slides

## Resultado esperado
- **PDF**: 1 captura por slide real, com scroll antes da captura, sem depender de container clonado.
- **Diagnóstico**: texto longo passa a ser distribuído entre slide 1 e slide 2 automaticamente.
- **HTML**: imagens voltam a sair embutidas em base64 usando `fetch/blob`, com fallback para URL original quando necessário.
