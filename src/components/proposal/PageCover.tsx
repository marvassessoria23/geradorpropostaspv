import React from "react";
import { ProposalData } from "./types";
import logoImg from "@/assets/logo-paiva-nunes.png";

interface Props {
  data: ProposalData;
  pageNumber: number;
}

const PageCover: React.FC<Props> = ({ data, pageNumber }) => {
  const logoSizePx = data.logoSize || 80;

  return (
    <div className="proposal-page-dark geometric-bg flex">
      {/* Left content */}
      <div className="flex-1 flex flex-col justify-between px-[7%] py-[6%] z-10">
        {/* Top spacer for logo position */}
        {data.logoPosition === "top" && (
          <div className="flex items-center gap-4 mb-8">
            <img src={logoImg} alt="Paiva Nunes" style={{ width: logoSizePx, height: logoSizePx }} className="object-contain" />
            <div>
              <p className="font-display text-proposal-text-light text-lg tracking-widest uppercase">Paiva Nunes</p>
              <p className="text-proposal-gold text-sm tracking-wider font-body">Direito Imobiliário</p>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          <div className="proposal-gold-line w-20 mb-8" />

          <h1 className="font-display text-proposal-gold text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-[1.15]">
            Proposta de
          </h1>
          <h1 className="font-display text-proposal-text-light text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-[1.15] mt-1">
            Honorários
          </h1>

          <div className="proposal-gold-line w-40 mt-8 mb-8" />

          <h2 className="text-proposal-text-light text-xl md:text-2xl font-body font-light tracking-wide">
            {data.clientName}
          </h2>

          {/* Advogado photo */}
          {data.advogadoPhoto && (
            <div className="mt-6 flex items-center gap-4">
              <img src={data.advogadoPhoto} alt="Advogado" className="w-14 h-14 rounded-full object-cover border-2 border-proposal-gold/40" />
            </div>
          )}
        </div>

        {/* Bottom logo */}
        {data.logoPosition !== "top" && (
          <div className={`flex items-center gap-4 ${data.logoPosition === "center" ? "self-center" : ""}`}>
            <img src={logoImg} alt="Paiva Nunes" style={{ width: logoSizePx, height: logoSizePx }} className="object-contain" />
            <div>
              <p className="font-display text-proposal-text-light text-lg tracking-widest uppercase">Paiva Nunes</p>
              <p className="text-proposal-gold text-sm tracking-wider font-body">Direito Imobiliário</p>
            </div>
          </div>
        )}

        <div className="page-number">{pageNumber}</div>
      </div>

      {/* Right side - image area */}
      <div className="hidden md:block w-[42%] relative">
        {data.coverImage ? (
          <>
            <img src={data.coverImage} alt="Capa" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-proposal-dark via-proposal-dark/60 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-proposal-dark/80 via-proposal-dark/40 to-proposal-gold/10" />
            {/* Decorative elements */}
            <div className="absolute top-[15%] right-[10%] w-32 h-32 border border-proposal-gold/15 rounded-full" />
            <div className="absolute bottom-[20%] right-[20%] w-48 h-48 border border-proposal-gold/10 rounded-full" />
            <div className="absolute top-[40%] right-[5%] w-20 h-20 border border-proposal-gold/20" style={{ transform: 'rotate(45deg)' }} />
          </>
        )}
      </div>
    </div>
  );
};

export default PageCover;
