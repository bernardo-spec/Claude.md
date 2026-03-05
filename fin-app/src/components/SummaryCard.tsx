"use client";

import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  titulo: string;
  valor: number;
  icon: LucideIcon;
  cor: "green" | "red" | "blue";
}

const corMap = {
  green: "text-green-600",
  red: "text-red-600",
  blue: "text-blue-600",
};

export default function SummaryCard({
  titulo,
  valor,
  icon: Icon,
  cor,
}: SummaryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${
          cor === "green"
            ? "bg-green-100"
            : cor === "red"
              ? "bg-red-100"
              : "bg-blue-100"
        }`}
      >
        <Icon className={`h-6 w-6 ${corMap[cor]}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className={`text-xl font-bold ${corMap[cor]}`}>
          {valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>
    </div>
  );
}
