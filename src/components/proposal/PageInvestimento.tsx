import React from "react";
import { ProposalData } from "./types";
import { CreditCard, DollarSign } from "lucide-react";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
}

const PageInvestimento: React.FC<Props> = ({ data, textSizeClass, pageNumber }) => {
  return (
    <div className="proposal-page-dark geometric-bg">
      <div className="px-[6%] py-[4.5%] relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-10 bg-proposal-gold rounded-full" />
          <h2 className="font-display text-proposal-gold text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Investimento
          </h2>
          <div className="flex-1 h-px bg-proposal-gold/20" />
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-6">
          {/* Honorários Antecipados */}
          <div className="flex-1 border border-proposal-text-light/15 rounded-xl overflow-hidden">
            <div className="bg-proposal-gold/10 border-b border-proposal-text-light/10 px-5 py-3 text-center">
              <h3 className="text-proposal-text-light font-body font-bold text-sm">
                Honorários Mínimos Antecipados
              </h3>
            </div>
            <div className="p-5">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-proposal-gold/10 flex items-center justify-center">
                  <CreditCard size={28} className="text-proposal-gold/70" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-proposal-gold font-display font-bold text-2xl">{data.honorarioAntecipado1}</span>
                  <p className={`${textSizeClass} text-proposal-text-light/70 font-body mt-1`}>{data.honorarioAntecipado1Desc}</p>
                </div>
                <div className="h-px bg-proposal-text-light/10" />
                <div className="text-center">
                  <span className="text-proposal-gold font-display font-bold text-2xl">{data.honorarioAntecipado2}</span>
                  <p className={`${textSizeClass} text-proposal-text-light/70 font-body mt-1`}>{data.honorarioAntecipado2Desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Honorários de Êxito */}
          <div className="flex-1 border border-proposal-text-light/15 rounded-xl overflow-hidden">
            <div className="bg-proposal-gold/10 border-b border-proposal-text-light/10 px-5 py-3 text-center">
              <h3 className="text-proposal-text-light font-body font-bold text-sm">
                Honorários de Êxito
              </h3>
            </div>
            <div className="p-5">
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-proposal-gold/10 flex items-center justify-center">
                  <DollarSign size={28} className="text-proposal-gold/70" />
                </div>
              </div>
              <div className="space-y-4">
                <p className={`${textSizeClass} text-proposal-text-light/70 font-body whitespace-pre-wrap text-center`}>{data.honorarioExito1}</p>
                <div className="h-px bg-proposal-text-light/10" />
                <p className={`${textSizeClass} text-proposal-text-light/70 font-body whitespace-pre-wrap text-center`}>{data.honorarioExito2}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center space-y-3">
          <p className="text-proposal-text-light font-body font-semibold">{data.parcelamento}</p>
          <div className="proposal-gold-line w-full" />
          <div className="bg-proposal-cream/5 border border-proposal-text-light/10 rounded-lg p-4">
            <p className={`${textSizeClass} text-proposal-text-light/80 font-body whitespace-pre-wrap`}>{data.validadeProposta}</p>
          </div>
        </div>

        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageInvestimento;
