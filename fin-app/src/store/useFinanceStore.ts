import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  tipo: TransactionType;
  valor: number;
  categoria: string;
  descricao: string;
  data: string;
}

interface FinanceState {
  transacoes: Transaction[];
  adicionarTransacao: (transacao: Omit<Transaction, "id">) => void;
  removerTransacao: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transacoes: [],

      adicionarTransacao: (transacao) =>
        set((state) => ({
          transacoes: [
            { ...transacao, id: crypto.randomUUID() },
            ...state.transacoes,
          ],
        })),

      removerTransacao: (id) =>
        set((state) => ({
          transacoes: state.transacoes.filter((t) => t.id !== id),
        })),
    }),
    { name: "fin-app-storage" }
  )
);
