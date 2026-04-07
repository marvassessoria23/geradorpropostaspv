import React from "react";
import { ProposalData } from "./types";

interface Props {
  data: ProposalData;
  textSizeClass: string;
  pageNumber: number;
}

const PageArgumentos: React.FC<Props> = ({ data, textSizeClass, pageNumber }) => {
  return (
    <div className="proposal-page geometric-bg">
      <div className="px-[6%] py-[4.5%] relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-10 bg-proposal-gold rounded-full" />
          <h2 className="font-display text-proposal-dark text-xl md:text-2xl font-bold uppercase tracking-wider">
            Síntese dos Argumentos Disponíveis
          </h2>
          <div className="flex-1 h-px bg-proposal-dark/10 ml-4" />
        </div>

        <div className="flex-1">
          <div className="rounded-lg overflow-hidden border border-proposal-dark/10">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-proposal-dark">
                  <th className={`text-left px-4 py-3 font-bold text-proposal-text-light font-body ${textSizeClass} tracking-wide`}>Argumento</th>
                  <th className={`text-left px-4 py-3 font-bold text-proposal-text-light font-body ${textSizeClass} tracking-wide`}>Fundamento Legal</th>
                  <th className={`text-left px-4 py-3 font-bold text-proposal-text-light font-body ${textSizeClass} tracking-wide`}>Observação</th>
                </tr>
              </thead>
              <tbody>
                {data.argumentos.map((arg, i) => (
                  <tr key={arg.id} className={`border-b border-proposal-dark/8 ${i % 2 === 0 ? 'bg-proposal-cream' : 'bg-proposal-cream/60'}`}>
                    <td className={`px-4 py-3 ${textSizeClass} font-body text-proposal-text-dark font-medium`}>{arg.argumento}</td>
                    <td className={`px-4 py-3 ${textSizeClass} font-body text-proposal-text-dark`}>{arg.fundamento}</td>
                    <td className={`px-4 py-3 ${textSizeClass} font-body text-proposal-text-dark/80 italic`}>{arg.observacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageArgumentos;
