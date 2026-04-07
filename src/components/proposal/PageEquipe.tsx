import React, { useRef } from "react";
import { ProposalData, TeamMember } from "./types";
import { Plus, Trash2, Upload, User } from "lucide-react";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
}

const PageEquipe: React.FC<Props> = ({ data, onChange }) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    onChange({
      team: data.team.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    });
  };

  const handlePhotoUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateMember(id, "photo", e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const addMember = (category: TeamMember["category"]) => {
    onChange({
      team: [
        ...data.team,
        { id: Date.now().toString(), name: "Novo membro", role: "Cargo", photo: null, category },
      ],
    });
  };

  const removeMember = (id: string) => {
    onChange({ team: data.team.filter((m) => m.id !== id) });
  };

  const gestao = data.team.filter((m) => m.category === "gestao");
  const juridico = data.team.filter((m) => m.category === "juridico");
  const admin = data.team.filter((m) => m.category === "administrativo");

  const MemberCircle: React.FC<{ member: TeamMember }> = ({ member }) => (
    <div className="flex flex-col items-center group relative">
      <button
        onClick={() => removeMember(member.id)}
        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-destructive text-destructive-foreground rounded-full p-0.5 z-10 no-print transition-opacity"
      >
        <Trash2 size={10} />
      </button>
      <div
        className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-proposal-gold/30 cursor-pointer relative group"
        onClick={() => fileInputRefs.current[member.id]?.click()}
      >
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-proposal-dark/20 flex items-center justify-center">
            <User size={24} className="text-proposal-text-light/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-proposal-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity no-print">
          <Upload size={14} className="text-proposal-text-light" />
        </div>
        <input
          ref={(el) => { fileInputRefs.current[member.id] = el; }}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePhotoUpload(member.id, file);
          }}
        />
      </div>
      <input
        value={member.name}
        onChange={(e) => updateMember(member.id, "name", e.target.value)}
        className="mt-1 text-center text-xs font-body font-semibold bg-transparent editable-field text-proposal-text-light w-full"
      />
      <input
        value={member.role}
        onChange={(e) => updateMember(member.id, "role", e.target.value)}
        className="text-center text-xs font-body bg-transparent editable-field text-proposal-text-light/70 w-full"
      />
    </div>
  );

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
              {gestao.map((m) => (
                <MemberCircle key={m.id} member={m} />
              ))}
              <button
                onClick={() => addMember("gestao")}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-proposal-gold/30 flex items-center justify-center hover:border-proposal-gold transition-colors no-print"
              >
                <Plus size={20} className="text-proposal-gold/50" />
              </button>
            </div>
          </div>

          {/* Corpo Jurídico */}
          <div>
            <div className="inline-block border border-proposal-gold rounded-full px-4 py-1 mb-3">
              <span className="text-proposal-gold text-xs font-body font-semibold uppercase tracking-wider">Corpo Jurídico</span>
            </div>
            <div className="flex flex-wrap gap-4 items-start">
              {juridico.map((m) => (
                <MemberCircle key={m.id} member={m} />
              ))}
              <button
                onClick={() => addMember("juridico")}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-proposal-gold/30 flex items-center justify-center hover:border-proposal-gold transition-colors no-print"
              >
                <Plus size={20} className="text-proposal-gold/50" />
              </button>
            </div>
          </div>

          {/* Suporte */}
          <div>
            <div className="inline-block border border-proposal-gold rounded-full px-4 py-1 mb-3">
              <span className="text-proposal-gold text-xs font-body font-semibold uppercase tracking-wider">Suporte administrativo / financeiro</span>
            </div>
            <div className="flex flex-wrap gap-4 items-start">
              {admin.map((m) => (
                <MemberCircle key={m.id} member={m} />
              ))}
              <button
                onClick={() => addMember("administrativo")}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-proposal-gold/30 flex items-center justify-center hover:border-proposal-gold transition-colors no-print"
              >
                <Plus size={20} className="text-proposal-gold/50" />
              </button>
            </div>
          </div>
        </div>

        <div className="page-number">9</div>
      </div>
    </div>
  );
};

export default PageEquipe;
