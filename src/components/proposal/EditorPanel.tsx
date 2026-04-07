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
  Plus, Trash2, User, Copy, ChevronUp, ChevronDown, Eye, EyeOff, Upload, Image, Palette,
} from "lucide-react";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] font-semibold text-proposal-gold/80 uppercase tracking-[0.15em] font-body">{label}</Label>
    {children}
  </div>
);

const inputClass = "bg-[#0a1628] border-proposal-gold/15 text-proposal-text-light font-body text-sm placeholder:text-proposal-text-light/20 focus:border-proposal-gold/50 focus:ring-1 focus:ring-proposal-gold/20 rounded-lg";
const textareaClass = `${inputClass} min-h-[80px] resize-y`;

const ImageUploadField: React.FC<{
  label: string;
  value: string | null;
  onUpload: (base64: string) => void;
  onClear: () => void;
}> = ({ label, value, onUpload, onClear }) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) onUpload(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Field label={label}>
      <div className="space-y-2">
        {value ? (
          <div className="relative group">
            <img src={value} alt={label} className="w-full h-20 object-cover rounded-lg border border-proposal-gold/20" />
            <button
              onClick={onClear}
              className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => ref.current?.click()}
            className="upload-zone h-16 rounded-lg"
          >
            <div className="flex items-center gap-2 text-proposal-gold/40">
              <Image size={14} />
              <span className="text-xs font-body">Clique para enviar</span>
            </div>
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
    </Field>
  );
};

const EditorPanel: React.FC<Props> = ({ data, onChange }) => {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const addPage = (type: PageType) => {
    const newPage: ProposalPage = { id: `p-${Date.now()}`, type, visible: true };
    onChange({ pages: [...data.pages, newPage] });
  };

  const duplicatePage = (id: string) => {
    const idx = data.pages.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const clone: ProposalPage = { ...data.pages[idx], id: `p-${Date.now()}` };
    const newPages = [...data.pages];
    newPages.splice(idx + 1, 0, clone);
    onChange({ pages: newPages });
  };

  const removePage = (id: string) => {
    onChange({ pages: data.pages.filter((p) => p.id !== id) });
  };

  const togglePageVisibility = (id: string) => {
    onChange({ pages: data.pages.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)) });
  };

  const movePage = (id: string, dir: -1 | 1) => {
    const idx = data.pages.findIndex((p) => p.id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= data.pages.length) return;
    const newPages = [...data.pages];
    [newPages[idx], newPages[newIdx]] = [newPages[newIdx], newPages[idx]];
    onChange({ pages: newPages });
  };

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
    onChange({ team: [...data.team, { id: Date.now().toString(), name: "Novo membro", role: "Cargo", photo: null, category }] });
  };

  const removeMember = (id: string) => {
    onChange({ team: data.team.filter((m) => m.id !== id) });
  };

  const updateArg = (id: string, field: keyof ArgumentRow, value: string) => {
    onChange({ argumentos: data.argumentos.map((a) => (a.id === id ? { ...a, [field]: value } : a)) });
  };

  const addArg = () => {
    onChange({
      argumentos: [...data.argumentos, { id: Date.now().toString(), argumento: "Novo argumento", fundamento: "Fundamento", observacao: "Observação" }],
    });
  };

  const removeArg = (id: string) => {
    onChange({ argumentos: data.argumentos.filter((a) => a.id !== id) });
  };

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

  const pageManagementBar = (page: ProposalPage, index: number) => (
    <div className="flex items-center gap-0.5 ml-auto" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => togglePageVisibility(page.id)} className="p-1 rounded hover:bg-proposal-gold/15 text-proposal-text-light/50 transition-colors" title={page.visible ? "Ocultar" : "Mostrar"}>
        {page.visible ? <Eye size={11} /> : <EyeOff size={11} />}
      </button>
      <button onClick={() => movePage(page.id, -1)} disabled={index === 0} className="p-1 rounded hover:bg-proposal-gold/15 text-proposal-text-light/50 disabled:opacity-20 transition-colors">
        <ChevronUp size={11} />
      </button>
      <button onClick={() => movePage(page.id, 1)} disabled={index === data.pages.length - 1} className="p-1 rounded hover:bg-proposal-gold/15 text-proposal-text-light/50 disabled:opacity-20 transition-colors">
        <ChevronDown size={11} />
      </button>
      <button onClick={() => duplicatePage(page.id)} className="p-1 rounded hover:bg-proposal-gold/15 text-proposal-text-light/50 transition-colors" title="Duplicar">
        <Copy size={11} />
      </button>
      <button onClick={() => removePage(page.id)} className="p-1 rounded hover:bg-red-500/20 text-red-400/50 transition-colors" title="Remover">
        <Trash2 size={11} />
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
            <ImageUploadField
              label="Imagem da Capa"
              value={data.coverImage}
              onUpload={(v) => onChange({ coverImage: v })}
              onClear={() => onChange({ coverImage: null })}
            />
            <ImageUploadField
              label="Foto do Advogado"
              value={data.advogadoPhoto}
              onUpload={(v) => onChange({ advogadoPhoto: v })}
              onClear={() => onChange({ advogadoPhoto: null })}
            />
            <div className="border border-proposal-gold/15 rounded-lg p-3 space-y-3">
              <h4 className="text-[10px] font-bold text-proposal-gold/80 uppercase tracking-widest flex items-center gap-1.5">
                <Palette size={10} /> LOGO
              </h4>
              <Field label={`Tamanho: ${data.logoSize}px`}>
                <input
                  type="range"
                  min={40}
                  max={200}
                  value={data.logoSize}
                  onChange={(e) => onChange({ logoSize: Number(e.target.value) })}
                  className="w-full accent-proposal-gold h-1"
                />
              </Field>
              <Field label="Posição">
                <div className="flex gap-1">
                  {(["top", "center", "bottom"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => onChange({ logoPosition: pos })}
                      className={`px-3 py-1 rounded text-[10px] font-body transition-all ${
                        data.logoPosition === pos
                          ? "bg-proposal-gold text-proposal-dark font-bold"
                          : "border border-proposal-gold/20 text-proposal-text-light/60 hover:bg-proposal-gold/10"
                      }`}
                    >
                      {pos === "top" ? "Topo" : pos === "center" ? "Centro" : "Base"}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </div>
        );

      case "diagnostico":
        return (
          <div className="space-y-3">
            <Field label="Título"><Input value={data.diagnosticoTitle} onChange={(e) => onChange({ diagnosticoTitle: e.target.value })} className={inputClass} /></Field>
            <Field label="Saudação"><Input value={data.diagnosticoGreeting} onChange={(e) => onChange({ diagnosticoGreeting: e.target.value })} className={inputClass} /></Field>
            <Field label="Introdução"><Textarea value={data.diagnosticoIntro} onChange={(e) => onChange({ diagnosticoIntro: e.target.value })} className={textareaClass} /></Field>
            <Field label="Corpo do Diagnóstico"><Textarea value={data.diagnosticoBody} onChange={(e) => onChange({ diagnosticoBody: e.target.value })} className={textareaClass} rows={5} /></Field>
            <Field label="Jurisprudência"><Textarea value={data.diagnosticoJurisprudencia} onChange={(e) => onChange({ diagnosticoJurisprudencia: e.target.value })} className={textareaClass} rows={4} /></Field>
            <Field label="Conclusão"><Textarea value={data.diagnosticoConclusao} onChange={(e) => onChange({ diagnosticoConclusao: e.target.value })} className={textareaClass} rows={4} /></Field>
          </div>
        );

      case "estrategia":
        return (
          <div className="space-y-3">
            <Field label="Introdução da Estratégia"><Textarea value={data.estrategiaIntro} onChange={(e) => onChange({ estrategiaIntro: e.target.value })} className={textareaClass} /></Field>
            {[1, 2, 3].map((num) => (
              <div key={num} className="border border-proposal-gold/15 rounded-lg p-3 space-y-2">
                <h4 className="text-[10px] font-bold text-proposal-gold uppercase tracking-widest">Movimento {num}</h4>
                {num === 1 && (
                  <>
                    <Field label="Título"><Input value={data.movimento1Title} onChange={(e) => onChange({ movimento1Title: e.target.value })} className={inputClass} /></Field>
                    <Field label="Introdução"><Textarea value={data.movimento1Intro} onChange={(e) => onChange({ movimento1Intro: e.target.value })} className={textareaClass} /></Field>
                    <Field label="Item 1"><Textarea value={data.movimento1Item1} onChange={(e) => onChange({ movimento1Item1: e.target.value })} className={textareaClass} rows={3} /></Field>
                    <Field label="Item 2"><Textarea value={data.movimento1Item2} onChange={(e) => onChange({ movimento1Item2: e.target.value })} className={textareaClass} rows={3} /></Field>
                    <Field label="Item 3"><Textarea value={data.movimento1Item3} onChange={(e) => onChange({ movimento1Item3: e.target.value })} className={textareaClass} rows={3} /></Field>
                    <Field label="Resultado"><Textarea value={data.movimento1Resultado} onChange={(e) => onChange({ movimento1Resultado: e.target.value })} className={textareaClass} rows={2} /></Field>
                  </>
                )}
                {num === 2 && (
                  <>
                    <Field label="Título"><Input value={data.movimento2Title} onChange={(e) => onChange({ movimento2Title: e.target.value })} className={inputClass} /></Field>
                    <Field label="Consignação"><Textarea value={data.movimento2Consignacao} onChange={(e) => onChange({ movimento2Consignacao: e.target.value })} className={textareaClass} /></Field>
                    <Field label="Obrigação"><Textarea value={data.movimento2Obrigacao} onChange={(e) => onChange({ movimento2Obrigacao: e.target.value })} className={textareaClass} /></Field>
                    <Field label="Pedidos"><Textarea value={data.movimento2Pedidos} onChange={(e) => onChange({ movimento2Pedidos: e.target.value })} className={textareaClass} /></Field>
                    <Field label="Observações"><Textarea value={data.movimento2Observacoes} onChange={(e) => onChange({ movimento2Observacoes: e.target.value })} className={textareaClass} /></Field>
                  </>
                )}
                {num === 3 && (
                  <>
                    <Field label="Título"><Input value={data.movimento3Title} onChange={(e) => onChange({ movimento3Title: e.target.value })} className={inputClass} /></Field>
                    <Field label="Corpo"><Textarea value={data.movimento3Body} onChange={(e) => onChange({ movimento3Body: e.target.value })} className={textareaClass} rows={3} /></Field>
                  </>
                )}
              </div>
            ))}
          </div>
        );

      case "argumentos":
        return (
          <div className="space-y-3">
            {data.argumentos.map((arg, i) => (
              <div key={arg.id} className="border border-proposal-gold/15 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-proposal-gold uppercase tracking-widest">Argumento {i + 1}</span>
                  <button onClick={() => removeArg(arg.id)} className="text-red-400/50 hover:text-red-400 p-1 transition-colors"><Trash2 size={11} /></button>
                </div>
                <Input value={arg.argumento} onChange={(e) => updateArg(arg.id, "argumento", e.target.value)} className={inputClass} placeholder="Argumento" />
                <Input value={arg.fundamento} onChange={(e) => updateArg(arg.id, "fundamento", e.target.value)} className={inputClass} placeholder="Fundamento" />
                <Input value={arg.observacao} onChange={(e) => updateArg(arg.id, "observacao", e.target.value)} className={inputClass} placeholder="Observação" />
              </div>
            ))}
            <button onClick={addArg} className="flex items-center gap-1.5 text-proposal-gold/60 hover:text-proposal-gold text-xs font-body transition-colors">
              <Plus size={13} /> Adicionar argumento
            </button>
          </div>
        );

      case "sobre":
        return (
          <div className="space-y-3">
            <Field label="Texto 1"><Textarea value={data.sobreText1} onChange={(e) => onChange({ sobreText1: e.target.value })} className={textareaClass} rows={4} /></Field>
            <Field label="Texto 2"><Textarea value={data.sobreText2} onChange={(e) => onChange({ sobreText2: e.target.value })} className={textareaClass} rows={3} /></Field>
            <Field label="Texto 3"><Textarea value={data.sobreText3} onChange={(e) => onChange({ sobreText3: e.target.value })} className={textareaClass} rows={4} /></Field>
          </div>
        );

      case "equipe":
        return (
          <div className="space-y-4">
            {(["gestao", "juridico", "administrativo"] as const).map((cat) => {
              const catLabel = cat === "gestao" ? "Gestão" : cat === "juridico" ? "Corpo Jurídico" : "Administrativo";
              const members = data.team.filter((m) => m.category === cat);
              return (
                <div key={cat} className="border border-proposal-gold/15 rounded-lg p-3 space-y-2">
                  <h4 className="text-[10px] font-bold text-proposal-gold uppercase tracking-widest">{catLabel}</h4>
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 bg-[#0a1628] rounded-lg p-2">
                      <div
                        className="w-9 h-9 rounded-full overflow-hidden border border-proposal-gold/25 cursor-pointer flex-shrink-0"
                        onClick={() => fileInputRefs.current[m.id]?.click()}
                      >
                        {m.photo ? (
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-proposal-dark/60 flex items-center justify-center">
                            <User size={14} className="text-proposal-text-light/30" />
                          </div>
                        )}
                        <input
                          ref={(el) => { fileInputRefs.current[m.id] = el; }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePhotoUpload(m.id, file); }}
                        />
                      </div>
                      <div className="flex-1 space-y-1 min-w-0">
                        <Input value={m.name} onChange={(e) => updateMember(m.id, "name", e.target.value)} className={`${inputClass} h-6 text-[11px]`} />
                        <Input value={m.role} onChange={(e) => updateMember(m.id, "role", e.target.value)} className={`${inputClass} h-6 text-[11px]`} placeholder="Cargo" />
                      </div>
                      <button onClick={() => removeMember(m.id)} className="text-red-400/40 hover:text-red-400 p-1 transition-colors"><Trash2 size={11} /></button>
                    </div>
                  ))}
                  <button onClick={() => addMember(cat)} className="flex items-center gap-1 text-proposal-gold/60 text-[11px] hover:text-proposal-gold transition-colors">
                    <Plus size={11} /> Adicionar
                  </button>
                </div>
              );
            })}
          </div>
        );

      case "investimento":
        return (
          <div className="space-y-3">
            <div className="border border-proposal-gold/15 rounded-lg p-3 space-y-2">
              <h4 className="text-[10px] font-bold text-proposal-gold uppercase tracking-widest">Honorários Antecipados</h4>
              <Field label="Valor 1"><Input value={data.honorarioAntecipado1} onChange={(e) => onChange({ honorarioAntecipado1: e.target.value })} className={inputClass} /></Field>
              <Field label="Descrição 1"><Input value={data.honorarioAntecipado1Desc} onChange={(e) => onChange({ honorarioAntecipado1Desc: e.target.value })} className={inputClass} /></Field>
              <Field label="Valor 2"><Input value={data.honorarioAntecipado2} onChange={(e) => onChange({ honorarioAntecipado2: e.target.value })} className={inputClass} /></Field>
              <Field label="Descrição 2"><Input value={data.honorarioAntecipado2Desc} onChange={(e) => onChange({ honorarioAntecipado2Desc: e.target.value })} className={inputClass} /></Field>
            </div>
            <div className="border border-proposal-gold/15 rounded-lg p-3 space-y-2">
              <h4 className="text-[10px] font-bold text-proposal-gold uppercase tracking-widest">Honorários de Êxito</h4>
              <Field label="Extrajudicial"><Textarea value={data.honorarioExito1} onChange={(e) => onChange({ honorarioExito1: e.target.value })} className={textareaClass} rows={2} /></Field>
              <Field label="Judicial"><Textarea value={data.honorarioExito2} onChange={(e) => onChange({ honorarioExito2: e.target.value })} className={textareaClass} rows={2} /></Field>
            </div>
            <Field label="Parcelamento"><Input value={data.parcelamento} onChange={(e) => onChange({ parcelamento: e.target.value })} className={inputClass} /></Field>
            <Field label="Validade"><Textarea value={data.validadeProposta} onChange={(e) => onChange({ validadeProposta: e.target.value })} className={textareaClass} rows={2} /></Field>
          </div>
        );

      case "fechamento":
        return (
          <div className="space-y-3">
            <ImageUploadField
              label="Imagem Lateral"
              value={data.fechamentoImage}
              onUpload={(v) => onChange({ fechamentoImage: v })}
              onClear={() => onChange({ fechamentoImage: null })}
            />
            <Field label="Passos">
              <div className="space-y-2">
                {data.fechamentoSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-proposal-gold text-[10px] font-bold w-4 text-center flex-shrink-0">{i + 1}</span>
                    <Input value={step} onChange={(e) => updateStep(i, e.target.value)} className={`${inputClass} flex-1`} />
                    <button onClick={() => removeStep(i)} className="text-red-400/40 hover:text-red-400 p-1 transition-colors"><Trash2 size={11} /></button>
                  </div>
                ))}
                <button onClick={addStep} className="flex items-center gap-1 text-proposal-gold/60 text-[11px] hover:text-proposal-gold transition-colors">
                  <Plus size={11} /> Adicionar passo
                </button>
              </div>
            </Field>
            <Field label="Chamada para Ação"><Textarea value={data.fechamentoCTA} onChange={(e) => onChange({ fechamentoCTA: e.target.value })} className={textareaClass} rows={2} /></Field>
          </div>
        );

      case "contato":
        return (
          <div className="space-y-3">
            <ImageUploadField
              label="Imagem Lateral"
              value={data.contatoImage}
              onUpload={(v) => onChange({ contatoImage: v })}
              onClear={() => onChange({ contatoImage: null })}
            />
            <Field label="Telefone"><Input value={data.telefone} onChange={(e) => onChange({ telefone: e.target.value })} className={inputClass} /></Field>
            <Field label="Instagram 1"><Input value={data.instagram1} onChange={(e) => onChange({ instagram1: e.target.value })} className={inputClass} /></Field>
            <Field label="Instagram 2"><Input value={data.instagram2} onChange={(e) => onChange({ instagram2: e.target.value })} className={inputClass} /></Field>
            <Field label="Website"><Input value={data.website} onChange={(e) => onChange({ website: e.target.value })} className={inputClass} /></Field>
            <Field label="Texto"><Textarea value={data.contatoTexto} onChange={(e) => onChange({ contatoTexto: e.target.value })} className={textareaClass} rows={3} /></Field>
            <Field label="Slogan"><Input value={data.contatoSlogan} onChange={(e) => onChange({ contatoSlogan: e.target.value })} className={inputClass} /></Field>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Settings bar */}
      <div className="px-4 py-3 border-b border-proposal-gold/10 space-y-3 bg-[#0a1628]/50">
        <div className="flex items-center justify-between">
          <span className="text-proposal-gold/70 font-body font-semibold text-[10px] uppercase tracking-[0.15em]">Tamanho do Texto</span>
          <div className="flex gap-1">
            {(["small", "medium", "large"] as const).map((size) => (
              <button
                key={size}
                onClick={() => onChange({ textSize: size })}
                className={`w-7 h-7 rounded-md text-[10px] font-body font-bold transition-all ${
                  data.textSize === size
                    ? "bg-proposal-gold text-proposal-dark shadow-sm"
                    : "border border-proposal-gold/15 text-proposal-text-light/50 hover:bg-proposal-gold/10"
                }`}
              >
                {size === "small" ? "P" : size === "medium" ? "M" : "G"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-proposal-gold/70 font-body font-semibold text-[10px] uppercase tracking-[0.15em]">Visualização</span>
          <div className="flex gap-1">
            {(["pages", "continuous"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onChange({ viewMode: mode })}
                className={`px-3 py-1 rounded-md text-[10px] font-body transition-all ${
                  data.viewMode === mode
                    ? "bg-proposal-gold text-proposal-dark font-bold shadow-sm"
                    : "border border-proposal-gold/15 text-proposal-text-light/50 hover:bg-proposal-gold/10"
                }`}
              >
                {mode === "pages" ? "Páginas" : "Contínuo"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pages accordion */}
      <div className="flex-1 overflow-y-auto editor-scrollbar px-3 py-3">
        <Accordion type="single" collapsible className="space-y-1.5">
          {data.pages.map((page, index) => (
            <AccordionItem key={page.id} value={page.id} className="border border-proposal-gold/10 rounded-xl overflow-hidden bg-[#0a1628]/30">
              <AccordionTrigger className="px-3 py-2.5 text-proposal-text-light font-body text-sm hover:no-underline hover:bg-proposal-gold/5 [&[data-state=open]]:bg-proposal-gold/8 transition-colors">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-proposal-gold flex items-center justify-center text-proposal-dark font-bold text-[9px] flex-shrink-0 shadow-sm">
                    {index + 1}
                  </span>
                  <span className={`truncate text-xs ${!page.visible ? "opacity-30 line-through" : ""}`}>
                    {PAGE_TYPE_LABELS[page.type]}
                  </span>
                  {pageManagementBar(page, index)}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-3 pt-2">
                {renderSectionFields(page, index)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Add page */}
        <div className="mt-4 pb-6">
          <select
            onChange={(e) => { if (e.target.value) { addPage(e.target.value as PageType); e.target.value = ""; } }}
            defaultValue=""
            className="w-full px-3 py-2.5 rounded-xl bg-[#0a1628]/30 border border-dashed border-proposal-gold/20 text-proposal-gold/60 font-body text-xs cursor-pointer appearance-none hover:border-proposal-gold/40 transition-colors"
          >
            <option value="" disabled>+ Adicionar página...</option>
            {Object.entries(PAGE_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
