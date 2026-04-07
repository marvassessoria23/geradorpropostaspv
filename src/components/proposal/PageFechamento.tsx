import React from "react";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
}

const PageFechamento: React.FC<Props> = ({ data, textSizeClass, pageNumber }) => {
  return (
    <div className="proposal-page-dark geometric-bg flex">
      {/* Content */}
      <div className={`${data.fechamentoImage ? 'flex-1' : 'w-full'} px-[6%] py-[5%] relative z-10 flex flex-col`}>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-10 bg-proposal-gold rounded-full" />
          <h2 className="font-display text-proposal-gold text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Próximos Passos
          </h2>
          <div className="flex-1 h-px bg-proposal-gold/15 ml-4" />
        </div>

        <div className="flex-1">
          <div className="relative pl-10">
            <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-proposal-gold/60 via-proposal-gold/30 to-transparent" />
            {data.fechamentoSteps.map((step, i) => (
              <div key={i} className="relative mb-8 last:mb-4">
                <div className="absolute left-[-26px] top-0.5 w-5 h-5 rounded-full bg-proposal-gold flex items-center justify-center shadow-md">
                  <span className="text-proposal-dark text-[9px] font-bold">{i + 1}</span>
                </div>
                <p className={`${textSizeClass} text-proposal-text-light font-body leading-relaxed`}>{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-proposal-gold/20 pt-6">
            <p className="text-proposal-gold font-display text-lg md:text-xl leading-relaxed italic whitespace-pre-wrap">
              {data.fechamentoCTA}
            </p>
          </div>
        </div>

        <div className="page-number">{pageNumber}</div>
      </div>

      {/* Optional side image */}
      {data.fechamentoImage && (
        <div className="hidden md:block w-[35%] relative">
          <img src={data.fechamentoImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-proposal-dark via-proposal-dark/50 to-transparent" />
        </div>
      )}
    </div>
  );
};

export default PageFechamento;
