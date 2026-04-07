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
          <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
            <div className="flex items-start gap-2 mb-4">
              <div className="w-1 h-12 bg-proposal-gold mt-1" />
              <h2 className="font-display text-proposal-dark text-2xl md:text-3xl font-bold uppercase tracking-wider">
                Proposta de Atuação
              </h2>
            </div>
            <h3 className="font-bold text-proposal-dark text-xl mb-3 font-body">
              2. ESTRATÉGIA JURÍDICA PROPOSTA
            </h3>
            <p className={`${textSizeClass} text-proposal-text-dark mb-5 font-body leading-relaxed whitespace-pre-wrap`}>{data.estrategiaIntro}</p>
            <h3 className="font-bold text-proposal-dark text-lg mb-2 font-body">{data.movimento1Title}</h3>
            <div className="flex items-start gap-2 mb-3">
              <span className="text-proposal-dark mt-1">•</span>
              <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap`}>{data.movimento1Intro}</p>
            </div>
            <div className="ml-4 space-y-3">
              <div><span className="font-semibold text-proposal-dark">1. </span><span className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}>{data.movimento1Item1}</span></div>
              <div><span className="font-semibold text-proposal-dark">2. </span><span className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}>{data.movimento1Item2}</span></div>
            </div>
            <div className="page-number">{pn}</div>
          </div>
        </div>
      </div>

      {/* Page - Movimento 1 part 2 */}
      <div data-proposal-page>
        <div className="proposal-page geometric-bg">
          <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
            <div className="ml-4 mb-6">
              <span className="font-semibold text-proposal-dark">3. </span>
              <span className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}>{data.movimento1Item3}</span>
            </div>
            <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap`}>{data.movimento1Resultado}</p>
            <div className="page-number">{pn + 1}</div>
          </div>
        </div>
      </div>

      {/* Page - Movimento 2 */}
      <div data-proposal-page>
        <div className="proposal-page geometric-bg">
          <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
            <h3 className="font-bold text-proposal-dark text-xl mb-6 font-body">{data.movimento2Title}</h3>
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-proposal-dark text-lg mb-1 font-body">Consignação em Pagamento:</h4>
                <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap`}>{data.movimento2Consignacao}</p>
              </div>
              <div>
                <h4 className="font-bold text-proposal-dark text-lg mb-1 font-body">Obrigação de Fazer:</h4>
                <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap`}>{data.movimento2Obrigacao}</p>
              </div>
              <div>
                <h4 className="font-bold text-proposal-dark text-lg mb-1 font-body">Pedidos Acessórios:</h4>
                <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap`}>{data.movimento2Pedidos}</p>
              </div>
              <div>
                <h4 className="font-bold text-proposal-dark text-lg mb-1 font-body">Observações:</h4>
                <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap`}>{data.movimento2Observacoes}</p>
              </div>
            </div>
            <div className="page-number">{pn + 2}</div>
          </div>
        </div>
      </div>

      {/* Page - Movimento 3 */}
      <div data-proposal-page>
        <div className="proposal-page geometric-bg">
          <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
            <h3 className="font-bold text-proposal-dark text-xl mb-4 font-body">{data.movimento3Title}</h3>
            <p className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed whitespace-pre-wrap`}>{data.movimento3Body}</p>
            <div className="page-number">{pn + 3}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageEstrategia;
