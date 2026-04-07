import React from "react";
import EditableText from "./EditableText";
import { ProposalData } from "./types";
import { CreditCard, DollarSign } from "lucide-react";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
  textSizeClass: string;
}

const PageInvestimento: React.FC<Props> = ({ data, onChange, textSizeClass }) => {
  return (
    <div className="proposal-page-dark geometric-bg">
      <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display text-proposal-gold text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Investimento
          </h2>
          <div className="flex-1 h-px bg-proposal-gold/30" />
        </div>

        <div className="flex-1 flex flex-col md:flex-row gap-8">
          {/* Honorários Antecipados */}
          <div className="flex-1 border border-proposal-text-light/20 rounded-lg p-6">
            <div className="bg-proposal-dark border border-proposal-text-light/20 rounded-t-lg px-4 py-3 -mt-6 -mx-6 mb-6 text-center">
              <h3 className="text-proposal-text-light font-body font-bold">Honorários Mínimos<br />Antecipados</h3>
            </div>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-proposal-text-light/10 flex items-center justify-center">
                <CreditCard size={36} className="text-proposal-text-light/70" />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <EditableText
                  value={data.honorarioAntecipado1}
                  onChange={(v) => onChange({ honorarioAntecipado1: v })}
                  className="text-proposal-text-light font-body font-bold text-lg"
                  tag="span"
                />
                <EditableText
                  value={data.honorarioAntecipado1Desc}
                  onChange={(v) => onChange({ honorarioAntecipado1Desc: v })}
                  className={`${textSizeClass} text-proposal-text-light/80 font-body`}
                />
              </div>
              <div>
                <EditableText
                  value={data.honorarioAntecipado2}
                  onChange={(v) => onChange({ honorarioAntecipado2: v })}
                  className="text-proposal-text-light font-body font-bold text-lg"
                  tag="span"
                />
                <EditableText
                  value={data.honorarioAntecipado2Desc}
                  onChange={(v) => onChange({ honorarioAntecipado2Desc: v })}
                  className={`${textSizeClass} text-proposal-text-light/80 font-body`}
                />
              </div>
            </div>
          </div>

          {/* Honorários de Êxito */}
          <div className="flex-1 border border-proposal-text-light/20 rounded-lg p-6">
            <div className="bg-proposal-dark border border-proposal-text-light/20 rounded-t-lg px-4 py-3 -mt-6 -mx-6 mb-6 text-center">
              <h3 className="text-proposal-text-light font-body font-bold">Honorários<br />de Êxito</h3>
            </div>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-proposal-text-light/10 flex items-center justify-center">
                <DollarSign size={36} className="text-proposal-text-light/70" />
              </div>
            </div>
            <div className="space-y-3">
              <EditableText
                value={data.honorarioExito1}
                onChange={(v) => onChange({ honorarioExito1: v })}
                className={`${textSizeClass} text-proposal-text-light/80 font-body`}
                multiline
              />
              <EditableText
                value={data.honorarioExito2}
                onChange={(v) => onChange({ honorarioExito2: v })}
                className={`${textSizeClass} text-proposal-text-light/80 font-body`}
                multiline
              />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <EditableText
            value={data.parcelamento}
            onChange={(v) => onChange({ parcelamento: v })}
            className="text-proposal-text-light font-body font-bold text-lg"
          />
          <div className="proposal-gold-line w-full mt-2 mb-4" />
          <div className="bg-proposal-cream/10 p-4 rounded">
            <EditableText
              value={data.validadeProposta}
              onChange={(v) => onChange({ validadeProposta: v })}
              className={`${textSizeClass} text-proposal-text-light font-body`}
              multiline
            />
          </div>
        </div>

        <div className="page-number">10</div>
      </div>
    </div>
  );
};

export default PageInvestimento;
