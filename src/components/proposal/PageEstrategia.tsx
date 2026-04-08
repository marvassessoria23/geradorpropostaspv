import React from "react";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  startPageNumber: number;
  bgColor?: string;
}

const PageEstrategia: React.FC<Props> = ({ data, textSizeClass, startPageNumber, bgColor }) => {
  const sz = { small: 12, medium: 13, large: 15 }[data.textSize] || 13;
  let pn = startPageNumber;
  const bg = bgColor || '#f5f0e8';

  const slideStyle = { padding: '48px 64px', backgroundColor: bg };

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
          <p style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify', marginBottom: 20, whiteSpace: 'pre-wrap' }}>
            {data.estrategiaIntro}
          </p>

          <div style={{ background: 'rgba(26,58,92,0.05)', borderRadius: 8, padding: '12px 16px', marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 16, margin: 0 }}>{data.movimento1Title}</h3>
          </div>

          <p style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, paddingLeft: 12, marginBottom: 16, whiteSpace: 'pre-wrap' }}>
            {data.movimento1Intro}
          </p>

          <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[data.movimento1Item1, data.movimento1Item2].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#c9a84c', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify' }}>{item}</span>
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
              <span style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify' }}>{data.movimento1Item3}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(201,168,76,0.1)', borderLeft: '4px solid #c9a84c', borderRadius: '0 8px 8px 0', padding: 20, marginTop: 16 }}>
            <p style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify', margin: 0, whiteSpace: 'pre-wrap' }}>
              {data.movimento1Resultado}
            </p>
          </div>

          <div className="page-num">{pn + 1}</div>
        </div>
      </div>

      <div data-proposal-page className="slide-shadow">
        <div className="slide watermark-light" data-slide style={slideStyle}>
          <div style={{ background: 'rgba(26,58,92,0.05)', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 16, margin: 0 }}>{data.movimento2Title}</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: "Consignação em Pagamento", value: data.movimento2Consignacao },
              { label: "Obrigação de Fazer", value: data.movimento2Obrigacao },
              { label: "Pedidos Acessórios", value: data.movimento2Pedidos },
              { label: "Observações", value: data.movimento2Observacoes },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div className="gold-bar-vertical" style={{ minHeight: 32, flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 14, marginBottom: 4 }}>{item.label}:</h4>
                  <p style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify', margin: 0, whiteSpace: 'pre-wrap' }}>{item.value}</p>
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
            <h3 style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#1a3a5c', fontSize: 16, margin: 0 }}>{data.movimento3Title}</h3>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div className="gold-bar-vertical" style={{ minHeight: 32, flexShrink: 0 }} />
            <p style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, lineHeight: 1.7, textAlign: 'justify', margin: 0, whiteSpace: 'pre-wrap' }}>{data.movimento3Body}</p>
          </div>

          <div className="page-num">{pn + 3}</div>
        </div>
      </div>
    </>
  );
};

export default PageEstrategia;
