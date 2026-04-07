import React from "react";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
}

const PageSobre: React.FC<Props> = ({ data, textSizeClass, pageNumber }) => {
  return (
    <div className="proposal-page geometric-bg">
      <div className="px-[6%] py-[4.5%] relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-10 bg-proposal-gold rounded-full" />
          <h2 className="font-display text-proposal-dark text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Sobre a Paiva Nunes
          </h2>
          <div className="flex-1 h-px bg-proposal-dark/10 ml-4" />
        </div>

        <div className="flex-1 space-y-4">
          <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed text-justify whitespace-pre-wrap`}>{data.sobreText1}</p>
          <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed text-justify whitespace-pre-wrap`}>{data.sobreText2}</p>
          <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed text-justify whitespace-pre-wrap`}>{data.sobreText3}</p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="border-2 border-proposal-gold rounded-full px-8 py-3 bg-proposal-dark flex items-center gap-3 shadow-lg">
            <span className="text-proposal-gold text-base">👆</span>
            <span className="text-proposal-text-light font-body font-medium text-sm tracking-wide">Conheça nossas redes sociais</span>
          </div>
        </div>

        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageSobre;
