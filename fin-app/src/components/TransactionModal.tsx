"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useFinanceStore, type TransactionType } from "@/store/useFinanceStore";

interface TransactionModalProps {
  aberto: boolean;
  onFechar: () => void;
}

const categorias = {
  income: ["Salário", "Freelance", "Investimentos", "Outros"],
  expense: ["Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Outros"],
};

export default function TransactionModal({
  aberto,
  onFechar,
}: TransactionModalProps) {
  const adicionarTransacao = useFinanceStore((s) => s.adicionarTransacao);

  const [tipo, setTipo] = useState<TransactionType>("income");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [erros, setErros] = useState<Record<string, string>>({});

  function resetar() {
    setTipo("income");
    setValor("");
    setCategoria("");
    setDescricao("");
    setData(new Date().toISOString().slice(0, 10));
    setErros({});
  }

  function validar() {
    const novosErros: Record<string, string> = {};
    if (!valor || Number(valor) <= 0) novosErros.valor = "Informe um valor válido";
    if (!categoria) novosErros.categoria = "Selecione uma categoria";
    if (!descricao.trim()) novosErros.descricao = "Informe uma descrição";
    if (!data) novosErros.data = "Informe uma data";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    adicionarTransacao({
      tipo,
      valor: Number(valor),
      categoria,
      descricao: descricao.trim(),
      data,
    });

    resetar();
    onFechar();
  }

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Nova Transação</h2>
          <button
            onClick={() => {
              resetar();
              onFechar();
            }}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tipo */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => { setTipo("income"); setCategoria(""); }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              tipo === "income"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Receita
          </button>
          <button
            type="button"
            onClick={() => { setTipo("expense"); setCategoria(""); }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              tipo === "expense"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Despesa
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Valor */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="0,00"
            />
            {erros.valor && (
              <p className="mt-1 text-xs text-red-500">{erros.valor}</p>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Selecione...</option>
              {categorias[tipo].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {erros.categoria && (
              <p className="mt-1 text-xs text-red-500">{erros.categoria}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Ex: Salário de março"
            />
            {erros.descricao && (
              <p className="mt-1 text-xs text-red-500">{erros.descricao}</p>
            )}
          </div>

          {/* Data */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {erros.data && (
              <p className="mt-1 text-xs text-red-500">{erros.data}</p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full rounded-lg py-2.5 text-sm font-medium text-white transition ${
              tipo === "income"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Adicionar {tipo === "income" ? "Receita" : "Despesa"}
          </button>
        </form>
      </div>
    </div>
  );
}
