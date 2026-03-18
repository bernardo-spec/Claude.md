"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeadForm } from "./lead-form";
import { ActivityTimeline } from "./activity-timeline";
import { ActivityForm } from "./activity-form";
import { updateLead, deleteLead } from "@/app/actions/leads";
import { getActivities } from "@/app/actions/activities";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

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
};

type Stage = {
  id: string;
  name: string;
  color: string | null;
};

type Activity = {
  id: string;
  lead_id: string;
  user_id: string;
  type: string;
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  profiles?: { id: string; full_name: string } | null;
};

type Props = {
  lead: Lead | null;
  stages: Stage[];
  allUsers: { id: string; full_name: string }[];
  open: boolean;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
};

export function LeadDetailPanel({
  lead,
  stages,
  allUsers,
  open,
  onClose,
  onUpdate,
  onDelete,
}: Props) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const loadActivities = useCallback(async () => {
    if (!lead) return;
    try {
      const data = await getActivities(lead.id);
      setActivities(data as Activity[]);
    } catch {
      // ignore
    }
  }, [lead]);

  useEffect(() => {
    if (lead && open) {
      loadActivities();
    }
  }, [lead, open, loadActivities]);

  if (!lead) return null;

  const currentStage = stages.find((s) => s.id === lead.stage_id);

  async function handleUpdate(data: Record<string, unknown>) {
    try {
      const updated = await updateLead(lead!.id, data);
      onUpdate(updated as Lead);
      toast.success("Lead atualizado");
    } catch {
      toast.error("Erro ao atualizar lead");
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return;
    try {
      await deleteLead(lead!.id);
      onDelete(lead!.id);
      toast.success("Lead excluído");
    } catch {
      toast.error("Erro ao excluir lead");
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-hidden flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {lead.nome}
            {currentStage && (
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: currentStage.color || "#6b7280" }}
              >
                {currentStage.name}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex-1">
              Atividades
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4 pb-4">
                <LeadForm
                  defaultValues={{
                    nome: lead.nome,
                    email: lead.email || "",
                    telefone: lead.telefone || "",
                    origem: lead.origem || undefined,
                    senioridade: lead.senioridade || undefined,
                    stack_principal: lead.stack_principal || "",
                    nivel_ingles: lead.nivel_ingles || undefined,
                    plano_interesse: lead.plano_interesse || undefined,
                    notas: lead.notas || "",
                    assigned_to: lead.assigned_to || undefined,
                    valor_estimado: lead.valor_estimado,
                  }}
                  allUsers={allUsers}
                  onSubmit={handleUpdate}
                  submitLabel="Atualizar Lead"
                />

                <Separator />

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Lead
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="activities" className="flex-1 overflow-hidden flex flex-col">
            <div className="space-y-4 pb-2">
              <ActivityForm
                leadId={lead.id}
                onActivityAdded={loadActivities}
              />
            </div>
            <Separator />
            <ScrollArea className="flex-1 pr-4 pt-4">
              <ActivityTimeline activities={activities} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
