import React from "react";
import { ProposalData, TeamMember } from "./types";
import { User } from "lucide-react";

interface Props {
  data: ProposalData;
  pageNumber: number;
}

const MemberCircle: React.FC<{ member: TeamMember; size?: "sm" | "md" }> = ({ member, size = "md" }) => {
  const dim = size === "sm" ? "w-14 h-14 md:w-16 md:h-16" : "w-16 h-16 md:w-[72px] md:h-[72px]";
  const iconSize = size === "sm" ? 18 : 22;

  return (
    <div className="flex flex-col items-center w-20 md:w-24 flex-shrink-0">
      <div className={`${dim} rounded-full overflow-hidden border-2 border-proposal-gold/30 shadow-md`}>
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-proposal-dark/30 to-proposal-dark/60 flex items-center justify-center">
            <User size={iconSize} className="text-proposal-text-light/40" />
          </div>
        )}
      </div>
      <span className="mt-1.5 text-center text-[10px] md:text-xs font-body font-semibold text-proposal-text-light leading-tight line-clamp-2">
        {member.name}
      </span>
      {member.role && (
        <span className="text-center text-[9px] md:text-[10px] font-body text-proposal-gold/80 leading-tight">
          {member.role}
        </span>
      )}
    </div>
  );
};

const PageEquipe: React.FC<Props> = ({ data, pageNumber }) => {
  const gestao = data.team.filter((m) => m.category === "gestao");
  const juridico = data.team.filter((m) => m.category === "juridico");
  const admin = data.team.filter((m) => m.category === "administrativo");

  return (
    <div className="proposal-page-dark geometric-bg">
      <div className="px-[5%] py-[3.5%] relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-8 bg-proposal-gold rounded-full" />
          <h2 className="font-display text-proposal-gold text-xl md:text-2xl font-bold uppercase tracking-wider">
            Conheça Nossa Equipe
          </h2>
          <div className="flex-1 h-px bg-proposal-gold/15 ml-4" />
        </div>

        <div className="flex-1 flex flex-col gap-5 min-h-0">
          {/* Gestão */}
          {gestao.length > 0 && (
            <div>
              <div className="inline-block border border-proposal-gold/50 rounded-full px-4 py-0.5 mb-3">
                <span className="text-proposal-gold text-[10px] font-body font-semibold uppercase tracking-widest">
                  Gestão Controladoria
                </span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                {gestao.map((m) => <MemberCircle key={m.id} member={m} />)}
              </div>
            </div>
          )}

          {/* Corpo Jurídico */}
          {juridico.length > 0 && (
            <div>
              <div className="inline-block border border-proposal-gold/50 rounded-full px-4 py-0.5 mb-3">
                <span className="text-proposal-gold text-[10px] font-body font-semibold uppercase tracking-widest">
                  Corpo Jurídico
                </span>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                {juridico.map((m) => <MemberCircle key={m.id} member={m} size="sm" />)}
              </div>
            </div>
          )}

          {/* Suporte */}
          {admin.length > 0 && (
            <div>
              <div className="inline-block border border-proposal-gold/50 rounded-full px-4 py-0.5 mb-3">
                <span className="text-proposal-gold text-[10px] font-body font-semibold uppercase tracking-widest">
                  Suporte Administrativo / Financeiro
                </span>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                {admin.map((m) => <MemberCircle key={m.id} member={m} size="sm" />)}
              </div>
            </div>
          )}
        </div>

        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageEquipe;
