import React, { useState, useRef, useCallback } from "react";
import { ProposalData, defaultProposalData, PageType } from "./types";
import EditorPanel from "./EditorPanel";
import PageCover from "./PageCover";
import PageDiagnostico from "./PageDiagnostico";
import PageEstrategia from "./PageEstrategia";
import PageArgumentos from "./PageArgumentos";
import PageSobre from "./PageSobre";
import PageEquipe from "./PageEquipe";
import PageInvestimento from "./PageInvestimento";
import PageFechamento from "./PageFechamento";
import PageContato from "./PageContato";
import { FileDown, PanelLeftClose, PanelLeft } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import logoImg from "@/assets/logo-paiva-nunes.png";

const TEXT_SIZE_MAP = {
  small: "text-xs md:text-sm",
  medium: "text-sm md:text-base",
  large: "text-base md:text-lg",
};

const ProposalEditor: React.FC = () => {
  const [data, setData] = useState<ProposalData>(defaultProposalData);
  const [generating, setGenerating] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateData = useCallback((updates: Partial<ProposalData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const textSizeClass = TEXT_SIZE_MAP[data.textSize];

  const generatePDF = async () => {
    if (!previewRef.current || generating) return;
    setGenerating(true);

    try {
      const pages = previewRef.current.querySelectorAll("[data-proposal-page]");
      if (pages.length === 0) return;

      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageWidth = 297;
      const pageHeight = 210;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
      }

      pdf.save(`Proposta_${data.clientName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setGenerating(false);
    }
  };

  const visiblePages = data.pages.filter((p) => p.visible);
  let globalPageCounter = 0;

  const renderPage = (pageType: PageType, pageNumber: number) => {
    switch (pageType) {
      case "cover":
        return <PageCover data={data} pageNumber={pageNumber} />;
      case "diagnostico":
        return <PageDiagnostico data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} />;
      case "estrategia":
        return <PageEstrategia data={data} textSizeClass={textSizeClass} startPageNumber={pageNumber} />;
      case "argumentos":
        return <PageArgumentos data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} />;
      case "sobre":
        return <PageSobre data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} />;
      case "equipe":
        return <PageEquipe data={data} pageNumber={pageNumber} />;
      case "investimento":
        return <PageInvestimento data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} />;
      case "fechamento":
        return <PageFechamento data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} />;
      case "contato":
        return <PageContato data={data} textSizeClass={textSizeClass} pageNumber={pageNumber} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d1b2a]">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-proposal-gold/15 px-5 py-2.5 flex items-center justify-between bg-proposal-dark/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="p-2 rounded-lg border border-proposal-gold/20 text-proposal-gold hover:bg-proposal-gold/10 transition-all hover:border-proposal-gold/40"
          >
            {panelOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
          </button>
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Paiva Nunes" className="w-8 h-8 object-contain" />
            <div>
              <h1 className="font-display text-proposal-text-light text-sm tracking-wider leading-none">
                Gerador de Propostas
              </h1>
              <span className="text-proposal-gold/60 text-[10px] font-body tracking-widest uppercase">Paiva Nunes Advogados</span>
            </div>
          </div>
        </div>
        <button
          onClick={generatePDF}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-proposal-gold to-proposal-gold-light text-proposal-dark font-body font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 shadow-lg shadow-proposal-gold/20"
        >
          <FileDown size={16} />
          {generating ? "Gerando..." : "Gerar PDF"}
        </button>
      </header>

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        {/* Editor Panel */}
        {panelOpen && (
          <div className="w-[400px] flex-shrink-0 border-r border-proposal-gold/10 overflow-hidden bg-[#0f1f33]">
            <EditorPanel data={data} onChange={updateData} />
          </div>
        )}

        {/* Preview */}
        <div className="flex-1 overflow-y-auto p-8" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1b2a 50%, #0f1f33 100%)' }}>
          <div
            ref={previewRef}
            className={`max-w-5xl mx-auto ${data.viewMode === "pages" ? "space-y-8" : "space-y-0"}`}
          >
            {visiblePages.map((page) => {
              globalPageCounter++;
              const currentPageNum = globalPageCounter;

              if (page.type === "estrategia") {
                globalPageCounter += 3;
              }

              if (page.type === "estrategia") {
                return (
                  <div key={page.id} className={data.viewMode === "pages" ? "space-y-8" : ""}>
                    {renderPage(page.type, currentPageNum)}
                  </div>
                );
              }

              return (
                <div key={page.id} data-proposal-page className={data.viewMode === "pages" ? "proposal-page-shadow" : ""}>
                  {renderPage(page.type, currentPageNum)}
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
