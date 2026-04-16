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

const v = (val: string | undefined | null) => !!(val && val.trim() !== '');

export const getSobreVisibleSubPages = (data: ProposalData): boolean[] => {
  // Slide 1 sempre visível (tem título/estrutura)
  const slide1 = true;
  // Slide 2 só se sobreText3 tiver conteúdo
  const slide2 = v(data.sobreText3);
  return [slide1, slide2];
};

const PageSobre: React.FC<Props> = ({ data, textSizeClass, pageNumber, bgColor, onChange }) => {
  const sz = { small: 12, medium: 14, large: 16 }[data.textSize] || 14;
  const up = onChange || (() => {});
  const bg = bgColor || '#f5f0e8';
  const subs = getSobreVisibleSubPages(data);

  const slide1Style: React.CSSProperties = {
    width: 1280,
    height: 720,
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '48px 64px',
    display: 'flex',
    backgroundColor: bg,
  };

  const slide2Style: React.CSSProperties = {
    width: 1280,
    height: 720,
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box',
    padding: '48px 64px',
    display: 'flex',
    flexDirection: 'column',
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
          <div className="slide watermark-light" data-slide style={slide1Style}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div className="gold-bar-vertical" style={{ height: 48 }} />
                {v(data.sobreTitle) && (
                  <InlineEditable
                    tag="h2"
                    value={data.sobreTitle}
                    onChange={(v) => up({ sobreTitle: v })}
                    style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a5c', fontSize: 28, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}
                  />
                )}
                <div style={{ flex: 1, height: 1, background: 'rgba(26,58,92,0.1)', marginLeft: 16 }} />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {v(data.sobreText1) && (
                  <InlineEditable
                    tag="p"
                    value={data.sobreText1}
                    onChange={(v) => up({ sobreText1: v })}
                    multiline
                    style={textStyle}
                  />
                )}
                {v(data.sobreText2) && (
                  <InlineEditable
                    tag="p"
                    value={data.sobreText2}
                    onChange={(v) => up({ sobreText2: v })}
                    multiline
                    style={textStyle}
                  />
                )}
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
                <div style={{ border: '2px solid #c9a84c', borderRadius: 999, padding: '10px 32px', background: '#0d2b45', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 4px 16px rgba(13,43,69,0.3)' }}>
                  <span style={{ color: '#c9a84c', fontSize: 16 }}>👆</span>
                  <span style={{ fontFamily: "'Lato', sans-serif", color: '#ffffff', fontWeight: 500, fontSize: 14, letterSpacing: '0.05em' }}>Conheça nossas redes sociais</span>
                </div>
              </div>
            </div>

            {data.fotoSobre && (
              <div style={{ width: '35%', marginLeft: 32, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                <img src={data.fotoSobre} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <div className="page-num">{pageNumber}</div>
          </div>
        </div>
      )}

      {subs[1] && (
        <div data-proposal-page style={{ position: 'relative' }}>
          <div className="slide watermark-light" data-slide style={slide2Style}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div className="gold-bar-vertical" style={{ height: 48 }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a5c', fontSize: 28, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                {data.sobreTitle || 'Sobre'}
              </h2>
              <div style={{ flex: 1, height: 1, background: 'rgba(26,58,92,0.1)', marginLeft: 16 }} />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <InlineEditable
                tag="p"
                value={data.sobreText3}
                onChange={(v) => up({ sobreText3: v })}
                multiline
                style={textStyle}
              />
            </div>

            <div className="page-num">{pageNumber + 1}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageSobre;
