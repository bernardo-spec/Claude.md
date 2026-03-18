"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

type Filters = {
  search: string;
  senioridade: string;
  nivel_ingles: string;
  plano_interesse: string;
  assigned_to: string;
};

type KanbanFiltersProps = {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  allUsers: { id: string; full_name: string }[];
};

const senioridadeOptions = [
  { value: "junior", label: "Júnior" },
  { value: "pleno", label: "Pleno" },
  { value: "senior", label: "Sênior" },
  { value: "tech_lead", label: "Tech Lead" },
  { value: "arquiteto", label: "Arquiteto" },
  { value: "cto", label: "CTO" },
];

const nivelInglesOptions = [
  { value: "basico", label: "Básico" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
  { value: "fluente", label: "Fluente" },
];

const planoOptions = [
  { value: "1.0", label: "Mentoria 1.0" },
  { value: "2.0", label: "Mentoria 2.0" },
];

const NONE = "__none__";

export function KanbanFilters({
  filters,
  onFiltersChange,
  allUsers,
}: KanbanFiltersProps) {
  const hasFilters =
    filters.search ||
    filters.senioridade ||
    filters.nivel_ingles ||
    filters.plano_interesse ||
    filters.assigned_to;

  function clearFilters() {
    onFiltersChange({
      search: "",
      senioridade: "",
      nivel_ingles: "",
      plano_interesse: "",
      assigned_to: "",
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar leads..."
          className="w-52 pl-8"
          value={filters.search}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
        />
      </div>

      <Select
        value={filters.senioridade || NONE}
        onValueChange={(v: string | null) =>
          onFiltersChange({ ...filters, senioridade: !v || v === NONE ? "" : v })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Senioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>Todas</SelectItem>
          {senioridadeOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.nivel_ingles || NONE}
        onValueChange={(v: string | null) =>
          onFiltersChange({ ...filters, nivel_ingles: !v || v === NONE ? "" : v })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Inglês" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>Todos</SelectItem>
          {nivelInglesOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.plano_interesse || NONE}
        onValueChange={(v: string | null) =>
          onFiltersChange({ ...filters, plano_interesse: !v || v === NONE ? "" : v })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Plano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>Todos</SelectItem>
          {planoOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.assigned_to || NONE}
        onValueChange={(v: string | null) =>
          onFiltersChange({ ...filters, assigned_to: !v || v === NONE ? "" : v })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Responsável" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>Todos</SelectItem>
          {allUsers.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="mr-1 h-3 w-3" />
          Limpar
        </Button>
      )}
    </div>
  );
}
