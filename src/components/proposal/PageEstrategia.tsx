import React, { useState } from "react";
import { ProposalData } from "./types";
import InlineEditable from "./InlineEditable";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  startPageNumber: number;
  bgColor?: string;
  onChange?: (updates: Partial<ProposalData>) => void;
}

const val = (v: string | undefined | null) => v && v.trim() !== '';
const isHidden = (data: ProposalData, key: string) => data.hiddenFields?.[key];
const show = (data: ProposalData, key: string, value: string | undefined | null) =>
  !isHidden(data, key) && val(value);

// Check which sub-pages have content
export const getEstrategiaVisibleSubPages = (data: ProposalData): boolean[] => {
  const s = (key: string, value: string | undefined | null) => !data.hiddenFields?.[key] && val(value);
  const sp1Hidden = !!data.hiddenFields?.['subpage_estrategia_1'];
  const sp2Hidden = !!data.hiddenFields?.['subpage_estrategia_2'];
  const sp3Hidden = !!data.hiddenFields?.['subpage_estrategia_3'];
  const sp4Hidden = !!data.hiddenFields?.['subpage_estrategia_4'];

  const sp1 = !sp1Hidden && (
    s('estrategiaIntro', data.estrategiaIntro) ||
    s('movimento1Title', data.movimento1Title) ||
    s('movimento1Intro', data.movimento1Intro) ||
    s('movimento1Item1', data.movimento1Item1) ||
    s('movimento1Item2', data.movimento1Item2)
  );
  const sp2 = !sp2Hidden && (
    s('movimento1Item3', data.movimento1Item3) ||
    s('movimento1Resultado', data.movimento1Resultado)
  );
  const sp3 = !sp3Hidden && (
    s('movimento2Title', data.movimento2Title) ||
    s('movimento2Consignacao', data.movimento2Consignacao) ||
    s('movimento2Obrigacao', data.movimento2Obrigacao) ||
    s('movimento2Pedidos', data.movimento2Pedidos) ||
    s('movimento2Observacoes', data.movimento2Observacoes)
  );
  const sp4 = !sp4Hidden && (
    s('movimento3Title', data.movimento3Title) ||
    s('movimento3Body', data.movimento3Body)
  );

  return [!!sp1, !!sp2, !!sp3, !!sp4];
};

const HideButton: React.FC<{ subPageKey: string; onChange: (u: Partial<ProposalData>) => void; data: ProposalData }> = ({ subPageKey, onChange, data }) => {
  const [hovered, setHovered] = useState(false);
  return hovered ? (
    <div
      className="no-print"
      style={{ position: 'absolute', top: 8, right: 8, zIndex: 1000 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange({ hiddenFields: { ...data.hiddenFields, [subPageKey]: true } });
        }}
        style={{
          background: 'rgba(13,43,69,0.9)', border: '1px solid #c9a84c',
          color: '#c9a84c', borderRadius: 6, padding: '6px 12px',
          cursor: 'pointer', fontSize: 12, fontFamily: "'Lato', sans-serif",
        }}
      >
        🙈 Ocultar sub-página
      </button>
    </div>
  ) : (
    <div
      className="no-print"
      style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, zIndex: 999 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
};

const PageEstrategia: React.FC<Props> = ({ data, textSizeClass, startPageNumber, bgColor, onChange }) => {
  const sz = { small: 12, medium: 13, large: 15 }[data.textSize] || 13;
  const bg = bgColor || '#f5f0e8';
  const up = onChange || (() => {});
  const slideStyle = { padding: '48px 64px', backgroundColor: bg };
  const textStyle = { fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify' as const, whiteSpace: 'pre-wrap' as const };

  const visibleSubs = getEstrategiaVisibleSubPages(data);
  // Compute dynamic page numbers
  const pageNums: number[] = [];
  let pn = startPageNumber;
  for (let i = 0; i < 4; i++) {
    pageNums.push(pn);
    if (visibleSubs[i]) pn++;
  }

  return (
    <>
      {visibleSubs[0] && (
        <div data-proposal-page className="slide-shadow" style={{ position: 'relative' }}>
          <HideButton subPageKey="subpage_estrategia_1" onChange={up} data={data} />
          <div className="slide watermark-light" data-slide style={slideStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div className="gold-bar-vertical" style={{ height: 48 }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a5c', fontSize: 28, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Proposta de Atuação
              </h2>
              <div style={{ flex: 1, height: 1, background: 'rgba(26,58,92,0.1)', marginLeft: 16 }} />
            </div>

            {show(data, 'estrategiaIntro', data.estrategiaIntro) && (
              <h3 style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 18, marginBottom: 12 }}>
                2. ESTRATÉGIA JURÍDICA PROPOSTA
              </h3>
            )}
            {show(data, 'estrategiaIntro', data.estrategiaIntro) && (
              <InlineEditable tag="p" value={data.estrategiaIntro} onChange={(v) => up({ estrategiaIntro: v })} multiline style={{ ...textStyle, marginBottom: 20 }} />
            )}

            {show(data, 'movimento1Title', data.movimento1Title) && (
              <div style={{ background: 'rgba(26,58,92,0.05)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
                <InlineEditable tag="h3" value={data.movimento1Title} onChange={(v) => up({ movimento1Title: v })} style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 16, margin: 0 }} />
              </div>
            )}

            {show(data, 'movimento1Intro', data.movimento1Intro) && (
              <InlineEditable tag="p" value={data.movimento1Intro} onChange={(v) => up({ movimento1Intro: v })} multiline style={{ ...textStyle, paddingLeft: 12, marginBottom: 16 }} />
            )}

            <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([['movimento1Item1', data.movimento1Item1], ['movimento1Item2', data.movimento1Item2]] as const).map(([key, v_], i) => (
                show(data, key, v_) ? (
                  <div key={key} style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}.</span>
                    <InlineEditable tag="span" value={v_} onChange={(v) => up({ [key]: v })} multiline style={textStyle} />
                  </div>
                ) : null
              ))}
            </div>
            <div className="page-num">{pageNums[0]}</div>
          </div>
        </div>
      )}

      {visibleSubs[1] && (
        <div data-proposal-page className="slide-shadow" style={{ position: 'relative' }}>
          <HideButton subPageKey="subpage_estrategia_2" onChange={up} data={data} />
          <div className="slide watermark-light" data-slide style={slideStyle}>
            {show(data, 'movimento1Item3', data.movimento1Item3) && (
              <div style={{ marginLeft: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>3.</span>
                  <InlineEditable tag="span" value={data.movimento1Item3} onChange={(v) => up({ movimento1Item3: v })} multiline style={textStyle} />
                </div>
              </div>
            )}
            {show(data, 'movimento1Resultado', data.movimento1Resultado) && (
              <div style={{ background: 'rgba(201,168,76,0.1)', borderLeft: '4px solid #c9a84c', borderRadius: '0 8px 8px 0', padding: 20, marginTop: 16 }}>
                <InlineEditable tag="p" value={data.movimento1Resultado} onChange={(v) => up({ movimento1Resultado: v })} multiline style={{ ...textStyle, margin: 0 }} />
              </div>
            )}
            <div className="page-num">{pageNums[1]}</div>
          </div>
        </div>
      )}

      {visibleSubs[2] && (
        <div data-proposal-page className="slide-shadow" style={{ position: 'relative' }}>
          <HideButton subPageKey="subpage_estrategia_3" onChange={up} data={data} />
          <div className="slide watermark-light" data-slide style={slideStyle}>
            {show(data, 'movimento2Title', data.movimento2Title) && (
              <div style={{ background: 'rgba(26,58,92,0.05)', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
                <InlineEditable tag="h3" value={data.movimento2Title} onChange={(v) => up({ movimento2Title: v })} style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 16, margin: 0 }} />
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {([
                { label: "Consignação em Pagamento", key: "movimento2Consignacao" },
                { label: "Obrigação de Fazer", key: "movimento2Obrigacao" },
                { label: "Pedidos Acessórios", key: "movimento2Pedidos" },
                { label: "Observações", key: "movimento2Observacoes" },
              ] as const).map((item) => (
                show(data, item.key, (data as any)[item.key]) ? (
                  <div key={item.key} style={{ display: 'flex', gap: 12 }}>
                    <div className="gold-bar-vertical" style={{ minHeight: 32, flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 14, marginBottom: 4 }}>{item.label}:</h4>
                      <InlineEditable tag="p" value={(data as any)[item.key]} onChange={(v) => up({ [item.key]: v })} multiline style={{ ...textStyle, margin: 0 }} />
                    </div>
                  </div>
                ) : null
              ))}
            </div>
            <div className="page-num">{pageNums[2]}</div>
          </div>
        </div>
      )}

      {visibleSubs[3] && (
        <div data-proposal-page className="slide-shadow" style={{ position: 'relative' }}>
          <HideButton subPageKey="subpage_estrategia_4" onChange={up} data={data} />
          <div className="slide watermark-light" data-slide style={slideStyle}>
            {show(data, 'movimento3Title', data.movimento3Title) && (
              <div style={{ background: 'rgba(26,58,92,0.05)', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
                <InlineEditable tag="h3" value={data.movimento3Title} onChange={(v) => up({ movimento3Title: v })} style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 16, margin: 0 }} />
              </div>
            )}
            {show(data, 'movimento3Body', data.movimento3Body) && (
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="gold-bar-vertical" style={{ minHeight: 32, flexShrink: 0 }} />
                <InlineEditable tag="p" value={data.movimento3Body} onChange={(v) => up({ movimento3Body: v })} multiline style={{ ...textStyle, margin: 0 }} />
              </div>
            )}
            <div className="page-num">{pageNums[3]}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageEstrategia;
