"use client";

import { useState, useMemo } from "react";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { KanbanFilters } from "@/components/kanban/kanban-filters";
import { NewLeadDialog } from "@/components/kanban/new-lead-dialog";
import { useRouter } from "next/navigation";

type Stage = {
  id: string;
  name: string;
  slug: string;
  position: number;
  color: string | null;
  is_closed_won: boolean;
  is_closed_lost: boolean;
};

type Lead = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  origem: string | null;
  senioridade: string | null;
  stack_principal: string | null;
  nivel_ingles: string | null;
  plano_interesse: string | null;
  notas: string | null;
  stage_id: string;
  position_in_stage: number;
  assigned_to: string | null;
  valor_estimado: number | null;
  motivo_perda: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { id: string; full_name: string; avatar_url: string | null } | null;
};

type Props = {
  stages: Stage[];
  initialLeads: Lead[];
  allUsers: { id: string; full_name: string }[];
};

export function PipelineClient({ stages, initialLeads, allUsers }: Props) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    senioridade: "",
    nivel_ingles: "",
    plano_interesse: "",
    assigned_to: "",
  });

  const filteredLeads = useMemo(() => {
    return initialLeads.filter((lead) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !lead.nome.toLowerCase().includes(q) &&
          !(lead.email?.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      if (filters.senioridade && lead.senioridade !== filters.senioridade) return false;
      if (filters.nivel_ingles && lead.nivel_ingles !== filters.nivel_ingles) return false;
      if (filters.plano_interesse && lead.plano_interesse !== filters.plano_interesse) return false;
      if (filters.assigned_to && lead.assigned_to !== filters.assigned_to) return false;
      return true;
    });
  }, [initialLeads, filters]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h1 className="text-lg font-semibold">Pipeline</h1>
        <div className="flex items-center gap-3">
          <KanbanFilters
            filters={filters}
            onFiltersChange={setFilters}
            allUsers={allUsers}
          />
          <NewLeadDialog
            allUsers={allUsers}
            onLeadCreated={() => router.refresh()}
          />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          stages={stages}
          initialLeads={filteredLeads}
          allUsers={allUsers}
        />
      </div>
    </div>
  );
}
