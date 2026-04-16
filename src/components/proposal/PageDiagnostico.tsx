import React from "react";
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
  // Slide 1 sempre visível (tem badge fixo)
  const slide1 = true;
  // Slide 2 só se tiver jurisprudência ou conclusão
  const slide2 = v(data.diagnosticoJurisprudencia) || v(data.diagnosticoConclusao);
  return [slide1, slide2];
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

  return (
    <>
      {subs[0] && (
        <div data-proposal-page style={{ position: 'relative' }}>
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
        <div data-proposal-page style={{ position: 'relative' }}>
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

            <div className="page-num">{pageNumber + 1}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageDiagnostico;
