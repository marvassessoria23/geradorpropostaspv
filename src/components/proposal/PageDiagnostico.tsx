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

const PageDiagnostico: React.FC<Props> = ({ data, textSizeClass, pageNumber, bgColor, onChange }) => {
  const sz = fs[data.textSize] || 14;
  const up = onChange || (() => {});
  const fields: (keyof ProposalData)[] = ['diagnosticoIntro', 'diagnosticoBody', 'diagnosticoJurisprudencia', 'diagnosticoConclusao'];

  return (
    <div className="slide watermark-light" data-slide style={{ padding: '48px 64px', backgroundColor: bgColor || '#f5f0e8' }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, border: '4px solid rgba(13,43,69,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 40, right: 50, width: 100, height: 100, border: '3px solid rgba(201,168,76,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="gold-badge" style={{ marginBottom: 24 }}>CONTEXTO DA DEMANDA</div>

      <InlineEditable
        tag="h3"
        value={data.diagnosticoTitle}
        onChange={(v) => up({ diagnosticoTitle: v })}
        style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 20, marginBottom: 16 }}
      />

      <InlineEditable
        tag="p"
        value={data.diagnosticoGreeting}
        onChange={(v) => up({ diagnosticoGreeting: v })}
        style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, fontStyle: 'italic', marginBottom: 12 }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {fields.map((field) => (
          <InlineEditable
            key={field}
            tag="p"
            value={data[field] as string}
            onChange={(v) => up({ [field]: v })}
            multiline
            style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify', margin: 0, whiteSpace: 'pre-wrap' }}
          />
        ))}
      </div>

      <div className="page-num">{pageNumber}</div>
    </div>
  );
};

export default PageDiagnostico;
