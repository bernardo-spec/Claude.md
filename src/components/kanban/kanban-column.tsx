"use client";

import { Droppable } from "@hello-pangea/dnd";
import { LeadCard } from "./lead-card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Lead = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  senioridade: string | null;
  plano_interesse: string | null;
  valor_estimado: number | null;
  position_in_stage: number;
  profiles?: { id: string; full_name: string; avatar_url: string | null } | null;
};

type KanbanColumnProps = {
  stageId: string;
  stageName: string;
  stageColor: string | null;
  leads: Lead[];
  onCardClick: (leadId: string) => void;
};

export function KanbanColumn({
  stageId,
  stageName,
  stageColor,
  leads,
  onCardClick,
}: KanbanColumnProps) {
  return (
    <div className="flex h-full w-72 shrink-0 flex-col rounded-lg bg-muted/50">
      <div className="flex items-center gap-2 p-3 pb-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: stageColor || "#6b7280" }}
        />
        <h3 className="text-sm font-semibold">{stageName}</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {leads.length}
        </span>
      </div>

      <Droppable droppableId={stageId}>
        {(provided, snapshot) => (
          <ScrollArea className="flex-1">
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[100px] space-y-2 p-2 transition-colors ${
                snapshot.isDraggingOver ? "bg-primary/5" : ""
              }`}
            >
              {leads.map((lead, index) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  index={index}
                  onClick={() => onCardClick(lead.id)}
                />
              ))}
              {provided.placeholder}
            </div>
          </ScrollArea>
        )}
      </Droppable>
    </div>
  );
}
