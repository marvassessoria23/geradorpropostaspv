import React from "react";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  startPageNumber: number;
}

const PageEstrategia: React.FC<Props> = ({ data, textSizeClass, startPageNumber }) => {
  let pn = startPageNumber;

  return (
    <>
      {/* Page - Intro + Movimento 1 part 1 */}
      <div data-proposal-page>
        <div className="proposal-page geometric-bg">
          <div className="px-[6%] py-[4.5%] relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-12 bg-proposal-gold rounded-full" />
              <h2 className="font-display text-proposal-dark text-2xl md:text-3xl font-bold uppercase tracking-wider">
                Proposta de Atuação
              </h2>
              <div className="flex-1 h-px bg-proposal-dark/10 ml-4" />
            </div>

            <h3 className="font-bold text-proposal-dark text-lg md:text-xl mb-3 font-body">
              2. ESTRATÉGIA JURÍDICA PROPOSTA
            </h3>
            <p className={`${textSizeClass} text-proposal-text-dark mb-5 font-body leading-relaxed whitespace-pre-wrap text-justify`}>{data.estrategiaIntro}</p>

            <div className="bg-proposal-dark/5 rounded-lg p-4 mb-3">
              <h3 className="font-bold text-proposal-dark text-base md:text-lg mb-2 font-body">{data.movimento1Title}</h3>
            </div>

            <div className="flex items-start gap-2 mb-3 pl-2">
              <span className="text-proposal-gold mt-0.5 text-lg">•</span>
              <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap text-justify`}>{data.movimento1Intro}</p>
            </div>

            <div className="ml-6 space-y-3">
              <div className="flex gap-2">
                <span className="font-bold text-proposal-gold text-sm mt-0.5 flex-shrink-0">1.</span>
                <span className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed text-justify`}>{data.movimento1Item1}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-proposal-gold text-sm mt-0.5 flex-shrink-0">2.</span>
                <span className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed text-justify`}>{data.movimento1Item2}</span>
              </div>
            </div>

            <div className="page-number">{pn}</div>
          </div>
        </div>
      </div>

      {/* Page - Movimento 1 part 2 */}
      <div data-proposal-page>
        <div className="proposal-page geometric-bg">
          <div className="px-[6%] py-[4.5%] relative z-10 h-full flex flex-col">
            <div className="ml-6 mb-6">
              <div className="flex gap-2">
                <span className="font-bold text-proposal-gold text-sm mt-0.5 flex-shrink-0">3.</span>
                <span className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed text-justify`}>{data.movimento1Item3}</span>
              </div>
            </div>

            <div className="bg-proposal-gold/10 border-l-4 border-proposal-gold rounded-r-lg p-4 mt-4">
              <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap text-justify`}>{data.movimento1Resultado}</p>
            </div>

            <div className="page-number">{pn + 1}</div>
          </div>
        </div>
      </div>

      {/* Page - Movimento 2 */}
      <div data-proposal-page>
        <div className="proposal-page geometric-bg">
          <div className="px-[6%] py-[4.5%] relative z-10 h-full flex flex-col">
            <div className="bg-proposal-dark/5 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-proposal-dark text-base md:text-lg font-body">{data.movimento2Title}</h3>
            </div>

            <div className="space-y-5 flex-1">
              {[
                { label: "Consignação em Pagamento", value: data.movimento2Consignacao },
                { label: "Obrigação de Fazer", value: data.movimento2Obrigacao },
                { label: "Pedidos Acessórios", value: data.movimento2Pedidos },
                { label: "Observações", value: data.movimento2Observacoes },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1 bg-proposal-gold/40 rounded-full flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-proposal-dark text-sm md:text-base mb-1 font-body">{item.label}:</h4>
                    <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap text-justify`}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="page-number">{pn + 2}</div>
          </div>
        </div>
      </div>

      {/* Page - Movimento 3 */}
      <div data-proposal-page>
        <div className="proposal-page geometric-bg">
          <div className="px-[6%] py-[4.5%] relative z-10 h-full flex flex-col">
            <div className="bg-proposal-dark/5 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-proposal-dark text-base md:text-lg font-body">{data.movimento3Title}</h3>
            </div>

            <div className="flex gap-3">
              <div className="w-1 bg-proposal-gold/40 rounded-full flex-shrink-0 mt-1" />
              <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap text-justify`}>{data.movimento3Body}</p>
            </div>

            <div className="page-number">{pn + 3}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageEstrategia;
