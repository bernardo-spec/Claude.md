"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/leads/lead-form";
import { createLead } from "@/app/actions/leads";
import { toast } from "sonner";
import { Plus } from "lucide-react";

type NewLeadDialogProps = {
  allUsers: { id: string; full_name: string }[];
  onLeadCreated: () => void;
};

export function NewLeadDialog({ allUsers, onLeadCreated }: NewLeadDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(data: Record<string, unknown>) {
    try {
      await createLead(data as Parameters<typeof createLead>[0]);
      toast.success("Lead criado com sucesso");
      setOpen(false);
      onLeadCreated();
    } catch {
      toast.error("Erro ao criar lead");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="mr-2 h-4 w-4" />
        Novo Lead
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        <LeadForm
          allUsers={allUsers}
          onSubmit={handleSubmit}
          submitLabel="Criar Lead"
        />
      </DialogContent>
    </Dialog>
  );
}
