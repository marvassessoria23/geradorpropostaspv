import React from "react";
import EditableText from "./EditableText";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
  textSizeClass: string;
}

const PageSobre: React.FC<Props> = ({ data, onChange, textSizeClass }) => {
  return (
    <div className="proposal-page geometric-bg">
      <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
        <div className="flex items-start gap-2 mb-6">
          <div className="w-1 h-10 bg-proposal-gold mt-1" />
          <h2 className="font-display text-proposal-dark text-2xl md:text-3xl font-bold uppercase tracking-wider">
            Sobre a Paiva Nunes
          </h2>
        </div>

        <div className="flex-1 space-y-4">
          <EditableText
            value={data.sobreText1}
            onChange={(v) => onChange({ sobreText1: v })}
            className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed text-justify`}
            multiline
          />
          <EditableText
            value={data.sobreText2}
            onChange={(v) => onChange({ sobreText2: v })}
            className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed text-justify`}
            multiline
          />
          <EditableText
            value={data.sobreText3}
            onChange={(v) => onChange({ sobreText3: v })}
            className={`${textSizeClass} text-proposal-text-dark font-body leading-relaxed text-justify`}
            multiline
          />
        </div>

        <div className="mt-6 flex justify-center">
          <div className="border-2 border-proposal-gold rounded-full px-6 py-3 bg-proposal-dark flex items-center gap-2">
            <span className="text-proposal-gold text-lg">👆</span>
            <span className="text-proposal-text-light font-body font-medium">Conheça nossas redes sociais</span>
          </div>
        </div>

        <div className="page-number">8</div>
      </div>
    </div>
  );
};

export default PageSobre;
