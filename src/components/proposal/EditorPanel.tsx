import React, { useRef } from "react";
import { ProposalData, TeamMember, ArgumentRow, ProposalPage, PageType, PAGE_TYPE_LABELS } from "./types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Plus, Trash2, Upload, User, Copy, ChevronUp, ChevronDown, Eye, EyeOff,
} from "lucide-react";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-semibold text-proposal-gold uppercase tracking-wider">{label}</Label>
    {children}
  </div>
);

const inputClass = "bg-proposal-dark/80 border-proposal-gold/20 text-proposal-text-light font-body text-sm placeholder:text-proposal-text-light/30 focus:border-proposal-gold/60";
const textareaClass = `${inputClass} min-h-[80px] resize-y`;

const EditorPanel: React.FC<Props> = ({ data, onChange }) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Page management
  const addPage = (type: PageType) => {
    const newPage: ProposalPage = {
      id: `p-${Date.now()}`,
      type,
      visible: true,
    };
    onChange({ pages: [...data.pages, newPage] });
  };

  const duplicatePage = (id: string) => {
    const idx = data.pages.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const source = data.pages[idx];
    const clone: ProposalPage = { ...source, id: `p-${Date.now()}` };
    const newPages = [...data.pages];
    newPages.splice(idx + 1, 0, clone);
    onChange({ pages: newPages });
  };

  const removePage = (id: string) => {
    onChange({ pages: data.pages.filter((p) => p.id !== id) });
  };

  const togglePageVisibility = (id: string) => {
    onChange({
      pages: data.pages.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)),
    });
  };

  const movePage = (id: string, dir: -1 | 1) => {
    const idx = data.pages.findIndex((p) => p.id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= data.pages.length) return;
    const newPages = [...data.pages];
    [newPages[idx], newPages[newIdx]] = [newPages[newIdx], newPages[idx]];
    onChange({ pages: newPages });
  };

  // Team management
  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    onChange({ team: data.team.map((m) => (m.id === id ? { ...m, [field]: value } : m)) });
  };

  const handlePhotoUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) updateMember(id, "photo", e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addMember = (category: TeamMember["category"]) => {
    onChange({
      team: [...data.team, { id: Date.now().toString(), name: "Novo membro", role: "Cargo", photo: null, category }],
    });
  };

  const removeMember = (id: string) => {
    onChange({ team: data.team.filter((m) => m.id !== id) });
  };

  // Argumentos
  const updateArg = (id: string, field: keyof ArgumentRow, value: string) => {
    onChange({ argumentos: data.argumentos.map((a) => (a.id === id ? { ...a, [field]: value } : a)) });
  };

  const addArg = () => {
    onChange({
      argumentos: [
        ...data.argumentos,
        { id: Date.now().toString(), argumento: "Novo argumento", fundamento: "Fundamento", observacao: "Observação" },
      ],
    });
  };

  const removeArg = (id: string) => {
    onChange({ argumentos: data.argumentos.filter((a) => a.id !== id) });
  };

  // Fechamento steps
  const updateStep = (index: number, value: string) => {
    const steps = [...data.fechamentoSteps];
    steps[index] = value;
    onChange({ fechamentoSteps: steps });
  };

  const addStep = () => {
    onChange({ fechamentoSteps: [...data.fechamentoSteps, "Novo passo"] });
  };

  const removeStep = (index: number) => {
    onChange({ fechamentoSteps: data.fechamentoSteps.filter((_, i) => i !== index) });
  };

  const PageManagementBar: React.FC<{ page: ProposalPage; index: number }> = ({ page, index }) => (
    <div className="flex items-center gap-1 ml-auto">
      <button onClick={() => togglePageVisibility(page.id)} className="p-1 rounded hover:bg-proposal-gold/20 text-proposal-text-light/60" title={page.visible ? "Ocultar" : "Mostrar"}>
        {page.visible ? <Eye size={12} /> : <EyeOff size={12} />}
      </button>
      <button onClick={() => movePage(page.id, -1)} disabled={index === 0} className="p-1 rounded hover:bg-proposal-gold/20 text-proposal-text-light/60 disabled:opacity-30">
        <ChevronUp size={12} />
      </button>
      <button onClick={() => movePage(page.id, 1)} disabled={index === data.pages.length - 1} className="p-1 rounded hover:bg-proposal-gold/20 text-proposal-text-light/60 disabled:opacity-30">
        <ChevronDown size={12} />
      </button>
      <button onClick={() => duplicatePage(page.id)} className="p-1 rounded hover:bg-proposal-gold/20 text-proposal-text-light/60" title="Duplicar">
        <Copy size={12} />
      </button>
      <button onClick={() => removePage(page.id)} className="p-1 rounded hover:bg-red-500/20 text-red-400/70" title="Remover">
        <Trash2 size={12} />
      </button>
    </div>
  );

  const renderSectionFields = (page: ProposalPage, index: number) => {
    switch (page.type) {
      case "cover":
        return (
          <div className="space-y-3">
            <Field label="Nome do Cliente">
              <Input value={data.clientName} onChange={(e) => onChange({ clientName: e.target.value })} className={inputClass} />
            </Field>
          </div>
        );

      case "diagnostico":
        return (
          <div className="space-y-3">
            <Field label="Título">
              <Input value={data.diagnosticoTitle} onChange={(e) => onChange({ diagnosticoTitle: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Saudação">
              <Input value={data.diagnosticoGreeting} onChange={(e) => onChange({ diagnosticoGreeting: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Introdução">
              <Textarea value={data.diagnosticoIntro} onChange={(e) => onChange({ diagnosticoIntro: e.target.value })} className={textareaClass} />
            </Field>
            <Field label="Corpo do Diagnóstico">
              <Textarea value={data.diagnosticoBody} onChange={(e) => onChange({ diagnosticoBody: e.target.value })} className={textareaClass} rows={5} />
            </Field>
            <Field label="Jurisprudência">
              <Textarea value={data.diagnosticoJurisprudencia} onChange={(e) => onChange({ diagnosticoJurisprudencia: e.target.value })} className={textareaClass} rows={4} />
            </Field>
            <Field label="Conclusão">
              <Textarea value={data.diagnosticoConclusao} onChange={(e) => onChange({ diagnosticoConclusao: e.target.value })} className={textareaClass} rows={4} />
            </Field>
          </div>
        );

      case "estrategia":
        return (
          <div className="space-y-3">
            <Field label="Introdução da Estratégia">
              <Textarea value={data.estrategiaIntro} onChange={(e) => onChange({ estrategiaIntro: e.target.value })} className={textareaClass} />
            </Field>
            <div className="border border-proposal-gold/20 rounded p-3 space-y-3">
              <h4 className="text-xs font-bold text-proposal-gold">MOVIMENTO 1</h4>
              <Field label="Título">
                <Input value={data.movimento1Title} onChange={(e) => onChange({ movimento1Title: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Introdução">
                <Textarea value={data.movimento1Intro} onChange={(e) => onChange({ movimento1Intro: e.target.value })} className={textareaClass} />
              </Field>
              <Field label="Item 1 - Purga da Mora">
                <Textarea value={data.movimento1Item1} onChange={(e) => onChange({ movimento1Item1: e.target.value })} className={textareaClass} rows={4} />
              </Field>
              <Field label="Item 2 - Adimplemento">
                <Textarea value={data.movimento1Item2} onChange={(e) => onChange({ movimento1Item2: e.target.value })} className={textareaClass} rows={4} />
              </Field>
              <Field label="Item 3 - Má-Fé">
                <Textarea value={data.movimento1Item3} onChange={(e) => onChange({ movimento1Item3: e.target.value })} className={textareaClass} rows={4} />
              </Field>
              <Field label="Resultado Esperado">
                <Textarea value={data.movimento1Resultado} onChange={(e) => onChange({ movimento1Resultado: e.target.value })} className={textareaClass} rows={3} />
              </Field>
            </div>
            <div className="border border-proposal-gold/20 rounded p-3 space-y-3">
              <h4 className="text-xs font-bold text-proposal-gold">MOVIMENTO 2</h4>
              <Field label="Título">
                <Input value={data.movimento2Title} onChange={(e) => onChange({ movimento2Title: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Consignação">
                <Textarea value={data.movimento2Consignacao} onChange={(e) => onChange({ movimento2Consignacao: e.target.value })} className={textareaClass} />
              </Field>
              <Field label="Obrigação de Fazer">
                <Textarea value={data.movimento2Obrigacao} onChange={(e) => onChange({ movimento2Obrigacao: e.target.value })} className={textareaClass} />
              </Field>
              <Field label="Pedidos Acessórios">
                <Textarea value={data.movimento2Pedidos} onChange={(e) => onChange({ movimento2Pedidos: e.target.value })} className={textareaClass} />
              </Field>
              <Field label="Observações">
                <Textarea value={data.movimento2Observacoes} onChange={(e) => onChange({ movimento2Observacoes: e.target.value })} className={textareaClass} />
              </Field>
            </div>
            <div className="border border-proposal-gold/20 rounded p-3 space-y-3">
              <h4 className="text-xs font-bold text-proposal-gold">MOVIMENTO 3</h4>
              <Field label="Título">
                <Input value={data.movimento3Title} onChange={(e) => onChange({ movimento3Title: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Corpo">
                <Textarea value={data.movimento3Body} onChange={(e) => onChange({ movimento3Body: e.target.value })} className={textareaClass} rows={4} />
              </Field>
            </div>
          </div>
        );

      case "argumentos":
        return (
          <div className="space-y-3">
            {data.argumentos.map((arg, i) => (
              <div key={arg.id} className="border border-proposal-gold/20 rounded p-3 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-proposal-gold">ARGUMENTO {i + 1}</span>
                  <button onClick={() => removeArg(arg.id)} className="text-red-400/70 hover:text-red-400 p-1"><Trash2 size={12} /></button>
                </div>
                <Input value={arg.argumento} onChange={(e) => updateArg(arg.id, "argumento", e.target.value)} className={inputClass} placeholder="Argumento" />
                <Input value={arg.fundamento} onChange={(e) => updateArg(arg.id, "fundamento", e.target.value)} className={inputClass} placeholder="Fundamento Legal" />
                <Input value={arg.observacao} onChange={(e) => updateArg(arg.id, "observacao", e.target.value)} className={inputClass} placeholder="Observação" />
              </div>
            ))}
            <button onClick={addArg} className="flex items-center gap-2 text-proposal-gold hover:text-proposal-gold/80 text-xs font-body">
              <Plus size={14} /> Adicionar argumento
            </button>
          </div>
        );

      case "sobre":
        return (
          <div className="space-y-3">
            <Field label="Texto 1">
              <Textarea value={data.sobreText1} onChange={(e) => onChange({ sobreText1: e.target.value })} className={textareaClass} rows={4} />
            </Field>
            <Field label="Texto 2">
              <Textarea value={data.sobreText2} onChange={(e) => onChange({ sobreText2: e.target.value })} className={textareaClass} rows={3} />
            </Field>
            <Field label="Texto 3">
              <Textarea value={data.sobreText3} onChange={(e) => onChange({ sobreText3: e.target.value })} className={textareaClass} rows={4} />
            </Field>
          </div>
        );

      case "equipe":
        return (
          <div className="space-y-4">
            {(["gestao", "juridico", "administrativo"] as const).map((cat) => {
              const catLabel = cat === "gestao" ? "Gestão" : cat === "juridico" ? "Corpo Jurídico" : "Administrativo";
              const members = data.team.filter((m) => m.category === cat);
              return (
                <div key={cat} className="border border-proposal-gold/20 rounded p-3 space-y-2">
                  <h4 className="text-xs font-bold text-proposal-gold uppercase">{catLabel}</h4>
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 bg-proposal-dark/60 rounded p-2">
                      <div
                        className="w-10 h-10 rounded-full overflow-hidden border border-proposal-gold/30 cursor-pointer flex-shrink-0 relative"
                        onClick={() => fileInputRefs.current[m.id]?.click()}
                      >
                        {m.photo ? (
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-proposal-dark/40 flex items-center justify-center">
                            <User size={16} className="text-proposal-text-light/40" />
                          </div>
                        )}
                        <input
                          ref={(el) => { fileInputRefs.current[m.id] = el; }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(m.id, file);
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <Input value={m.name} onChange={(e) => updateMember(m.id, "name", e.target.value)} className={`${inputClass} h-7 text-xs`} />
                        <Input value={m.role} onChange={(e) => updateMember(m.id, "role", e.target.value)} className={`${inputClass} h-7 text-xs`} placeholder="Cargo" />
                      </div>
                      <button onClick={() => removeMember(m.id)} className="text-red-400/70 hover:text-red-400 p-1"><Trash2 size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => addMember(cat)} className="flex items-center gap-1 text-proposal-gold text-xs hover:text-proposal-gold/80">
                    <Plus size={12} /> Adicionar
                  </button>
                </div>
              );
            })}
          </div>
        );

      case "investimento":
        return (
          <div className="space-y-3">
            <div className="border border-proposal-gold/20 rounded p-3 space-y-2">
              <h4 className="text-xs font-bold text-proposal-gold">HONORÁRIOS ANTECIPADOS</h4>
              <Field label="Valor 1">
                <Input value={data.honorarioAntecipado1} onChange={(e) => onChange({ honorarioAntecipado1: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Descrição 1">
                <Input value={data.honorarioAntecipado1Desc} onChange={(e) => onChange({ honorarioAntecipado1Desc: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Valor 2">
                <Input value={data.honorarioAntecipado2} onChange={(e) => onChange({ honorarioAntecipado2: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Descrição 2">
                <Input value={data.honorarioAntecipado2Desc} onChange={(e) => onChange({ honorarioAntecipado2Desc: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <div className="border border-proposal-gold/20 rounded p-3 space-y-2">
              <h4 className="text-xs font-bold text-proposal-gold">HONORÁRIOS DE ÊXITO</h4>
              <Field label="Extrajudicial">
                <Textarea value={data.honorarioExito1} onChange={(e) => onChange({ honorarioExito1: e.target.value })} className={textareaClass} rows={2} />
              </Field>
              <Field label="Judicial">
                <Textarea value={data.honorarioExito2} onChange={(e) => onChange({ honorarioExito2: e.target.value })} className={textareaClass} rows={2} />
              </Field>
            </div>
            <Field label="Parcelamento">
              <Input value={data.parcelamento} onChange={(e) => onChange({ parcelamento: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Validade da Proposta">
              <Textarea value={data.validadeProposta} onChange={(e) => onChange({ validadeProposta: e.target.value })} className={textareaClass} rows={2} />
            </Field>
          </div>
        );

      case "fechamento":
        return (
          <div className="space-y-3">
            <Field label="Passos">
              <div className="space-y-2">
                {data.fechamentoSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-proposal-gold text-xs font-bold w-5">{i + 1}.</span>
                    <Input value={step} onChange={(e) => updateStep(i, e.target.value)} className={`${inputClass} flex-1`} />
                    <button onClick={() => removeStep(i)} className="text-red-400/70 hover:text-red-400 p-1"><Trash2 size={12} /></button>
                  </div>
                ))}
                <button onClick={addStep} className="flex items-center gap-1 text-proposal-gold text-xs hover:text-proposal-gold/80">
                  <Plus size={12} /> Adicionar passo
                </button>
              </div>
            </Field>
            <Field label="Chamada para Ação">
              <Textarea value={data.fechamentoCTA} onChange={(e) => onChange({ fechamentoCTA: e.target.value })} className={textareaClass} rows={2} />
            </Field>
          </div>
        );

      case "contato":
        return (
          <div className="space-y-3">
            <Field label="Telefone">
              <Input value={data.telefone} onChange={(e) => onChange({ telefone: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Instagram 1">
              <Input value={data.instagram1} onChange={(e) => onChange({ instagram1: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Instagram 2">
              <Input value={data.instagram2} onChange={(e) => onChange({ instagram2: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Website">
              <Input value={data.website} onChange={(e) => onChange({ website: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Texto de Contato">
              <Textarea value={data.contatoTexto} onChange={(e) => onChange({ contatoTexto: e.target.value })} className={textareaClass} rows={3} />
            </Field>
            <Field label="Slogan">
              <Input value={data.contatoSlogan} onChange={(e) => onChange({ contatoSlogan: e.target.value })} className={inputClass} />
            </Field>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-proposal-dark">
      {/* Settings */}
      <div className="px-4 py-3 border-b border-proposal-gold/20 space-y-3">
        <div>
          <span className="text-proposal-gold font-body font-semibold text-xs uppercase tracking-wider">Tamanho do Texto</span>
          <div className="flex gap-1 mt-1">
            {(["small", "medium", "large"] as const).map((size) => (
              <button
                key={size}
                onClick={() => onChange({ textSize: size })}
                className={`px-3 py-1 rounded text-xs font-body transition-colors ${
                  data.textSize === size
                    ? "bg-proposal-gold text-proposal-dark"
                    : "border border-proposal-gold/30 text-proposal-text-light hover:bg-proposal-gold/10"
                }`}
              >
                {size === "small" ? "P" : size === "medium" ? "M" : "G"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <span className="text-proposal-gold font-body font-semibold text-xs uppercase tracking-wider">Visualização</span>
          <div className="flex gap-1 mt-1">
            {(["pages", "continuous"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onChange({ viewMode: mode })}
                className={`px-3 py-1 rounded text-xs font-body transition-colors ${
                  data.viewMode === mode
                    ? "bg-proposal-gold text-proposal-dark"
                    : "border border-proposal-gold/30 text-proposal-text-light hover:bg-proposal-gold/10"
                }`}
              >
                {mode === "pages" ? "Páginas" : "Contínuo"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pages accordion */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <Accordion type="single" collapsible className="space-y-1">
          {data.pages.map((page, index) => (
            <AccordionItem key={page.id} value={page.id} className="border border-proposal-gold/15 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-3 py-2 text-proposal-text-light font-body text-sm hover:no-underline hover:bg-proposal-gold/5 [&[data-state=open]]:bg-proposal-gold/10">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-proposal-gold flex items-center justify-center text-proposal-dark font-bold text-[10px] flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className={`truncate ${!page.visible ? "opacity-40 line-through" : ""}`}>
                    {PAGE_TYPE_LABELS[page.type]}
                  </span>
                  <PageManagementBar page={page} index={index} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3 pt-1">
                {renderSectionFields(page, index)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Add page */}
        <div className="mt-3 pb-4">
          <div className="relative">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addPage(e.target.value as PageType);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="w-full px-3 py-2 rounded-lg bg-proposal-dark border border-dashed border-proposal-gold/30 text-proposal-gold font-body text-xs cursor-pointer appearance-none"
            >
              <option value="" disabled>+ Adicionar página...</option>
              {Object.entries(PAGE_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
