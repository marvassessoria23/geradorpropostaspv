import React from "react";
import EditableText from "./EditableText";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
  textSizeClass: string;
}

const PageDiagnostico: React.FC<Props> = ({ data, onChange, textSizeClass }) => {
  return (
    <div className="proposal-page geometric-bg">
      <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
        {/* Header banner */}
        <div className="proposal-gold-bar inline-block self-start mb-6">
          <h2 className="font-display text-proposal-dark text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Contexto da Demanda
          </h2>
        </div>

        {/* Decorative circle top-right */}
        <div className="absolute top-0 right-0 w-40 h-40 border-[6px] border-proposal-dark/15 rounded-full translate-x-12 -translate-y-8" />

        <div className="flex-1 overflow-hidden">
          <EditableText
            value={data.diagnosticoTitle}
            onChange={(v) => onChange({ diagnosticoTitle: v })}
            className={`font-bold text-proposal-dark text-xl md:text-2xl mb-3 font-body`}
            tag="h3"
          />
          <EditableText
            value={data.diagnosticoGreeting}
            onChange={(v) => onChange({ diagnosticoGreeting: v })}
            className={`${textSizeClass} text-proposal-text-dark mb-3 font-body`}
          />
          <EditableText
            value={data.diagnosticoIntro}
            onChange={(v) => onChange({ diagnosticoIntro: v })}
            className={`${textSizeClass} text-proposal-text-dark mb-4 font-body leading-relaxed`}
            multiline
          />
          <EditableText
            value={data.diagnosticoBody}
            onChange={(v) => onChange({ diagnosticoBody: v })}
            className={`${textSizeClass} text-proposal-text-dark mb-4 font-body leading-relaxed`}
            multiline
          />
          <EditableText
            value={data.diagnosticoJurisprudencia}
            onChange={(v) => onChange({ diagnosticoJurisprudencia: v })}
            className={`${textSizeClass} text-proposal-text-dark mb-4 font-body leading-relaxed`}
            multiline
          />
          <EditableText
            value={data.diagnosticoConclusao}
            onChange={(v) => onChange({ diagnosticoConclusao: v })}
            className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed`}
            multiline
          />
        </div>

        <div className="page-number">2</div>
      </div>
    </div>
  );
};

export default PageDiagnostico;
