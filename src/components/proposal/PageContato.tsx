import React from "react";
import { ProposalData } from "./types";
import { Phone, Instagram, Globe, Youtube, Linkedin } from "lucide-react";
import logoImg from "@/assets/logo-paiva-nunes.png";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
  bgColor?: string;
}

const PageContato: React.FC<Props> = ({ data, textSizeClass, pageNumber, bgColor }) => {
  const logo = data.logoImage || logoImg;
  const logoW = Math.max((data.logoSize || 120) * 0.8, 48);
  const sz = { small: 12, medium: 13, large: 15 }[data.textSize] || 13;

  const contactItems = [
    { icon: Phone, value: data.telefone },
    { icon: Instagram, value: data.instagram1 },
    { icon: Instagram, value: data.instagram2 },
    ...(data.youtube ? [{ icon: Youtube, value: data.youtube }] : []),
    ...(data.linkedin ? [{ icon: Linkedin, value: data.linkedin }] : []),
    { icon: Globe, value: data.website },
  ].filter(item => item.value);

  return (
    <div className="slide watermark-light" style={{ display: 'flex', padding: 0, backgroundColor: bgColor || '#f5f0e8' }}>
      {data.fotoContato && (
        <div style={{ width: '35%', position: 'relative', overflow: 'hidden' }}>
          <img src={data.fotoContato} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to left, ${bgColor || '#f5f0e8'} 0%, rgba(245,240,232,0.5) 30%, transparent 100%)` }} />
        </div>
      )}

      <div style={{ flex: 1, padding: '48px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
        <img src={logo} alt={data.nomeEscritorio} style={{ width: logoW, height: 'auto', marginBottom: 16 }} />

        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontSize: 32, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>
          {data.nomeEscritorio}
        </h2>
        <p style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(26,58,92,0.5)', letterSpacing: '0.15em', fontSize: 13, textTransform: 'uppercase', marginBottom: 24 }}>
          {data.subtituloEscritorio}
        </p>

        <div className="gold-line" style={{ width: 48, marginBottom: 24 }} />

        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 28 }}>
          Contato
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {contactItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={13} color="#c9a84c" />
              </div>
              <span style={{ fontFamily: "'Lato', sans-serif", color: '#1a3a5c', fontSize: 14 }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 400 }}>
          <p style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(26,58,92,0.6)', fontSize: sz, lineHeight: 1.7, marginBottom: 20, whiteSpace: 'pre-wrap' }}>
            {data.contatoTexto}
          </p>
          <div className="gold-line" style={{ width: 64, margin: '0 auto 16px' }} />
          <p style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontSize: 18, fontWeight: 700, fontStyle: 'italic' }}>
            {data.contatoSlogan}
          </p>
        </div>

        <div className="page-num">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageContato;
