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

const v = (val: string | undefined | null) => !!(val && val.trim() !== '');

export const getSobreVisibleSubPages = (data: ProposalData): boolean[] => {
  const slide1 = !data.hiddenFields?.['subpage_sobre_1'];
  const slide2Hidden = !!data.hiddenFields?.['subpage_sobre_2'];
  const hasSlide2Content = v(data.sobreText3);
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
    padding: '64px 96px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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

  const slide2PageNum = subs[0] ? pageNumber + 1 : pageNumber;

  return (
    <>
      {subs[0] && (
        <div data-proposal-page className="slide-shadow" style={{ position: 'relative' }}>
          <HideButton subPageKey="subpage_sobre_1" onChange={up} data={data} />
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
        <div data-proposal-page className="slide-shadow" style={{ position: 'relative' }}>
          <HideButton subPageKey="subpage_sobre_2" onChange={up} data={data} />
          <div className="slide watermark-light" data-slide style={slide2Style}>
            <InlineEditable
              tag="p"
              value={data.sobreText3}
              onChange={(v) => up({ sobreText3: v })}
              multiline
              style={{ ...textStyle, fontSize: sz + 1, lineHeight: 1.8 }}
            />
            <div className="page-num">{slide2PageNum}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageSobre;
