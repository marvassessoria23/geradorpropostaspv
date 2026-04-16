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
import logoImg from "@/assets/logo-paiva-nunes.png";
import { supabase } from "@/integrations/supabase/client";

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

const ProposalEditor: React.FC = () => {
  const [data, setData] = useState<ProposalData>(defaultProposalData);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [panelOpen, setPanelOpen] = useState(true);
  const [previewScale, setPreviewScale] = useState(0.6);
  const [showTip, setShowTip] = useState(true);
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

  const generatePDF = () => {
    document.body.classList.add('printing');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing');
    }, 500);
  };

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a1628', color: '#c9a84c', fontFamily: "'Lato', sans-serif", fontSize: 18 }}>
        Carregando proposta...
      </div>
    );
  }

  const visiblePages = data.pages.filter((p) => p.visible);
  let globalPageCounter = 0;

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
