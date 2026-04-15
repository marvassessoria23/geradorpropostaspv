import React from "react";
import { ProposalData } from "./types";
import logoImg from "@/assets/logo-paiva-nunes.png";

interface Props {
  data: ProposalData;
  pageNumber: number;
  bgColor?: string;
}

const PageCover: React.FC<Props> = ({ data, pageNumber, bgColor }) => {
  const logo = data.logoImage || logoImg;
  const logoW = data.logoSize || 140;
  const coverPhotoPosition = data.coverPhotoPosition ?? 15;

  return (
    <div className="slide geometric-dark" data-slide style={{ display: 'flex', padding: 0, backgroundColor: bgColor || '#0d2b45', overflow: 'hidden' }}>
      {/* Left content */}
      <div style={{ flex: 1, padding: '48px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10, position: 'relative', border: 'none', outline: 'none' }}>
        <div />

        <div>
          <div className="gold-line" style={{ width: 80, marginBottom: 32 }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontSize: 52, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.15, margin: 0 }}>
            Proposta de
          </h1>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: 52, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.15, margin: '4px 0 0 0' }}>
            Honorários
          </h1>
          <div className="gold-line" style={{ width: 160, margin: '32px 0' }} />
          <h2 style={{ fontFamily: "'Lato', sans-serif", color: '#ffffff', fontSize: 24, fontWeight: 300, letterSpacing: '0.05em', margin: 0 }}>
            {data.clientName}
          </h2>
        </div>

        <div>
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: 18, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
              {data.nomeEscritorio}
            </p>
            <p style={{ fontFamily: "'Lato', sans-serif", color: '#c9a84c', fontSize: 13, letterSpacing: '0.1em', margin: 0 }}>
              {data.subtituloEscritorio}
            </p>
          </div>
          <img src={logo} alt={data.nomeEscritorio} style={{ width: logoW, height: 'auto', objectFit: 'contain' }} />
        </div>
      </div>

      {/* Right side - image */}
      <div style={{ width: '42%', position: 'relative', overflow: 'hidden' }}>
        {data.coverImage ? (
          <>
            <img
              src={data.coverImage}
              alt=""
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: `center ${coverPhotoPosition}%`,
              }}
            />
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: -2, right: 0, background: `linear-gradient(to right, ${bgColor || '#0d2b45'} 0%, rgba(13,43,69,0.6) 35%, transparent 100%)`, zIndex: 1 }} />
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13,43,69,0.8), rgba(13,43,69,0.3), rgba(201,168,76,0.1))' }}>
            <div style={{ position: 'absolute', top: '15%', right: '10%', width: 130, height: 130, border: '1px solid rgba(201,168,76,0.15)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 190, height: 190, border: '1px solid rgba(201,168,76,0.1)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: '40%', right: '5%', width: 80, height: 80, border: '1px solid rgba(201,168,76,0.2)', transform: 'rotate(45deg)' }} />
          </div>
        )}
      </div>

      <div className="page-num">{pageNumber}</div>
    </div>
  );
};

export default PageCover;
