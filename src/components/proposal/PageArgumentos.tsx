import React from "react";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
  bgColor?: string;
}

const PageArgumentos: React.FC<Props> = ({ data, textSizeClass, pageNumber, bgColor }) => {
  const sz = { small: 12, medium: 13, large: 15 }[data.textSize] || 13;

  return (
    <div className="slide watermark-light" style={{ padding: '48px 64px', backgroundColor: bgColor || '#f5f0e8' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div className="gold-bar-vertical" style={{ height: 40 }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a5c', fontSize: 26, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Síntese dos Argumentos Disponíveis
        </h2>
        <div style={{ flex: 1, height: 1, background: 'rgba(26,58,92,0.1)', marginLeft: 16 }} />
      </div>

      <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(26,58,92,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0d2b45' }}>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#ffffff', fontSize: sz, letterSpacing: '0.05em' }}>Argumento</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#ffffff', fontSize: sz, letterSpacing: '0.05em' }}>Fundamento Legal</th>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#ffffff', fontSize: sz, letterSpacing: '0.05em' }}>Observação</th>
            </tr>
          </thead>
          <tbody>
            {data.argumentos.map((arg, i) => (
              <tr key={arg.id} style={{ background: i % 2 === 0 ? '#f5f0e8' : '#efe9dc', borderBottom: '1px solid rgba(26,58,92,0.06)' }}>
                <td style={{ padding: '12px 16px', fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz, fontWeight: 500 }}>{arg.argumento}</td>
                <td style={{ padding: '12px 16px', fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: sz }}>{arg.fundamento}</td>
                <td style={{ padding: '12px 16px', fontFamily: "'Lato', sans-serif", color: 'rgba(26,58,92,0.7)', fontSize: sz, fontStyle: 'italic' }}>{arg.observacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="page-num">{pageNumber}</div>
    </div>
  );
};

export default PageArgumentos;
