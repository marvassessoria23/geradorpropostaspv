import React from "react";
import { ProposalData } from "./types";
import { Phone, Instagram, Globe } from "lucide-react";
import logoImg from "@/assets/logo-paiva-nunes.png";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
}

const PageContato: React.FC<Props> = ({ data, textSizeClass, pageNumber }) => {
  const logoSizePx = Math.max(data.logoSize * 0.8, 48);

  return (
    <div className="proposal-page-dark geometric-bg flex">
      {/* Optional side image */}
      {data.contatoImage && (
        <div className="hidden md:block w-[35%] relative">
          <img src={data.contatoImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-proposal-dark via-proposal-dark/60 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className={`${data.contatoImage ? 'flex-1' : 'w-full'} px-[6%] py-[5%] relative z-10 flex flex-col items-center justify-center text-center`}>
        <img src={logoImg} alt="Paiva Nunes" style={{ width: logoSizePx, height: logoSizePx }} className="object-contain mb-4" />

        <h2 className="font-display text-proposal-gold text-3xl md:text-4xl font-bold tracking-wider mb-1">
          Paiva Nunes
        </h2>
        <p className="text-proposal-text-light/60 font-body tracking-widest text-sm uppercase mb-6">Direito Imobiliário</p>

        <div className="proposal-gold-line w-12 mb-6" />

        <h3 className="font-display text-proposal-gold text-lg uppercase tracking-[0.3em] mb-8">Contato</h3>

        <div className="space-y-3 mb-8">
          {[
            { icon: Phone, value: data.telefone },
            { icon: Instagram, value: data.instagram1 },
            { icon: Instagram, value: data.instagram2 },
            { icon: Globe, value: data.website },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 justify-center">
              <div className="w-7 h-7 rounded-full bg-proposal-gold/10 flex items-center justify-center">
                <item.icon size={13} className="text-proposal-gold" />
              </div>
              <span className="text-proposal-text-light font-body text-sm">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="max-w-md">
          <p className={`${textSizeClass} text-proposal-text-light/70 font-body leading-relaxed mb-6 whitespace-pre-wrap`}>
            {data.contatoTexto}
          </p>
          <div className="proposal-gold-line w-16 mx-auto mb-4" />
          <p className="text-proposal-gold font-display text-lg font-bold italic">{data.contatoSlogan}</p>
        </div>

        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageContato;
