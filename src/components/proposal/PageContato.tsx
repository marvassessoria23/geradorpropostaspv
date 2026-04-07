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
  return (
    <div className="proposal-page-dark geometric-bg">
      <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col items-center justify-center text-center">
        <div className="mb-4">
          <img src={logoImg} alt="Paiva Nunes" className="w-14 h-14 object-contain mx-auto mb-2" />
        </div>
        <div className="mb-6">
          <h2 className="font-display text-proposal-gold text-3xl md:text-4xl font-bold tracking-wider">
            Paiva Nunes
          </h2>
          <p className="text-proposal-text-light/70 font-body tracking-wider">Direito Imobiliário</p>
        </div>

        <div className="proposal-gold-line w-16 mb-6" />

        <h3 className="font-display text-proposal-gold text-xl uppercase tracking-widest mb-8">Contato</h3>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 justify-center">
            <Phone size={16} className="text-proposal-gold" />
            <span className="text-proposal-text-light font-body">{data.telefone}</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Instagram size={16} className="text-proposal-gold" />
            <span className="text-proposal-text-light font-body">{data.instagram1}</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Instagram size={16} className="text-proposal-gold" />
            <span className="text-proposal-text-light font-body">{data.instagram2}</span>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Globe size={16} className="text-proposal-gold" />
            <span className="text-proposal-text-light font-body">{data.website}</span>
          </div>
        </div>

        <div className="max-w-lg">
          <p className={`${textSizeClass} text-proposal-text-light/80 font-body leading-relaxed mb-6 whitespace-pre-wrap`}>{data.contatoTexto}</p>
          <p className="text-proposal-gold font-display text-xl font-bold italic">{data.contatoSlogan}</p>
        </div>

        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageContato;
