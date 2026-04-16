import React from "react";
import { ProposalData } from "./types";
import InlineEditable from "./InlineEditable";
import { CreditCard, DollarSign } from "lucide-react";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
  bgColor?: string;
  onChange?: (updates: Partial<ProposalData>) => void;
}

const v = (val: string | undefined | null) => val && val.trim() !== '';

const PageInvestimento: React.FC<Props> = ({ data, textSizeClass, pageNumber, bgColor, onChange }) => {
  const sz = { small: 12, medium: 13, large: 15 }[data.textSize] || 13;
  const up = onChange || (() => {});

  return (
    <div className="slide geometric-dark" data-slide style={{ padding: '48px 64px', backgroundColor: bgColor || '#0d2b45' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div className="gold-bar-vertical" style={{ height: 40 }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontSize: 28, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Investimento
        </h2>
        <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.2)' }} />
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ background: 'rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 20px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Lato', sans-serif", color: '#ffffff', fontWeight: 700, fontSize: 14, margin: 0 }}>Honorários Mínimos Antecipados</h3>
          </div>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CreditCard size={24} color="rgba(201,168,76,0.7)" />
            </div>
            <div style={{ marginBottom: 16 }}>
              {v(data.honorarioAntecipado1) && <InlineEditable value={data.honorarioAntecipado1} onChange={(v) => up({ honorarioAntecipado1: v })} style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontWeight: 700, fontSize: 28, display: 'block' }} />}
              {v(data.honorarioAntecipado1Desc) && <InlineEditable value={data.honorarioAntecipado1Desc} onChange={(v) => up({ honorarioAntecipado1Desc: v })} style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(255,255,255,0.6)', fontSize: sz, marginTop: 4, display: 'block' }} />}
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
            <div>
              {v(data.honorarioAntecipado2) && <InlineEditable value={data.honorarioAntecipado2} onChange={(v) => up({ honorarioAntecipado2: v })} style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontWeight: 700, fontSize: 28, display: 'block' }} />}
              {v(data.honorarioAntecipado2Desc) && <InlineEditable value={data.honorarioAntecipado2Desc} onChange={(v) => up({ honorarioAntecipado2Desc: v })} style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(255,255,255,0.6)', fontSize: sz, marginTop: 4, display: 'block' }} />}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ background: 'rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 20px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Lato', sans-serif", color: '#ffffff', fontWeight: 700, fontSize: 14, margin: 0 }}>Honorários de Êxito</h3>
          </div>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <DollarSign size={24} color="rgba(201,168,76,0.7)" />
            </div>
            {v(data.honorarioExito1) && <InlineEditable value={data.honorarioExito1} onChange={(v) => up({ honorarioExito1: v })} multiline style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(255,255,255,0.6)', fontSize: sz, lineHeight: 1.7, whiteSpace: 'pre-wrap', display: 'block' }} />}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
            {v(data.honorarioExito2) && <InlineEditable value={data.honorarioExito2} onChange={(v) => up({ honorarioExito2: v })} multiline style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(255,255,255,0.6)', fontSize: sz, lineHeight: 1.7, whiteSpace: 'pre-wrap', display: 'block' }} />}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        {v(data.parcelamento) && <InlineEditable value={data.parcelamento} onChange={(v) => up({ parcelamento: v })} style={{ fontFamily: "'Lato', sans-serif", color: '#ffffff', fontWeight: 600, fontSize: 14, marginBottom: 12, display: 'block' }} />}
        <div className="gold-line" style={{ width: '100%', marginBottom: 12 }} />
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 16 }}>
          {v(data.validadeProposta) && <InlineEditable value={data.validadeProposta} onChange={(v) => up({ validadeProposta: v })} multiline style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(255,255,255,0.7)', fontSize: sz, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap', display: 'block' }} />}
        </div>
      </div>

      <div className="page-num">{pageNumber}</div>
    </div>
  );
};

export default PageInvestimento;
