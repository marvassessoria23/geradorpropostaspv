import React from "react";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
}

const PageFechamento: React.FC<Props> = ({ data, textSizeClass, pageNumber }) => {
  const sz = { small: 12, medium: 14, large: 16 }[data.textSize] || 14;
  const hasImage = !!data.fotoProximosPassos;

  return (
    <div className="slide slide-dark geometric-dark" style={{ display: 'flex', padding: 0 }}>
      {/* Content */}
      <div style={{ flex: 1, padding: '48px 64px', display: 'flex', flexDirection: 'column', zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div className="gold-bar-vertical" style={{ height: 40 }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontSize: 28, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
            Próximos Passos
          </h2>
          <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)', marginLeft: 16 }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ position: 'relative', paddingLeft: 40 }}>
            <div style={{ position: 'absolute', left: 12, top: 8, bottom: 8, width: 1, background: 'linear-gradient(to bottom, rgba(201,168,76,0.6), rgba(201,168,76,0.15), transparent)' }} />
            {data.fechamentoSteps.map((step, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: 32 }}>
                <div style={{ position: 'absolute', left: -34, top: 2, width: 22, height: 22, borderRadius: '50%', background: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(201,168,76,0.3)' }}>
                  <span style={{ color: '#0d2b45', fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
                </div>
                <p style={{ fontFamily: "'Lato', sans-serif", color: '#ffffff', fontSize: sz, lineHeight: 1.6 }}>{step}</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: 24, marginTop: 16 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontSize: 18, lineHeight: 1.6, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
              {data.fechamentoCTA}
            </p>
          </div>
        </div>

        <div className="page-num">{pageNumber}</div>
      </div>

      {/* Optional side image */}
      {hasImage && (
        <div style={{ width: '35%', position: 'relative', overflow: 'hidden' }}>
          <img src={data.fotoProximosPassos!} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0d2b45 0%, rgba(13,43,69,0.5) 30%, transparent 100%)' }} />
        </div>
      )}
    </div>
  );
};

export default PageFechamento;
