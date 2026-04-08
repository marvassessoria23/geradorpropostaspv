import React from "react";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
  bgColor?: string;
}

const PageSobre: React.FC<Props> = ({ data, textSizeClass, pageNumber, bgColor }) => {
  const sz = { small: 12, medium: 14, large: 16 }[data.textSize] || 14;

  return (
    <div className="slide watermark-light" data-slide style={{ padding: '48px 64px', display: 'flex', backgroundColor: bgColor || '#f5f0e8' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div className="gold-bar-vertical" style={{ height: 48 }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a5c', fontSize: 28, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            {data.sobreTitle}
          </h2>
          <div style={{ flex: 1, height: 1, background: 'rgba(26,58,92,0.1)', marginLeft: 16 }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[data.sobreText1, data.sobreText2, data.sobreText3].map((text, i) => (
            <p key={i} style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify', margin: 0, whiteSpace: 'pre-wrap' }}>
              {text}
            </p>
          ))}
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
  );
};

export default PageSobre;
