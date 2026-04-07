import React from "react";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
}

const fs = { small: 12, medium: 14, large: 16 };

const PageDiagnostico: React.FC<Props> = ({ data, textSizeClass, pageNumber }) => {
  const sz = fs[data.textSize] || 14;

  return (
    <div className="slide slide-light watermark-light" style={{ padding: '48px 64px' }}>
      {/* Decorative circles top-right */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, border: '4px solid rgba(13,43,69,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 40, right: 50, width: 100, height: 100, border: '3px solid rgba(201,168,76,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Gold badge */}
      <div className="gold-badge" style={{ marginBottom: 24 }}>
        CONTEXTO DA DEMANDA
      </div>

      <h3 style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 20, marginBottom: 16 }}>
        {data.diagnosticoTitle}
      </h3>

      <p style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, fontStyle: 'italic', marginBottom: 12 }}>
        {data.diagnosticoGreeting}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[data.diagnosticoIntro, data.diagnosticoBody, data.diagnosticoJurisprudencia, data.diagnosticoConclusao].map((text, i) => (
          <p key={i} style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify', margin: 0, whiteSpace: 'pre-wrap' }}>
            {text}
          </p>
        ))}
      </div>

      <div className="page-num">{pageNumber}</div>
    </div>
  );
};

export default PageDiagnostico;
