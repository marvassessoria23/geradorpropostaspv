import React from "react";
import EditableText from "./EditableText";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
  textSizeClass: string;
}

const PageFechamento: React.FC<Props> = ({ data, onChange, textSizeClass }) => {
  const updateStep = (index: number, value: string) => {
    const steps = [...data.fechamentoSteps];
    steps[index] = value;
    onChange({ fechamentoSteps: steps });
  };

  return (
    <div className="proposal-page-dark geometric-bg">
      <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
        <div className="flex items-start gap-2 mb-8">
          <div className="w-1 h-10 bg-proposal-gold mt-1" />
          <h2 className="font-display text-proposal-gold text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Próximos Passos
          </h2>
        </div>

        <div className="flex-1 flex gap-8">
          <div className="flex-1">
            {/* Timeline */}
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-proposal-gold/50" />
              {data.fechamentoSteps.map((step, i) => (
                <div key={i} className="relative mb-8">
                  <div className="absolute left-[-22px] top-1 w-4 h-4 rounded-full bg-proposal-gold" />
                  <EditableText
                    value={step}
                    onChange={(v) => updateStep(i, v)}
                    className={`${textSizeClass} text-proposal-text-light/80 font-body`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8">
              <EditableText
                value={data.fechamentoCTA}
                onChange={(v) => onChange({ fechamentoCTA: v })}
                className="text-proposal-gold font-body text-lg leading-relaxed"
                multiline
              />
            </div>
          </div>
        </div>

        <div className="page-number">11</div>
      </div>
    </div>
  );
};

export default PageFechamento;
