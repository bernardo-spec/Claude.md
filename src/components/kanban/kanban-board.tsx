"use client";

import { useState, useCallback } from "react";
import {
  DragDropContext,
  type DropResult,
} from "@hello-pangea/dnd";
import { KanbanColumn } from "./kanban-column";
import { LeadDetailPanel } from "../leads/lead-detail-panel";
import { moveLead } from "@/app/actions/leads";
import { toast } from "sonner";

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

type KanbanBoardProps = {
  stages: Stage[];
  initialLeads: Lead[];
  allUsers: { id: string; full_name: string }[];
};

export function KanbanBoard({ stages, initialLeads, allUsers }: KanbanBoardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const getLeadsByStage = useCallback(
    (stageId: string) =>
      leads
        .filter((l) => l.stage_id === stageId)
        .sort((a, b) => a.position_in_stage - b.position_in_stage),
    [leads]
  );

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      const { draggableId, source, destination } = result;

      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      // Optimistic update
      setLeads((prev) => {
        const updated = [...prev];
        const leadIndex = updated.findIndex((l) => l.id === draggableId);
        if (leadIndex === -1) return prev;

        const lead = { ...updated[leadIndex] };

        // Remove from source
        const sourceLeads = updated
          .filter((l) => l.stage_id === source.droppableId && l.id !== draggableId)
          .sort((a, b) => a.position_in_stage - b.position_in_stage);

        sourceLeads.forEach((l, i) => {
          const idx = updated.findIndex((u) => u.id === l.id);
          if (idx !== -1) updated[idx] = { ...updated[idx], position_in_stage: i };
        });

        // Insert into destination
        lead.stage_id = destination.droppableId;
        lead.position_in_stage = destination.index;
        updated[leadIndex] = lead;

        const destLeads = updated
          .filter(
            (l) => l.stage_id === destination.droppableId && l.id !== draggableId
          )
          .sort((a, b) => a.position_in_stage - b.position_in_stage);

        destLeads.splice(destination.index, 0, lead);
        destLeads.forEach((l, i) => {
          const idx = updated.findIndex((u) => u.id === l.id);
          if (idx !== -1) updated[idx] = { ...updated[idx], position_in_stage: i };
        });

        return updated;
      });

      // Server update
      try {
        await moveLead(draggableId, destination.droppableId, destination.index);
      } catch {
        toast.error("Erro ao mover lead. Recarregue a página.");
      }
    },
    []
  );

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex h-full gap-4 overflow-x-auto p-4">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stageId={stage.id}
              stageName={stage.name}
              stageColor={stage.color}
              leads={getLeadsByStage(stage.id)}
              onCardClick={(leadId) => setSelectedLeadId(leadId)}
            />
          ))}
        </div>
      </DragDropContext>

      <LeadDetailPanel
        lead={selectedLead}
        stages={stages}
        allUsers={allUsers}
        open={!!selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onUpdate={(updatedLead) => {
          setLeads((prev) =>
            prev.map((l) => (l.id === updatedLead.id ? { ...l, ...updatedLead } : l))
          );
        }}
        onDelete={(leadId) => {
          setLeads((prev) => prev.filter((l) => l.id !== leadId));
          setSelectedLeadId(null);
        }}
      />
    </>
  );
}
