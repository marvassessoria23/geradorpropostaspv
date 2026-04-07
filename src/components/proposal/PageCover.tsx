import React from "react";
import { ProposalData } from "./types";
import logoImg from "@/assets/logo-paiva-nunes.png";

interface Props {
  data: ProposalData;
  pageNumber: number;
}

const PageCover: React.FC<Props> = ({ data, pageNumber }) => {
  return (
    <div className="proposal-page-dark geometric-bg flex">
      <div className="flex-1 flex flex-col justify-center px-[6%] py-[5%] z-10">
        <div className="proposal-gold-line w-24 mb-6" />
        <h1 className="font-display text-proposal-gold text-5xl md:text-6xl font-bold uppercase tracking-wider leading-tight">
          Proposta de
          <br />
          <span className="text-proposal-text-light">Honorários</span>
        </h1>
        <div className="mt-8">
          <h2 className="text-proposal-text-light text-xl md:text-2xl font-body">
            {data.clientName}
          </h2>
        </div>
        <div className="mt-10 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src={logoImg} alt="Paiva Nunes" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <p className="font-display text-proposal-text-light text-lg tracking-widest uppercase">
              Paiva Nunes
            </p>
            <p className="text-proposal-gold text-sm tracking-wider">Direito Imobiliário</p>
          </div>
        </div>
        <div className="page-number">{pageNumber}</div>
      </div>
      <div className="hidden md:block w-[45%] bg-proposal-dark/30 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-proposal-dark/80" />
      </div>
    </div>
  );
};

export default PageCover;
