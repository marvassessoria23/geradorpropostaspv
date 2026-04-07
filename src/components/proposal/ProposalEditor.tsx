import React, { useState, useRef, useCallback } from "react";
import { ProposalData, defaultProposalData } from "./types";
import PageCover from "./PageCover";
import PageDiagnostico from "./PageDiagnostico";
import PageEstrategia from "./PageEstrategia";
import PageArgumentos from "./PageArgumentos";
import PageSobre from "./PageSobre";
import PageEquipe from "./PageEquipe";
import PageInvestimento from "./PageInvestimento";
import PageFechamento from "./PageFechamento";
import PageContato from "./PageContato";
import { FileDown, Eye, Settings, ChevronDown, ChevronUp } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const TEXT_SIZE_MAP = {
  small: "text-xs md:text-sm",
  medium: "text-sm md:text-base",
  large: "text-base md:text-lg",
};

const SECTIONS = [
  { key: "cover", label: "Capa" },
  { key: "diagnostico", label: "Diagnóstico" },
  { key: "estrategia", label: "Estratégia Jurídica" },
  { key: "argumentos", label: "Argumentos" },
  { key: "sobre", label: "Sobre o Escritório" },
  { key: "equipe", label: "Equipe" },
  { key: "investimento", label: "Investimento" },
  { key: "fechamento", label: "Próximos Passos" },
  { key: "contato", label: "Contato" },
];

const ProposalEditor: React.FC = () => {
  const [data, setData] = useState<ProposalData>(defaultProposalData);
  const [showSettings, setShowSettings] = useState(false);
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateData = useCallback((updates: Partial<ProposalData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const toggleSection = (key: string) => {
    setData((prev) => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [key]: !prev.visibleSections[key],
      },
    }));
  };

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

        // Hide no-print elements temporarily
        const noPrintEls = page.querySelectorAll(".no-print");
        noPrintEls.forEach((el) => ((el as HTMLElement).style.display = "none"));

        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
        });

        noPrintEls.forEach((el) => ((el as HTMLElement).style.display = ""));

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

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-proposal-dark border-b border-proposal-gold/20 px-4 py-3 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-proposal-gold/50 rounded flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none" stroke="hsl(42, 65%, 55%)" strokeWidth="1.5">
              <path d="M20 5 L35 15 L30 35 L10 35 L5 15 Z" />
              <path d="M20 10 L30 17 L27 32 L13 32 L10 17 Z" />
            </svg>
          </div>
          <h1 className="font-display text-proposal-text-light text-lg tracking-wider">
            Gerador de Propostas
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-proposal-gold/30 text-proposal-gold hover:bg-proposal-gold/10 transition-colors font-body text-sm"
          >
            <Settings size={16} />
            Configurações
            {showSettings ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={generatePDF}
            disabled={generating}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-proposal-gold text-proposal-dark font-body font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50"
          >
            <FileDown size={16} />
            {generating ? "Gerando..." : "Gerar PDF"}
          </button>
        </div>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="no-print bg-proposal-dark/95 border-b border-proposal-gold/20 px-6 py-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text size */}
            <div>
              <h3 className="text-proposal-gold font-body font-semibold text-sm mb-2">Tamanho do Texto</h3>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateData({ textSize: size })}
                    className={`px-4 py-1.5 rounded font-body text-sm transition-colors ${
                      data.textSize === size
                        ? "bg-proposal-gold text-proposal-dark"
                        : "border border-proposal-gold/30 text-proposal-text-light hover:bg-proposal-gold/10"
                    }`}
                  >
                    {size === "small" ? "Pequeno" : size === "medium" ? "Médio" : "Grande"}
                  </button>
                ))}
              </div>
            </div>

            {/* Visible sections */}
            <div>
              <h3 className="text-proposal-gold font-body font-semibold text-sm mb-2">Seções Visíveis</h3>
              <div className="flex flex-wrap gap-2">
                {SECTIONS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => toggleSection(s.key)}
                    className={`px-3 py-1 rounded-full font-body text-xs transition-colors ${
                      data.visibleSections[s.key]
                        ? "bg-proposal-gold/20 text-proposal-gold border border-proposal-gold/40"
                        : "bg-proposal-dark border border-proposal-text-light/20 text-proposal-text-light/40"
                    }`}
                  >
                    {data.visibleSections[s.key] ? <Eye size={10} className="inline mr-1" /> : null}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div ref={previewRef} className="space-y-6">
          {data.visibleSections.cover && (
            <div data-proposal-page>
              <PageCover data={data} onChange={updateData} />
            </div>
          )}
          {data.visibleSections.diagnostico && (
            <div data-proposal-page>
              <PageDiagnostico data={data} onChange={updateData} textSizeClass={textSizeClass} />
            </div>
          )}
          {data.visibleSections.estrategia && (
            <div data-proposal-page>
              <PageEstrategia data={data} onChange={updateData} textSizeClass={textSizeClass} />
            </div>
          )}
          {data.visibleSections.argumentos && (
            <div data-proposal-page>
              <PageArgumentos data={data} onChange={updateData} textSizeClass={textSizeClass} />
            </div>
          )}
          {data.visibleSections.sobre && (
            <div data-proposal-page>
              <PageSobre data={data} onChange={updateData} textSizeClass={textSizeClass} />
            </div>
          )}
          {data.visibleSections.equipe && (
            <div data-proposal-page>
              <PageEquipe data={data} onChange={updateData} />
            </div>
          )}
          {data.visibleSections.investimento && (
            <div data-proposal-page>
              <PageInvestimento data={data} onChange={updateData} textSizeClass={textSizeClass} />
            </div>
          )}
          {data.visibleSections.fechamento && (
            <div data-proposal-page>
              <PageFechamento data={data} onChange={updateData} textSizeClass={textSizeClass} />
            </div>
          )}
          {data.visibleSections.contato && (
            <div data-proposal-page>
              <PageContato data={data} onChange={updateData} textSizeClass={textSizeClass} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalEditor;
