import React, { useState } from "react";
import { ProposalData } from "./types";
import InlineEditable from "./InlineEditable";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
  bgColor?: string;
  onChange?: (updates: Partial<ProposalData>) => void;
}

const fs = { small: 12, medium: 14, large: 16 };
const v = (val: string | undefined | null) => !!(val && val.trim() !== '');

export const getDiagnosticoVisibleSubPages = (data: ProposalData): boolean[] => {
  const slide1 = !data.hiddenFields?.['subpage_diagnostico_1'];
  const slide2Hidden = !!data.hiddenFields?.['subpage_diagnostico_2'];
  const hasSlide2Content = v(data.diagnosticoJurisprudencia) || v(data.diagnosticoConclusao);
  const slide2 = !slide2Hidden && hasSlide2Content;
  return [slide1, slide2];
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

const PageDiagnostico: React.FC<Props> = ({ data, textSizeClass, pageNumber, bgColor, onChange }) => {
  const sz = fs[data.textSize] || 14;
  const up = onChange || (() => {});
  const bg = bgColor || '#f5f0e8';
  const subs = getDiagnosticoVisibleSubPages(data);

  const slideStyle: React.CSSProperties = {
    width: 1280,
    height: 720,
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '48px 64px',
    backgroundColor: bg,
  };

  const textStyle: React.CSSProperties = {
    fontFamily: "'Lato', sans-serif",
    color: '#1a3a5c',
    fontSize: sz,
    lineHeight: 1.7,
    textAlign: 'justify',
    margin: 0,
    whiteSpace: 'pre-wrap',
  };

  // Compute page numbers (slide 2 only consumes a number if visible)
  const slide2PageNum = subs[0] ? pageNumber + 1 : pageNumber;

  return (
    <>
      {subs[0] && (
        <div data-proposal-page className="slide-shadow" style={{ position: 'relative' }}>
          <HideButton subPageKey="subpage_diagnostico_1" onChange={up} data={data} />
          <div className="slide watermark-light" data-slide style={slideStyle}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, border: '4px solid rgba(13,43,69,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 40, right: 50, width: 100, height: 100, border: '3px solid rgba(201,168,76,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div className="gold-badge" style={{ marginBottom: 24 }}>CONTEXTO DA DEMANDA</div>

            {v(data.diagnosticoTitle) && (
              <InlineEditable
                tag="h3"
                value={data.diagnosticoTitle}
                onChange={(v) => up({ diagnosticoTitle: v })}
                style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 20, marginBottom: 16 }}
              />
            )}

            {v(data.diagnosticoGreeting) && (
              <InlineEditable
                tag="p"
                value={data.diagnosticoGreeting}
                onChange={(v) => up({ diagnosticoGreeting: v })}
                style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, fontStyle: 'italic', marginBottom: 12 }}
              />
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {v(data.diagnosticoIntro) && (
                <InlineEditable
                  tag="p"
                  value={data.diagnosticoIntro}
                  onChange={(v) => up({ diagnosticoIntro: v })}
                  multiline
                  style={textStyle}
                />
              )}
              {v(data.diagnosticoBody) && (
                <InlineEditable
                  tag="p"
                  value={data.diagnosticoBody}
                  onChange={(v) => up({ diagnosticoBody: v })}
                  multiline
                  style={textStyle}
                />
              )}
            </div>

            <div className="page-num">{pageNumber}</div>
          </div>
        </div>
      )}

      {subs[1] && (
        <div data-proposal-page className="slide-shadow" style={{ position: 'relative' }}>
          <HideButton subPageKey="subpage_diagnostico_2" onChange={up} data={data} />
          <div className="slide watermark-light" data-slide style={slideStyle}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, border: '4px solid rgba(13,43,69,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 40, right: 50, width: 100, height: 100, border: '3px solid rgba(201,168,76,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div className="gold-badge" style={{ marginBottom: 24 }}>CONTEXTO DA DEMANDA</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {v(data.diagnosticoJurisprudencia) && (
                <InlineEditable
                  tag="p"
                  value={data.diagnosticoJurisprudencia}
                  onChange={(v) => up({ diagnosticoJurisprudencia: v })}
                  multiline
                  style={textStyle}
                />
              )}
              {v(data.diagnosticoConclusao) && (
                <InlineEditable
                  tag="p"
                  value={data.diagnosticoConclusao}
                  onChange={(v) => up({ diagnosticoConclusao: v })}
                  multiline
                  style={textStyle}
                />
              )}
            </div>

            <div className="page-num">{slide2PageNum}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageDiagnostico;
