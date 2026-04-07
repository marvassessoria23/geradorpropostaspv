import React from "react";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
}

const PageDiagnostico: React.FC<Props> = ({ data, textSizeClass, pageNumber }) => {
  return (
    <div className="proposal-page geometric-bg">
      <div className="px-[6%] py-[4.5%] relative z-10 h-full flex flex-col">
        {/* Gold bar header */}
        <div className="proposal-gold-bar inline-block self-start mb-6 rounded-sm shadow-sm">
          <h2 className="font-display text-proposal-dark text-xl md:text-2xl font-bold uppercase tracking-wider">
            Contexto da Demanda
          </h2>
        </div>

        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-40 h-40 border-[5px] border-proposal-dark/10 rounded-full translate-x-14 -translate-y-10" />
        <div className="absolute top-10 right-10 w-24 h-24 border-[3px] border-proposal-gold/10 rounded-full" />

        <div className="flex-1 overflow-hidden space-y-3">
          <h3 className="font-bold text-proposal-dark text-lg md:text-xl font-body">{data.diagnosticoTitle}</h3>
          <p className={`${textSizeClass} text-proposal-text-dark font-body italic`}>{data.diagnosticoGreeting}</p>
          <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap text-justify`}>{data.diagnosticoIntro}</p>
          <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap text-justify`}>{data.diagnosticoBody}</p>
          <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap text-justify`}>{data.diagnosticoJurisprudencia}</p>
          <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap text-justify`}>{data.diagnosticoConclusao}</p>
        </div>

        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageDiagnostico;
