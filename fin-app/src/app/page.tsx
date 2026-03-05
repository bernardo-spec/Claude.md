"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import Header from "@/components/Header";
import SummaryCard from "@/components/SummaryCard";
import TransactionModal from "@/components/TransactionModal";
import TransactionList from "@/components/TransactionList";

export default function Home() {
  const transacoes = useFinanceStore((s) => s.transacoes);
  const [modalAberto, setModalAberto] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const receitas = transacoes
    .filter((t) => t.tipo === "income")
    .reduce((acc, t) => acc + t.valor, 0);

  const despesas = transacoes
    .filter((t) => t.tipo === "expense")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = receitas - despesas;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard titulo="Saldo Total" valor={saldo} icon={DollarSign} cor="blue" />
          <SummaryCard titulo="Receitas" valor={receitas} icon={TrendingUp} cor="green" />
          <SummaryCard titulo="Despesas" valor={despesas} icon={TrendingDown} cor="red" />
        </div>

        {/* Nova Transação */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Transações</h2>
          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Nova Transação
          </button>
        </div>

        <TransactionList />

        <TransactionModal
          aberto={modalAberto}
          onFechar={() => setModalAberto(false)}
        />
      </main>
    </div>
  );
}
