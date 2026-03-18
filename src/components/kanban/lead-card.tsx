"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Phone } from "lucide-react";

type LeadCardProps = {
  lead: {
    id: string;
    nome: string;
    email: string | null;
    telefone: string | null;
    senioridade: string | null;
    plano_interesse: string | null;
    valor_estimado: number | null;
    profiles?: { id: string; full_name: string; avatar_url: string | null } | null;
  };
  index: number;
  onClick: () => void;
};

const senioridadeLabels: Record<string, string> = {
  junior: "Jr",
  pleno: "Pl",
  senior: "Sr",
  tech_lead: "TL",
  arquiteto: "Arq",
  cto: "CTO",
};

export function LeadCard({ lead, index, onClick }: LeadCardProps) {
  const initials = lead.profiles?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
        >
          <Card
            className={`cursor-pointer p-3 transition-shadow hover:shadow-md ${
              snapshot.isDragging ? "shadow-lg ring-2 ring-primary/20" : ""
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium leading-tight">{lead.nome}</p>
                {lead.profiles && (
                  <Avatar className="h-5 w-5 shrink-0">
                    <AvatarFallback className="text-[10px]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              {lead.email && (
                <p className="text-xs text-muted-foreground truncate">
                  {lead.email}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-1">
                {lead.senioridade && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {senioridadeLabels[lead.senioridade] || lead.senioridade}
                  </Badge>
                )}
                {lead.plano_interesse && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {lead.plano_interesse}
                  </Badge>
                )}
                {lead.valor_estimado && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    R$ {lead.valor_estimado.toLocaleString("pt-BR")}
                  </Badge>
                )}
              </div>

              {lead.telefone && (
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${lead.telefone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-green-600 hover:text-green-700"
                    title="Abrir WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`tel:${lead.telefone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted-foreground hover:text-foreground"
                    title="Ligar"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
