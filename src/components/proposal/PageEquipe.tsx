import React from "react";
import { ProposalData, TeamMember } from "./types";
import { User } from "lucide-react";

interface Props {
  data: ProposalData;
  pageNumber: number;
}

const MemberCircle: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100 }}>
    <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '2px solid #c9a84c', flexShrink: 0 }}>
      {member.photo ? (
        <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={28} color="rgba(255,255,255,0.3)" />
        </div>
      )}
    </div>
    <span style={{ fontFamily: "'Lato', sans-serif", color: '#ffffff', fontSize: 11, fontWeight: 600, textAlign: 'center', marginTop: 6, lineHeight: 1.3 }}>
      {member.name}
    </span>
    {member.role && (
      <span style={{ fontFamily: "'Lato', sans-serif", color: 'rgba(201,168,76,0.8)', fontSize: 10, textAlign: 'center', lineHeight: 1.2 }}>
        {member.role}
      </span>
    )}
  </div>
);

const CategoryBadge: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ display: 'inline-block', border: '1px solid rgba(201,168,76,0.5)', borderRadius: 999, padding: '3px 16px', marginBottom: 16 }}>
    <span style={{ fontFamily: "'Lato', sans-serif", color: '#c9a84c', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
      {label}
    </span>
  </div>
);

const PageEquipe: React.FC<Props> = ({ data, pageNumber }) => {
  const gestao = data.team.filter((m) => m.category === "gestao");
  const juridico = data.team.filter((m) => m.category === "juridico");
  const admin = data.team.filter((m) => m.category === "administrativo");

  return (
    <div className="slide slide-dark geometric-dark" style={{ padding: '48px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <div className="gold-bar-vertical" style={{ height: 32 }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#c9a84c', fontSize: 26, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
          Conheça Nossa Equipe
        </h2>
        <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)', marginLeft: 16 }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {gestao.length > 0 && (
          <div>
            <CategoryBadge label="Gestão Controladoria" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              {gestao.map((m) => <MemberCircle key={m.id} member={m} />)}
            </div>
          </div>
        )}

        {juridico.length > 0 && (
          <div>
            <CategoryBadge label="Corpo Jurídico" />
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(juridico.length, 7)}, 1fr)`, gap: 20 }}>
              {juridico.map((m) => <MemberCircle key={m.id} member={m} />)}
            </div>
          </div>
        )}

        {admin.length > 0 && (
          <div>
            <CategoryBadge label="Suporte Administrativo / Financeiro" />
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(admin.length, 7)}, 1fr)`, gap: 20 }}>
              {admin.map((m) => <MemberCircle key={m.id} member={m} />)}
            </div>
          </div>
        )}
      </div>

      <div className="page-num">{pageNumber}</div>
    </div>
  );
};

export default PageEquipe;
