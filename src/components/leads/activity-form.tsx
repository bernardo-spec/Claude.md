"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addActivity } from "@/app/actions/activities";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

const activityTypes = [
  { value: "note", label: "Nota" },
  { value: "call", label: "Ligação" },
  { value: "email", label: "E-mail" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "meeting", label: "Reunião" },
];

type ActivityFormProps = {
  leadId: string;
  onActivityAdded: () => void;
};

export function ActivityForm({ leadId, onActivityAdded }: ActivityFormProps) {
  const [type, setType] = useState("note");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await addActivity(leadId, type, content.trim());
      setContent("");
      toast.success("Atividade adicionada");
      onActivityAdded();
    } catch {
      toast.error("Erro ao adicionar atividade");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Select value={type} onValueChange={(v: string | null) => v && setType(v)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {activityTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Textarea
        placeholder="Descreva a atividade..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
      />
      <Button type="submit" size="sm" disabled={loading || !content.trim()}>
        {loading ? (
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
        ) : (
          <Send className="mr-2 h-3 w-3" />
        )}
        Adicionar
      </Button>
    </form>
  );
}
