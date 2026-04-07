import React from "react";
import { ProposalData, ArgumentRow } from "./types";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: ProposalData;
  onChange: (updates: Partial<ProposalData>) => void;
  textSizeClass: string;
}

const PageArgumentos: React.FC<Props> = ({ data, onChange, textSizeClass }) => {
  const updateArg = (id: string, field: keyof ArgumentRow, value: string) => {
    onChange({
      argumentos: data.argumentos.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    });
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

  return (
    <div className="proposal-page geometric-bg">
      <div className="px-[6%] py-[4%] relative z-10 h-full flex flex-col">
        <div className="bg-proposal-dark/5 p-4 mb-6">
          <h2 className="font-bold text-proposal-dark text-2xl md:text-3xl font-body uppercase">
            Síntese dos Argumentos Disponíveis
          </h2>
        </div>

        <div className="flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-proposal-dark/20">
                <th className={`text-left p-3 font-bold text-proposal-dark font-body ${textSizeClass}`}>Argumento</th>
                <th className={`text-left p-3 font-bold text-proposal-dark font-body ${textSizeClass}`}>Fundamento Legal</th>
                <th className={`text-left p-3 font-bold text-proposal-dark font-body ${textSizeClass}`}>Observação</th>
                <th className="w-10 no-print"></th>
              </tr>
            </thead>
            <tbody>
              {data.argumentos.map((arg) => (
                <tr key={arg.id} className="border-b border-proposal-dark/10 group">
                  <td className="p-3">
                    <input
                      value={arg.argumento}
                      onChange={(e) => updateArg(arg.id, "argumento", e.target.value)}
                      className={`${textSizeClass} bg-transparent editable-field w-full font-body text-proposal-text-dark`}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      value={arg.fundamento}
                      onChange={(e) => updateArg(arg.id, "fundamento", e.target.value)}
                      className={`${textSizeClass} bg-transparent editable-field w-full font-body text-proposal-text-dark`}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      value={arg.observacao}
                      onChange={(e) => updateArg(arg.id, "observacao", e.target.value)}
                      className={`${textSizeClass} bg-transparent editable-field w-full font-body text-proposal-text-dark`}
                    />
                  </td>
                  <td className="no-print">
                    <button
                      onClick={() => removeArg(arg.id)}
                      className="opacity-0 group-hover:opacity-100 text-destructive p-1 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={addArg}
            className="mt-4 flex items-center gap-2 text-proposal-gold hover:text-proposal-dark transition-colors font-body text-sm no-print"
          >
            <Plus size={16} /> Adicionar argumento
          </button>
        </div>

        <div className="page-number">7</div>
      </div>
    </div>
  );
};

export default PageArgumentos;
