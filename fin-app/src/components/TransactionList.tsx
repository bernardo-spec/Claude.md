"use client";

import { Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";

export default function TransactionList() {
  const transacoes = useFinanceStore((s) => s.transacoes);
  const removerTransacao = useFinanceStore((s) => s.removerTransacao);

  if (transacoes.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-gray-400">Nenhuma transação registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase text-gray-500">
            <th className="px-5 py-3">Descrição</th>
            <th className="px-5 py-3">Categoria</th>
            <th className="px-5 py-3">Data</th>
            <th className="px-5 py-3 text-right">Valor</th>
            <th className="px-5 py-3 text-right">Ação</th>
          </tr>
        </thead>
        <tbody>
          {transacoes.map((t) => (
            <tr
              key={t.id}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
            >
              <td className="flex items-center gap-2 px-5 py-3 font-medium text-gray-800">
                {t.tipo === "income" ? (
                  <ArrowUpCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownCircle className="h-4 w-4 text-red-500" />
                )}
                {t.descricao}
              </td>
              <td className="px-5 py-3 text-gray-500">{t.categoria}</td>
              <td className="px-5 py-3 text-gray-500">
                {new Date(t.data + "T00:00:00").toLocaleDateString("pt-BR")}
              </td>
              <td
                className={`px-5 py-3 text-right font-semibold ${
                  t.tipo === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {t.tipo === "income" ? "+" : "-"}{" "}
                {t.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => removerTransacao(t.id)}
                  className="rounded-lg p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
