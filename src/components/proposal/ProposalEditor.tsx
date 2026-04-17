import React, { useState, useRef, useCallback, useEffect } from "react";
import { ProposalData, defaultProposalData, PageType, DEFAULT_BG_COLORS } from "./types";
import EditorPanel from "./EditorPanel";
import PageCover from "./PageCover";
import PageDiagnostico, { getDiagnosticoVisibleSubPages } from "./PageDiagnostico";
import PageEstrategia, { getEstrategiaVisibleSubPages } from "./PageEstrategia";
import PageArgumentos from "./PageArgumentos";
import PageSobre, { getSobreVisibleSubPages } from "./PageSobre";
import PageEquipe from "./PageEquipe";
import PageAvaliacoes from "./PageAvaliacoes";
import PageInvestimento from "./PageInvestimento";
import PageFechamento from "./PageFechamento";
import PageContato from "./PageContato";
import { FileDown, PanelLeftClose, PanelLeft } from "lucide-react";
import logoImg from "@/assets/logo-paiva-nunes.png";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TEXT_SIZE_MAP = {
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
};

// Image fields that live at the top level of ProposalData
const IMAGE_FIELDS: (keyof ProposalData)[] = [
  'coverImage', 'logoImage', 'advogadoPhoto', 'fotoSobre', 'fotoProximosPassos', 'fotoContato'
];

// Upload a base64 image to Supabase Storage and return the public URL
const uploadToStorage = async (id: string, base64: string): Promise<string> => {
  const response = await fetch(base64);
  const blob = await response.blob();
  const ext = blob.type.split('/')[1] || 'jpg';
  const fileName = `${id}.${ext}`;

  const { error } = await supabase.storage
    .from('proposta-imagens')
    .upload(fileName, blob, { upsert: true, contentType: blob.type });

  if (error) {
    console.error('Erro no upload:', id, error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from('proposta-imagens')
    .getPublicUrl(fileName);

  // Add cache-buster to avoid stale CDN cache
  return `${urlData.publicUrl}?t=${Date.now()}`;
};

// Check if a value is a base64 data URL
const isBase64 = (val: string | null): boolean =>
  !!val && val.startsWith('data:');

// Check if a value is an old img: reference from the legacy system
const isImgRef = (val: string | null): boolean =>
  !!val && val.startsWith('img:');

// Check if a value needs migration (base64 or img: ref)
const needsMigration = (val: string | null): boolean =>
  isBase64(val) || isImgRef(val);

// Check if a slide has any visible content
const slideHasContent = (page: { type: PageType }, data: ProposalData): boolean => {
  const hf = data.hiddenFields || {};
  const v = (key: string) => {
    const val = (data as any)[key];
    return val && String(val).trim() !== '' && !hf[key];
  };
  switch (page.type) {
    case 'cover': return true;
    case 'diagnostico':
      return v('diagnosticoTitle') || v('diagnosticoGreeting') || v('diagnosticoIntro') ||
        v('diagnosticoBody') || v('diagnosticoJurisprudencia') || v('diagnosticoConclusao');
    case 'estrategia':
      return v('estrategiaIntro') || v('movimento1Title') || v('movimento1Intro') ||
        v('movimento1Item1') || v('movimento1Item2') || v('movimento1Item3') ||
        v('movimento1Resultado') || v('movimento2Title') || v('movimento2Consignacao') ||
        v('movimento2Obrigacao') || v('movimento2Pedidos') || v('movimento2Observacoes') ||
        v('movimento3Title') || v('movimento3Body');
    case 'argumentos':
      return (data.argumentos || []).some(a => !a.hidden && (a.argumento?.trim() || a.fundamento?.trim() || a.observacao?.trim()));
    case 'sobre':
      return v('sobreTitle') || v('sobreText1') || v('sobreText2') || v('sobreText3');
    case 'equipe':
      return (data.team || []).some(t => !t.hidden);
    case 'avaliacoes':
      return (data.avaliacoes || []).some(a => !a.hidden);
    case 'investimento':
      return v('honorarioAntecipado1') || v('honorarioAntecipado1Desc') ||
        v('honorarioAntecipado2') || v('honorarioAntecipado2Desc') ||
        v('honorarioExito1') || v('honorarioExito2') || v('parcelamento') || v('validadeProposta');
    case 'fechamento':
      return (data.fechamentoSteps || []).some(s => s?.trim()) || v('fechamentoCTA');
    case 'contato':
      return v('telefone') || v('instagram1') || v('website') || v('contatoTexto') || v('contatoSlogan');
    default: return true;
  }
};

const ProposalEditor: React.FC = () => {
  const [data, setData] = useState<ProposalData>(defaultProposalData);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [panelOpen, setPanelOpen] = useState(true);
  const [previewScale, setPreviewScale] = useState(0.6);
  const [hoveredSlide, setHoveredSlide] = useState<string | null>(null);
  const [showTip, setShowTip] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingHTML, setIsGeneratingHTML] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // Upload image to storage, update data, return URL
  const handleImageUpload = useCallback(async (fieldId: string, base64: string): Promise<string> => {
    const url = await uploadToStorage(fieldId, base64);
    return url;
  }, []);

  // Migrate any legacy base64/img: references to Storage URLs
  const migrateImages = useCallback(async (proposalData: ProposalData): Promise<ProposalData> => {
    const migrated = { ...proposalData };
    let changed = false;

    // Migrate top-level image fields
    for (const field of IMAGE_FIELDS) {
      const val = migrated[field] as string | null;
      if (isBase64(val)) {
        try {
          const url = await uploadToStorage(field as string, val);
          (migrated as any)[field] = url;
          changed = true;
        } catch { /* keep original */ }
      } else if (isImgRef(val)) {
        // Old img: reference — image data is in proposta_imagens table, try to load and migrate
        const refId = val.replace('img:', '');
        try {
          const { data: row } = await (supabase as any)
            .from('proposta_imagens')
            .select('base64')
            .eq('id', refId)
            .maybeSingle();
          if (row?.base64) {
            const url = await uploadToStorage(field as string, row.base64);
            (migrated as any)[field] = url;
            changed = true;
          } else {
            (migrated as any)[field] = null;
            changed = true;
          }
        } catch {
          (migrated as any)[field] = null;
          changed = true;
        }
      }
    }

    // Migrate team member photos
    migrated.team = await Promise.all(
      migrated.team.map(async (m) => {
        if (isBase64(m.photo)) {
          try {
            const url = await uploadToStorage(`team_${m.id}`, m.photo);
            changed = true;
            return { ...m, photo: url };
          } catch { return m; }
        } else if (isImgRef(m.photo)) {
          const refId = m.photo.replace('img:', '');
          try {
            const { data: row } = await (supabase as any)
              .from('proposta_imagens')
              .select('base64')
              .eq('id', refId)
              .maybeSingle();
            if (row?.base64) {
              const url = await uploadToStorage(`team_${m.id}`, row.base64);
              changed = true;
              return { ...m, photo: url };
            }
          } catch { /* ignore */ }
          changed = true;
          return { ...m, photo: null };
        }
        return m;
      })
    );

    // If we migrated anything, save the updated config immediately
    if (changed) {
      console.log('Imagens migradas para Storage, salvando config...');
      await (supabase as any)
        .from('proposta_config')
        .upsert({
          id: 'config_global',
          data: migrated,
          updated_at: new Date().toISOString()
        });
    }

    return migrated;
  }, []);

  // Load from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Iniciando carregamento...');

        const { data: row, error } = await (supabase as any)
          .from('proposta_config')
          .select('data')
          .eq('id', 'config_global')
          .maybeSingle();

        console.log('Config carregada:', { error, hasData: !!row?.data });

        if (!error && row?.data && typeof row.data === 'object' && Object.keys(row.data).length > 0) {
          let proposalData = row.data as ProposalData;

          // Check if any images need migration from base64/img: to Storage URLs
          const hasLegacy = IMAGE_FIELDS.some(f => needsMigration((proposalData as any)[f])) ||
            (proposalData.team || []).some(m => needsMigration(m.photo));

          if (hasLegacy) {
            console.log('Detectadas imagens legadas, migrando para Storage...');
            proposalData = await migrateImages(proposalData);
          }

          setData(proposalData);
        }
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      } finally {
        setIsLoading(false);
        setTimeout(() => { isInitialLoad.current = false; }, 500);
      }
    };
    loadData();
  }, [migrateImages]);

  // Dismiss tooltip after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowTip(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const updateData = useCallback((updates: Partial<ProposalData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  // Auto-save to Supabase with 1s debounce — JSON is lightweight now (URLs, not base64)
  useEffect(() => {
    if (isInitialLoad.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      try {
        setSaveStatus('saving');

        const { error } = await (supabase as any)
          .from('proposta_config')
          .upsert({
            id: 'config_global',
            data: data,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
        setSaveStatus('saved');
      } catch (e) {
        console.error('Erro ao salvar:', e);
        setSaveStatus('error');
      }
    }, 1000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [data]);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 64;
        const scale = Math.min(containerWidth / 1280, 0.85);
        setPreviewScale(Math.max(scale, 0.35));
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [panelOpen]);

  const textSizeClass = TEXT_SIZE_MAP[data.textSize];

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 400));

      // Neutralize the preview scale so each slide is captured at full 1280x720
      const scaleWrapper = document.querySelector('.preview-scale-wrapper') as HTMLElement | null;
      const savedTransform = scaleWrapper?.style.transform;
      const savedWidth = scaleWrapper?.style.width;
      const savedOrigin = scaleWrapper?.style.transformOrigin;
      const scrollContainer = document.querySelector('.print-area') as HTMLElement | null;
      const savedScrollTop = scrollContainer?.scrollTop ?? 0;

      if (scaleWrapper) {
        scaleWrapper.style.transform = 'none';
        scaleWrapper.style.width = '1280px';
        scaleWrapper.style.transformOrigin = 'top left';
      }

      await new Promise((r) => setTimeout(r, 400));

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [297, 210],
        compress: true,
      });

      const slides = Array.from(document.querySelectorAll('[data-slide]')) as HTMLElement[];
      if (slides.length === 0) {
        alert('Nenhum slide encontrado.');
        setIsGeneratingPDF(false);
        return;
      }

      let firstPage = true;
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        try {
          slide.scrollIntoView({ behavior: 'auto', block: 'start' });
        } catch { /* ignore */ }
        await new Promise((r) => setTimeout(r, 250));

        const canvas = await html2canvas(slide, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          imageTimeout: 15000,
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight,
          ignoreElements: (el) => {
            const e = el as HTMLElement;
            if (!e.getAttribute) return false;
            if (e.getAttribute('data-html2canvas-ignore') === 'true') return true;
            if (e.getAttribute('data-pdf-exclude') === 'true') return true;
            if (e.classList && e.classList.contains('no-print')) return true;
            return false;
          },
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        if (!firstPage) pdf.addPage([297, 210], 'landscape');
        firstPage = false;
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      }

      // Restore styles & scroll
      if (scaleWrapper) {
        scaleWrapper.style.transform = savedTransform || '';
        scaleWrapper.style.width = savedWidth || '';
        scaleWrapper.style.transformOrigin = savedOrigin || '';
      }
      if (scrollContainer) scrollContainer.scrollTop = savedScrollTop;
      window.scrollTo({ top: 0, behavior: 'auto' });

      pdf.save('proposta.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF: ' + (error as Error).message);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateHTML = async () => {
    setIsGeneratingHTML(true);
    try {
      const imgToBase64 = async (url: string): Promise<string> => {
        if (!url || url.startsWith('data:')) return url;
        try {
          const response = await fetch(url, { mode: 'cors', cache: 'no-cache' });
          const blob = await response.blob();
          return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch {
          return url;
        }
      };

      const slides = Array.from(document.querySelectorAll('[data-slide]')) as HTMLElement[];

      if (slides.length === 0) {
        alert('Nenhum slide encontrado.');
        setIsGeneratingHTML(false);
        return;
      }

      const processedSlides = await Promise.all(
        slides.map(async (slide) => {
          const clone = slide.cloneNode(true) as HTMLElement;

          // Remover TUDO que é interativo ou de edição
          clone
            .querySelectorAll(
              'button, [data-pdf-exclude], .slide-controls, .slide-hover-controls, .no-print'
            )
            .forEach((el) => el.remove());

          // Remover atributos de edição e bloquear interação
          clone.querySelectorAll('*').forEach((el) => {
            el.removeAttribute('contenteditable');
            el.removeAttribute('spellcheck');
            el.removeAttribute('tabindex');
            (el as HTMLElement).style.cursor = 'default';
            (el as HTMLElement).style.userSelect = 'none';
            (el as HTMLElement).style.webkitUserSelect = 'none';
            (el as HTMLElement).style.pointerEvents = 'none';
          });

          // Convert <img> tags to base64 via fetch+blob (more robust than canvas/CORS)
          const cloneImgs = Array.from(clone.querySelectorAll('img')) as HTMLImageElement[];
          await Promise.all(cloneImgs.map(async (cloneImg) => {
            if (cloneImg.src && !cloneImg.src.startsWith('data:')) {
              cloneImg.src = await imgToBase64(cloneImg.src);
            }
            cloneImg.draggable = false;
            cloneImg.style.pointerEvents = 'none';
          }));

          clone.style.cssText = `
            width: 1280px !important;
            height: 720px !important;
            min-height: 720px !important;
            max-height: 720px !important;
            overflow: hidden !important;
            transform: none !important;
            position: relative !important;
            page-break-after: always !important;
            break-after: page !important;
            display: block !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            cursor: default !important;
            user-select: none !important;
            -webkit-user-select: none !important;
          `;

          return clone.outerHTML;
        })
      );

      // Coletar estilos da página
      const styles = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join('\n');
          } catch {
            return '';
          }
        })
        .join('\n');

      const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1280">
  <title>Proposta Comercial - Paiva Nunes Advogados</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      cursor: default !important;
    }
    body {
      background: #1a1a2e;
      font-family: 'Lato', sans-serif;
    }
    .slide-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 20px 0;
    }
    .slide-wrapper {
      width: 1280px;
      height: 720px;
      overflow: hidden;
      display: block;
      position: relative;
      box-shadow: 0 4px 24px rgba(0,0,0,0.5);
    }
    [contenteditable] {
      pointer-events: none !important;
      user-select: none !important;
      cursor: default !important;
    }
    button { display: none !important; }
    @media print {
      body { background: white; padding: 0; }
      .slide-container { gap: 0; padding: 0; }
      .slide-wrapper {
        page-break-after: always;
        break-after: page;
        box-shadow: none;
        margin: 0;
      }
      @page { size: A4 landscape; margin: 0; }
    }
    ${styles}
  </style>
</head>
<body>
  <div class="slide-container">
    ${processedSlides.map((s) => `<div class="slide-wrapper">${s}</div>`).join('\n')}
  </div>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'proposta.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar HTML:', error);
      alert('Erro ao gerar HTML: ' + (error as Error).message);
    } finally {
      setIsGeneratingHTML(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a1628', color: '#c9a84c', fontFamily: "'Lato', sans-serif", fontSize: 18 }}>
        Carregando proposta...
      </div>
    );
  }

  const visiblePages = data.pages.filter((p) => p.visible && slideHasContent(p, data));
  let globalPageCounter = 0;

  const togglePageVisibility = (pageId: string) => {
    updateData({ pages: data.pages.map((p) => p.id === pageId ? { ...p, visible: !p.visible } : p) });
  };

  const renderPage = (pageType: PageType, pageNumber: number, bgColor: string) => {
    switch (pageType) {
      case "cover":
        return <PageCover data={data} pageNumber={pageNumber} bgColor={bgColor} onChange={updateData} />;
      case "diagnostico":
        return <PageDiagnostico data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} onChange={updateData} />;
      case "estrategia":
        return <PageEstrategia data={data} textSizeClass={textSizeClass} startPageNumber={pageNumber} bgColor={bgColor} onChange={updateData} />;
      case "argumentos":
        return <PageArgumentos data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} onChange={updateData} />;
      case "sobre":
        return <PageSobre data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} onChange={updateData} />;
      case "equipe":
        return <PageEquipe data={data} pageNumber={pageNumber} bgColor={bgColor} onChange={updateData} />;
      case "avaliacoes":
        return <PageAvaliacoes data={data} pageNumber={pageNumber} bgColor={bgColor} onChange={updateData} />;
      case "investimento":
        return <PageInvestimento data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} onChange={updateData} />;
      case "fechamento":
        return <PageFechamento data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} onChange={updateData} />;
      case "contato":
        return <PageContato data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} onChange={updateData} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0a1628' }}>
      {/* Header */}
      <header style={{ flexShrink: 0, borderBottom: '1px solid rgba(201,168,76,0.12)', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(13,43,69,0.95)', backdropFilter: 'blur(8px)', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            style={{ padding: 8, borderRadius: 8, border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c', background: 'transparent', cursor: 'pointer' }}
          >
            {panelOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={logoImg} alt="Paiva Nunes" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: 14, letterSpacing: '0.1em', lineHeight: 1, margin: 0 }}>
                Gerador de Propostas
              </h1>
              <span style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(201,168,76,0.6)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Paiva Nunes Advogados</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 11, fontFamily: "'Lato', sans-serif", color: saveStatus === 'saved' ? 'rgba(100,200,100,0.7)' : saveStatus === 'saving' ? 'rgba(201,168,76,0.7)' : 'rgba(239,68,68,0.7)' }}>
            {saveStatus === 'saved' && '✓ Salvo'}
            {saveStatus === 'saving' && '⏳ Salvando...'}
            {saveStatus === 'error' && '⚠ Erro ao salvar'}
          </span>
          <button
            onClick={generateHTML}
            disabled={isGeneratingHTML}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, background: 'transparent', color: '#c9a84c', fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: 14, border: '1px solid #c9a84c', cursor: isGeneratingHTML ? 'not-allowed' : 'pointer', opacity: isGeneratingHTML ? 0.6 : 1 }}
          >
            🌐 {isGeneratingHTML ? 'Gerando...' : 'Gerar HTML'}
          </button>
          <button
            onClick={generatePDF}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 8, background: 'linear-gradient(to right, #c9a84c, #e8c96a)', color: '#0d2b45', fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(201,168,76,0.25)' }}
          >
            <FileDown size={16} />
            Gerar PDF
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Editor Panel */}
        {panelOpen && (
          <div className="no-print" style={{ width: 380, flexShrink: 0, borderRight: '1px solid rgba(201,168,76,0.08)', overflow: 'hidden', background: '#0f1f33' }}>
            <EditorPanel data={data} onChange={updateData} onImageUpload={handleImageUpload} />
          </div>
        )}

        {/* Preview */}
        <div ref={containerRef} className="print-area" style={{ flex: 1, overflowY: 'auto', padding: 32, background: 'linear-gradient(135deg, #0a1628 0%, #0d1b2a 50%, #0f1f33 100%)' }}>
          <div
            ref={previewRef}
            className="preview-scale-wrapper"
            style={{
              transformOrigin: 'top center',
              transform: `scale(${previewScale})`,
              width: 1280,
              margin: '0 auto',
            }}
          >
            {visiblePages.map((page) => {
              globalPageCounter++;
              const currentPageNum = globalPageCounter;
              const bgColor = page.customBgColor || DEFAULT_BG_COLORS[page.type];

              if (page.type === "estrategia") {
                const visSubs = getEstrategiaVisibleSubPages(data);
                const extraPages = visSubs.filter(Boolean).length - 1;
                if (extraPages > 0) globalPageCounter += extraPages;
              }
              if (page.type === "diagnostico") {
                const visSubs = getDiagnosticoVisibleSubPages(data);
                const extraPages = visSubs.filter(Boolean).length - 1;
                if (extraPages > 0) globalPageCounter += extraPages;
              }
              if (page.type === "sobre") {
                const visSubs = getSobreVisibleSubPages(data);
                const extraPages = visSubs.filter(Boolean).length - 1;
                if (extraPages > 0) globalPageCounter += extraPages;
              }

              const slideContent = renderPage(page.type, currentPageNum, bgColor);
              const isHovered = hoveredSlide === page.id;

              return (
                <div
                  key={page.id}
                  data-proposal-page
                  className={`slide-wrapper ${data.viewMode === "pages" && page.type !== "estrategia" && page.type !== "diagnostico" && page.type !== "sobre" ? "slide-shadow" : ""}`}
                  style={{ marginBottom: data.viewMode === "pages" ? 32 : 0, position: 'relative' }}
                  onMouseEnter={() => setHoveredSlide(page.id)}
                  onMouseLeave={() => setHoveredSlide(null)}
                >
                  {isHovered && (
                    <div className="no-print" style={{ position: 'absolute', top: 8, right: 8, zIndex: 1000 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePageVisibility(page.id); }}
                        style={{
                          background: 'rgba(13,43,69,0.9)', border: '1px solid #c9a84c',
                          color: '#c9a84c', borderRadius: 6, padding: '6px 12px',
                          cursor: 'pointer', fontSize: 12, fontFamily: "'Lato', sans-serif",
                        }}
                      >
                        🙈 Ocultar slide
                      </button>
                    </div>
                  )}
                  {slideContent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showTip && (
        <div data-pdf-exclude="true" style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#0d2b45', border: '1px solid #c9a84c',
          color: 'white', padding: '12px 20px', borderRadius: 8,
          fontSize: 13, zIndex: 9999, fontFamily: "'Lato', sans-serif",
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          cursor: 'pointer',
        }} onClick={() => setShowTip(false)}>
          💡 Clique em qualquer texto no preview para editar diretamente
        </div>
      )}
      {isGeneratingPDF && (
        <div data-pdf-exclude="true" style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(10,22,40,0.92)', backdropFilter: 'blur(4px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#c9a84c', fontFamily: "'Lato', sans-serif",
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Gerando PDF...</div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>Aguarde, isso pode levar alguns segundos</div>
        </div>
      )}
      {isGeneratingHTML && (
        <div data-pdf-exclude="true" style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(10,22,40,0.92)', backdropFilter: 'blur(4px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#c9a84c', fontFamily: "'Lato', sans-serif",
        }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌐</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Gerando HTML...</div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>Aguarde, convertendo imagens para base64</div>
        </div>
      )}
    </div>
  );
};

export default ProposalEditor;
