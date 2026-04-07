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
      <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
        <div className="proposal-gold-bar inline-block self-start mb-6">
          <h2 className="font-display text-proposal-dark text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Contexto da Demanda
          </h2>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 border-[6px] border-proposal-dark/15 rounded-full translate-x-12 -translate-y-8" />
        <div className="flex-1 overflow-hidden">
          <h3 className="font-bold text-proposal-dark text-xl md:text-2xl mb-3 font-body">{data.diagnosticoTitle}</h3>
          <p className={`${textSizeClass} text-proposal-text-dark mb-3 font-body`}>{data.diagnosticoGreeting}</p>
          <p className={`${textSizeClass} text-proposal-text-dark mb-4 font-body leading-relaxed whitespace-pre-wrap`}>{data.diagnosticoIntro}</p>
          <p className={`${textSizeClass} text-proposal-text-dark mb-4 font-body leading-relaxed whitespace-pre-wrap`}>{data.diagnosticoBody}</p>
          <p className={`${textSizeClass} text-proposal-text-dark mb-4 font-body leading-relaxed whitespace-pre-wrap`}>{data.diagnosticoJurisprudencia}</p>
          <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap`}>{data.diagnosticoConclusao}</p>
        </div>
        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageDiagnostico;
