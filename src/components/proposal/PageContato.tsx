import React from "react";
import EditableText from "./EditableText";
import { ProposalData } from "./types";
import { Phone, Instagram, Globe } from "lucide-react";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
  textSizeClass: string;
}

const PageContato: React.FC<Props> = ({ data, onChange, textSizeClass }) => {
  return (
    <div className="proposal-page-dark geometric-bg">
      <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col items-center justify-center text-center">
        <div className="mb-6">
          <h2 className="font-display text-proposal-gold text-3xl md:text-4xl font-bold tracking-wider">
            Paiva Nunes
          </h2>
          <p className="text-proposal-text-light/70 font-body tracking-wider">Direito Imobiliário</p>
        </div>

        <div className="proposal-gold-line w-16 mb-6" />

        <h3 className="font-display text-proposal-gold text-xl uppercase tracking-widest mb-8">Contato</h3>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 justify-center">
            <Phone size={16} className="text-proposal-gold" />
            <EditableText
              value={data.telefone}
              onChange={(v) => onChange({ telefone: v })}
              className="text-proposal-text-light font-body"
              tag="span"
            />
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Instagram size={16} className="text-proposal-gold" />
            <EditableText
              value={data.instagram1}
              onChange={(v) => onChange({ instagram1: v })}
              className="text-proposal-text-light font-body"
              tag="span"
            />
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Instagram size={16} className="text-proposal-gold" />
            <EditableText
              value={data.instagram2}
              onChange={(v) => onChange({ instagram2: v })}
              className="text-proposal-text-light font-body"
              tag="span"
            />
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Globe size={16} className="text-proposal-gold" />
            <EditableText
              value={data.website}
              onChange={(v) => onChange({ website: v })}
              className="text-proposal-text-light font-body"
              tag="span"
            />
          </div>
        </div>

        <div className="max-w-lg">
          <EditableText
            value={data.contatoTexto}
            onChange={(v) => onChange({ contatoTexto: v })}
            className={`${textSizeClass} text-proposal-text-light/80 font-body leading-relaxed mb-6`}
            multiline
          />
          <EditableText
            value={data.contatoSlogan}
            onChange={(v) => onChange({ contatoSlogan: v })}
            className="text-proposal-gold font-display text-xl font-bold italic"
          />
        </div>

        <div className="page-number">12</div>
      </div>
    </div>
  );
};

export default PageContato;
