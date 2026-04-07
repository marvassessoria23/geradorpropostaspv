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
              </tr>
            </thead>
            <tbody>
              {data.argumentos.map((arg) => (
                <tr key={arg.id} className="border-b border-proposal-dark/10">
                  <td className={`p-3 ${textSizeClass} font-body text-proposal-text-dark`}>{arg.argumento}</td>
                  <td className={`p-3 ${textSizeClass} font-body text-proposal-text-dark`}>{arg.fundamento}</td>
                  <td className={`p-3 ${textSizeClass} font-body text-proposal-text-dark`}>{arg.observacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="page-number">{pageNumber}</div>
      </div>
    </div>
  );
};

export default PageArgumentos;
