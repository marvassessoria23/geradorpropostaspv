import React from "react";
import EditableText from "./EditableText";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
  textSizeClass: string;
}

const PageEstrategia: React.FC<Props> = ({ data, onChange, textSizeClass }) => {
  return (
    <>
      {/* Page 3 - Estratégia intro + Movimento 1 */}
      <div data-proposal-page>
        <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="flex items-start gap-2 mb-4">
                <div className="w-1 h-12 bg-proposal-gold mt-1" />
                <h2 className="font-display text-proposal-dark text-2xl md:text-3xl font-bold uppercase tracking-wider">
                  Proposta de Atuação
                </h2>
              </div>

              <h3 className="font-bold text-proposal-dark text-xl mb-3 font-body">
                2. ESTRATÉGIA JURÍDICA PROPOSTA
              </h3>

              <EditableText
                value={data.estrategiaIntro}
                onChange={(v) => onChange({ estrategiaIntro: v })}
                className={`${textSizeClass} text-proposal-text-dark mb-5 font-body leading-relaxed`}
                multiline
              />

              <EditableText
                value={data.movimento1Title}
                onChange={(v) => onChange({ movimento1Title: v })}
                className="font-bold text-proposal-dark text-lg mb-2 font-body"
                tag="h3"
              />

              <div className="flex items-start gap-2 mb-3">
                <span className="text-proposal-dark mt-1">•</span>
                <EditableText
                  value={data.movimento1Intro}
                  onChange={(v) => onChange({ movimento1Intro: v })}
                  className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}
                  multiline
                />
              </div>

              <div className="ml-4 space-y-3">
                <div>
                  <span className="font-semibold text-proposal-dark">1.</span>
                  <EditableText
                    value={data.movimento1Item1}
                    onChange={(v) => onChange({ movimento1Item1: v })}
                    className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed inline`}
                    tag="span"
                    multiline
                  />
                </div>
                <div>
                  <span className="font-semibold text-proposal-dark">2.</span>
                  <EditableText
                    value={data.movimento1Item2}
                    onChange={(v) => onChange({ movimento1Item2: v })}
                    className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed inline`}
                    tag="span"
                    multiline
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="page-number">3</div>
        </div>
      </div>

      {/* Page 4 - Movimento 1 cont + Resultado */}
      <div data-proposal-page>
      <div className="proposal-page geometric-bg">
          <div className="flex-1">
            <div className="ml-4 mb-6">
              <span className="font-semibold text-proposal-dark">3.</span>
              <EditableText
                value={data.movimento1Item3}
                onChange={(v) => onChange({ movimento1Item3: v })}
                className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed inline`}
                tag="span"
                multiline
              />
            </div>

            <EditableText
              value={data.movimento1Resultado}
              onChange={(v) => onChange({ movimento1Resultado: v })}
              className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}
              multiline
            />
          </div>
          <div className="page-number">4</div>
        </div>
      </div>

      {/* Page 5 - Movimento 2 */}
      <div className="proposal-page geometric-bg">
        <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
          <div className="flex-1">
            <EditableText
              value={data.movimento2Title}
              onChange={(v) => onChange({ movimento2Title: v })}
              className="font-bold text-proposal-dark text-xl mb-6 font-body"
              tag="h3"
            />

            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-proposal-dark text-lg mb-1 font-body">Consignação em Pagamento:</h4>
                <EditableText
                  value={data.movimento2Consignacao}
                  onChange={(v) => onChange({ movimento2Consignacao: v })}
                  className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}
                  multiline
                />
              </div>
              <div>
                <h4 className="font-bold text-proposal-dark text-lg mb-1 font-body">Obrigação de Fazer:</h4>
                <EditableText
                  value={data.movimento2Obrigacao}
                  onChange={(v) => onChange({ movimento2Obrigacao: v })}
                  className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}
                  multiline
                />
              </div>
              <div>
                <h4 className="font-bold text-proposal-dark text-lg mb-1 font-body">Pedidos Acessórios:</h4>
                <EditableText
                  value={data.movimento2Pedidos}
                  onChange={(v) => onChange({ movimento2Pedidos: v })}
                  className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}
                  multiline
                />
              </div>
              <div>
                <h4 className="font-bold text-proposal-dark text-lg mb-1 font-body">Observações:</h4>
                <EditableText
                  value={data.movimento2Observacoes}
                  onChange={(v) => onChange({ movimento2Observacoes: v })}
                  className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}
                  multiline
                />
              </div>
            </div>
          </div>
          <div className="page-number">5</div>
        </div>
      </div>

      {/* Page 6 - Movimento 3 */}
      <div className="proposal-page geometric-bg">
        <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
          <div className="flex-1">
            <EditableText
              value={data.movimento3Title}
              onChange={(v) => onChange({ movimento3Title: v })}
              className="font-bold text-proposal-dark text-xl mb-4 font-body"
              tag="h3"
            />
            <EditableText
              value={data.movimento3Body}
              onChange={(v) => onChange({ movimento3Body: v })}
              className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}
              multiline
            />
          </div>
          <div className="page-number">6</div>
        </div>
      </div>
    </>
  );
};

export default PageEstrategia;
