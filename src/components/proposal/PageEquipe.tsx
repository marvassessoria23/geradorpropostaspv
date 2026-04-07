import React from "react";
import { ProposalData, TeamMember } from "./types";
import { User } from "lucide-react";

interface Props {
  data: ProposalData;
  pageNumber: number;
}

const MemberCircle: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-proposal-gold/30">
      {member.photo ? (
        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-proposal-dark/20 flex items-center justify-center">
          <User size={24} className="text-proposal-text-light/50" />
        </div>
      )}
    </div>
    <span className="mt-1 text-center text-xs font-body font-semibold text-proposal-text-light">{member.name}</span>
    <span className="text-center text-xs font-body text-proposal-text-light/70">{member.role}</span>
  </div>
);

const PageEquipe: React.FC<Props> = ({ data, pageNumber }) => {
  const gestao = data.team.filter((m) => m.category === "gestao");
  const juridico = data.team.filter((m) => m.category === "juridico");
  const admin = data.team.filter((m) => m.category === "administrativo");

  return (
    <div className="proposal-page-dark geometric-bg">
      <div className="px-[4%] py-[3%] relative z-10 h-full flex flex-col">
        <div className="flex items-start gap-2 mb-4">
          <div className="w-1 h-8 bg-proposal-gold mt-1" />
          <h2 className="font-display text-proposal-gold text-xl md:text-2xl font-bold uppercase tracking-wider">
            Conheça Nossa Equipe
          </h2>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* Gestão */}
          <div>
            <div className="inline-block border border-proposal-gold rounded-full px-4 py-1 mb-3">
              <span className="text-proposal-gold text-xs font-body font-semibold uppercase tracking-wider">Gestão Controladoria</span>
            </div>
            <div className="flex flex-wrap gap-4 items-start">
              {gestao.map((m) => <MemberCircle key={m.id} member={m} />)}
            </div>
          </div>

          {/* Corpo Jurídico */}
          <div>
            <div className="inline-block border border-proposal-gold rounded-full px-4 py-1 mb-3">
              <span className="text-proposal-gold text-xs font-body font-semibold uppercase tracking-wider">Corpo Jurídico</span>
            </div>
            <div className="flex flex-wrap gap-4 items-start">
              {juridico.map((m) => <MemberCircle key={m.id} member={m} />)}
            </div>
          </div>

          {/* Suporte */}
          <div>
            <div className="inline-block border border-proposal-gold rounded-full px-4 py-1 mb-3">
              <span className="text-proposal-gold text-xs font-body font-semibold uppercase tracking-wider">Suporte administrativo / financeiro</span>
            </div>
            <div className="flex flex-wrap gap-4 items-start">
              {admin.map((m) => <MemberCircle key={m.id} member={m} />)}
            </div>
          </div>
        </div>

        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageEquipe;
