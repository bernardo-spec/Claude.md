"use client";

import { Wallet } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
        <Wallet className="h-7 w-7 text-emerald-600" />
        <h1 className="text-xl font-bold text-gray-800">fin-app</h1>
      </div>
    </header>
  );
}
