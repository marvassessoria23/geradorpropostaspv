import React, { useState, useRef, useCallback, useEffect } from "react";
import { ProposalData, defaultProposalData, PageType, DEFAULT_BG_COLORS } from "./types";
import EditorPanel from "./EditorPanel";
import PageCover from "./PageCover";
import PageDiagnostico from "./PageDiagnostico";
import PageEstrategia from "./PageEstrategia";
import PageArgumentos from "./PageArgumentos";
import PageSobre from "./PageSobre";
import PageEquipe from "./PageEquipe";
import PageAvaliacoes from "./PageAvaliacoes";
import PageInvestimento from "./PageInvestimento";
import PageFechamento from "./PageFechamento";
import PageContato from "./PageContato";
import { FileDown, PanelLeftClose, PanelLeft } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import logoImg from "@/assets/logo-paiva-nunes.png";

const TEXT_SIZE_MAP = {
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
};

const ProposalEditor: React.FC = () => {
  const [data, setData] = useState<ProposalData>(defaultProposalData);
  const [generating, setGenerating] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [previewScale, setPreviewScale] = useState(0.6);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateData = useCallback((updates: Partial<ProposalData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

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
    if (generating) return;
    setGenerating(true);

    try {
      await document.fonts.ready;

      const hiddenContainer = document.createElement('div');
      hiddenContainer.style.cssText = 'position:fixed;top:0;left:-99999px;width:1280px;z-index:-1;';
      document.body.appendChild(hiddenContainer);

      const slides = document.querySelectorAll('.slide');
      slides.forEach(slide => hiddenContainer.appendChild(slide.cloneNode(true)));

      hiddenContainer.querySelectorAll('.slide').forEach(el => {
        (el as HTMLElement).style.transform = 'none';
        (el as HTMLElement).style.transformOrigin = 'unset';
        (el as HTMLElement).style.overflow = 'visible';
      });

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1280, 720], compress: true });
      const clonedSlides = hiddenContainer.querySelectorAll('.slide');

      for (let i = 0; i < clonedSlides.length; i++) {
        const canvas = await html2canvas(clonedSlides[i] as HTMLElement, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: null,
          imageTimeout: 0,
          width: 1280,
          height: 720,
          windowWidth: 1280,
          windowHeight: 720,
          onclone: (clonedDoc) => {
            clonedDoc.querySelectorAll('img').forEach(img => {
              img.crossOrigin = 'anonymous';
            });
          }
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage([1280, 720], 'landscape');
        pdf.addImage(imgData, 'JPEG', 0, 0, 1280, 720);
      }

      document.body.removeChild(hiddenContainer);
      pdf.save(`Proposta_${data.clientName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setGenerating(false);
    }
  };

  const visiblePages = data.pages.filter((p) => p.visible);
  let globalPageCounter = 0;

  const renderPage = (pageType: PageType, pageNumber: number, bgColor: string) => {
    switch (pageType) {
      case "cover":
        return <PageCover data={data} pageNumber={pageNumber} bgColor={bgColor} />;
      case "diagnostico":
        return <PageDiagnostico data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} />;
      case "estrategia":
        return <PageEstrategia data={data} textSizeClass={textSizeClass} startPageNumber={pageNumber} bgColor={bgColor} />;
      case "argumentos":
        return <PageArgumentos data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} />;
      case "sobre":
        return <PageSobre data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} />;
      case "equipe":
        return <PageEquipe data={data} pageNumber={pageNumber} bgColor={bgColor} />;
      case "avaliacoes":
        return <PageAvaliacoes data={data} pageNumber={pageNumber} bgColor={bgColor} />;
      case "investimento":
        return <PageInvestimento data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} />;
      case "fechamento":
        return <PageFechamento data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} />;
      case "contato":
        return <PageContato data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} bgColor={bgColor} />;
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
        <button
          onClick={generatePDF}
          disabled={generating}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 8, background: 'linear-gradient(to right, #c9a84c, #e8c96a)', color: '#0d2b45', fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(201,168,76,0.25)', opacity: generating ? 0.5 : 1 }}
        >
          <FileDown size={16} />
          {generating ? "Gerando..." : "Gerar PDF"}
        </button>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Editor Panel */}
        {panelOpen && (
          <div style={{ width: 380, flexShrink: 0, borderRight: '1px solid rgba(201,168,76,0.08)', overflow: 'hidden', background: '#0f1f33' }}>
            <EditorPanel data={data} onChange={updateData} />
          </div>
        )}

        {/* Preview */}
        <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', padding: 32, background: 'linear-gradient(135deg, #0a1628 0%, #0d1b2a 50%, #0f1f33 100%)' }}>
          <div
            ref={previewRef}
            className="preview-wrapper"
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
                globalPageCounter += 3;
              }

              if (page.type === "estrategia") {
                return (
                  <div key={page.id} style={{ marginBottom: data.viewMode === "pages" ? 32 : 0 }}>
                    {renderPage(page.type, currentPageNum, bgColor)}
                  </div>
                );
              }

              return (
                <div key={page.id} data-proposal-page className={data.viewMode === "pages" ? "slide-shadow" : ""} style={{ marginBottom: data.viewMode === "pages" ? 32 : 0 }}>
                  {renderPage(page.type, currentPageNum, bgColor)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalEditor;
