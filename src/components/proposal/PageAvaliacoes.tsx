import React from "react";
import { ProposalData } from "./types";
import { Star } from "lucide-react";

interface Props {
  data: ProposalData;
  pageNumber: number;
  bgColor?: string;
}

const PageAvaliacoes: React.FC<Props> = ({ data, pageNumber, bgColor }) => {
  return (
    <div className="slide" data-slide style={{ padding: '48px 64px', backgroundColor: bgColor || '#e8c96a' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#0d2b45', fontSize: 30, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0' }}>
          O que nossos clientes dizem
        </h2>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#ffffff', borderRadius: 12, padding: '12px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={20} fill={i <= Math.round(data.notaGoogle) ? '#f59e0b' : '#d1d5db'} color={i <= Math.round(data.notaGoogle) ? '#f59e0b' : '#d1d5db'} />
            ))}
          </div>
          <span style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: 24, color: '#0d2b45' }}>{data.notaGoogle}</span>
          <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: 'rgba(13,43,69,0.6)' }}>({data.totalAvaliacoes} avaliações)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(data.avaliacoes.length, 2)}, 1fr)`, gap: 20 }}>
        {data.avaliacoes.map((av) => (
          <div key={av.id} style={{ background: '#ffffff', borderRadius: 12, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0d2b45', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontWeight: 700, fontSize: 16, fontFamily: "'Lato', sans-serif" }}>
                {av.nome.charAt(0)}
              </div>
              <div>
                <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: '#0d2b45', fontSize: 14, margin: 0 }}>{av.nome}</p>
                <div style={{ display: 'flex', gap: 1 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={12} fill={i <= av.nota ? '#f59e0b' : '#d1d5db'} color={i <= av.nota ? '#f59e0b' : '#d1d5db'} />
                  ))}
                </div>
              </div>
            </div>
            <p style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              "{av.texto}"
            </p>
          </div>
        ))}
      </div>

      <div className="page-num">{pageNumber}</div>
    </div>
  );
};

export default PageAvaliacoes;
