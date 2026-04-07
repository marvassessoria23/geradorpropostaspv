import React from "react";
import EditableText from "./EditableText";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
}

const PageCover: React.FC<Props> = ({ data, onChange }) => {
  return (
    <div className="proposal-page-dark geometric-bg flex">
      <div className="flex-1 flex flex-col justify-center px-[6%] py-[5%] z-10">
        <div className="proposal-gold-line w-24 mb-6" />
        <h1 className="font-display text-proposal-gold text-5xl md:text-6xl font-bold uppercase tracking-wider leading-tight">
          Proposta de
          <br />
          <span className="text-proposal-text-light">Honorários</span>
        </h1>
        <div className="mt-8">
          <EditableText
            value={data.clientName}
            onChange={(v) => onChange({ clientName: v })}
            className="text-proposal-text-light text-xl md:text-2xl font-body"
            tag="h2"
          />
        </div>
        <div className="mt-10 flex items-center gap-4">
          <div className="w-12 h-12 border border-proposal-gold/50 rounded flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none" stroke="hsl(42, 65%, 55%)" strokeWidth="1">
              <path d="M20 5 L35 15 L30 35 L10 35 L5 15 Z" />
              <path d="M20 10 L30 17 L27 32 L13 32 L10 17 Z" />
            </svg>
          </div>
          <div>
            <p className="font-display text-proposal-text-light text-lg tracking-widest uppercase">
              Paiva Nunes
            </p>
            <p className="text-proposal-gold text-sm tracking-wider">Direito Imobiliário</p>
          </div>
        </div>
        <div className="page-number">1</div>
      </div>
      <div className="hidden md:block w-[45%] bg-proposal-dark/30 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-proposal-dark/80" />
      </div>
    </div>
  );
};

export default PageCover;
