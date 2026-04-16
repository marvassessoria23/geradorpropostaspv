import React from "react";
import { ProposalData } from "./types";
import InlineEditable from "./InlineEditable";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  startPageNumber: number;
  bgColor?: string;
  onChange?: (updates: Partial<ProposalData>) => void;
}

const PageEstrategia: React.FC<Props> = ({ data, textSizeClass, startPageNumber, bgColor, onChange }) => {
  const sz = { small: 12, medium: 13, large: 15 }[data.textSize] || 13;
  let pn = startPageNumber;
  const bg = bgColor || '#f5f0e8';
  const up = onChange || (() => {});
  const slideStyle = { padding: '48px 64px', backgroundColor: bg };
  const textStyle = { fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify' as const, whiteSpace: 'pre-wrap' as const };

  return (
    <>
      <div data-proposal-page className="slide-shadow">
        <div className="slide watermark-light" data-slide style={slideStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div className="gold-bar-vertical" style={{ height: 48 }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a5c', fontSize: 28, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              Proposta de Atuação
            </h2>
            <div style={{ flex: 1, height: 1, background: 'rgba(26,58,92,0.1)', marginLeft: 16 }} />
          </div>

          <h3 style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 18, marginBottom: 12 }}>
            2. ESTRATÉGIA JURÍDICA PROPOSTA
          </h3>
          <InlineEditable tag="p" value={data.estrategiaIntro} onChange={(v) => up({ estrategiaIntro: v })} multiline style={{ ...textStyle, marginBottom: 20 }} />

          <div style={{ background: 'rgba(26,58,92,0.05)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
            <InlineEditable tag="h3" value={data.movimento1Title} onChange={(v) => up({ movimento1Title: v })} style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 16, margin: 0 }} />
          </div>

          <InlineEditable tag="p" value={data.movimento1Intro} onChange={(v) => up({ movimento1Intro: v })} multiline style={{ ...textStyle, paddingLeft: 12, marginBottom: 16 }} />

          <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {([['movimento1Item1', data.movimento1Item1], ['movimento1Item2', data.movimento1Item2]] as const).map(([key, val], i) => (
              <div key={key} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}.</span>
                <InlineEditable tag="span" value={val} onChange={(v) => up({ [key]: v })} multiline style={textStyle} />
              </div>
            ))}
          </div>
          <div className="page-num">{pn}</div>
        </div>
      </div>

      <div data-proposal-page className="slide-shadow">
        <div className="slide watermark-light" data-slide style={slideStyle}>
          <div style={{ marginLeft: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>3.</span>
              <InlineEditable tag="span" value={data.movimento1Item3} onChange={(v) => up({ movimento1Item3: v })} multiline style={textStyle} />
            </div>
          </div>
          <div style={{ background: 'rgba(201,168,76,0.1)', borderLeft: '4px solid #c9a84c', borderRadius: '0 8px 8px 0', padding: 20, marginTop: 16 }}>
            <InlineEditable tag="p" value={data.movimento1Resultado} onChange={(v) => up({ movimento1Resultado: v })} multiline style={{ ...textStyle, margin: 0 }} />
          </div>
          <div className="page-num">{pn + 1}</div>
        </div>
      </div>

      <div data-proposal-page className="slide-shadow">
        <div className="slide watermark-light" data-slide style={slideStyle}>
          <div style={{ background: 'rgba(26,58,92,0.05)', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
            <InlineEditable tag="h3" value={data.movimento2Title} onChange={(v) => up({ movimento2Title: v })} style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 16, margin: 0 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {([
              { label: "Consignação em Pagamento", key: "movimento2Consignacao" },
              { label: "Obrigação de Fazer", key: "movimento2Obrigacao" },
              { label: "Pedidos Acessórios", key: "movimento2Pedidos" },
              { label: "Observações", key: "movimento2Observacoes" },
            ] as const).map((item) => (
              <div key={item.key} style={{ display: 'flex', gap: 12 }}>
                <div className="gold-bar-vertical" style={{ minHeight: 32, flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 14, marginBottom: 4 }}>{item.label}:</h4>
                  <InlineEditable tag="p" value={(data as any)[item.key]} onChange={(v) => up({ [item.key]: v })} multiline style={{ ...textStyle, margin: 0 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="page-num">{pn + 2}</div>
        </div>
      </div>

      <div data-proposal-page className="slide-shadow">
        <div className="slide watermark-light" data-slide style={slideStyle}>
          <div style={{ background: 'rgba(26,58,92,0.05)', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
            <InlineEditable tag="h3" value={data.movimento3Title} onChange={(v) => up({ movimento3Title: v })} style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 16, margin: 0 }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="gold-bar-vertical" style={{ minHeight: 32, flexShrink: 0 }} />
            <InlineEditable tag="p" value={data.movimento3Body} onChange={(v) => up({ movimento3Body: v })} multiline style={{ ...textStyle, margin: 0 }} />
          </div>
          <div className="page-num">{pn + 3}</div>
        </div>
      </div>
    </>
  );
};

export default PageEstrategia;
