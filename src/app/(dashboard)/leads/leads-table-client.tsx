"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils/format";
import { Search } from "lucide-react";

type Lead = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  senioridade: string | null;
  nivel_ingles: string | null;
  plano_interesse: string | null;
  origem: string | null;
  created_at: string;
  pipeline_stages?: { id: string; name: string; color: string | null } | null;
  profiles?: { id: string; full_name: string } | null;
};

type Stage = {
  id: string;
  name: string;
  color: string | null;
};

type Props = {
  initialLeads: Lead[];
  stages: Stage[];
  allUsers: { id: string; full_name: string }[];
};

const senioridadeLabels: Record<string, string> = {
  junior: "Júnior",
  pleno: "Pleno",
  senior: "Sênior",
  tech_lead: "Tech Lead",
  arquiteto: "Arquiteto",
  cto: "CTO",
};

export function LeadsTableClient({ initialLeads }: Props) {
  const [search, setSearch] = useState("");

  const filtered = initialLeads.filter((lead) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      lead.nome.toLowerCase().includes(q) ||
      (lead.email?.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Leads</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="w-64 pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Senioridade</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhum lead encontrado
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.nome}</TableCell>
                  <TableCell>{lead.email || "—"}</TableCell>
                  <TableCell>
                    {lead.pipeline_stages && (
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: lead.pipeline_stages.color || undefined,
                          color: lead.pipeline_stages.color ? "#fff" : undefined,
                        }}
                      >
                        {lead.pipeline_stages.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.senioridade
                      ? senioridadeLabels[lead.senioridade] || lead.senioridade
                      : "—"}
                  </TableCell>
                  <TableCell>{lead.plano_interesse || "—"}</TableCell>
                  <TableCell>{lead.origem || "—"}</TableCell>
                  <TableCell>
                    {lead.profiles?.full_name || "—"}
                  </TableCell>
                  <TableCell>{formatDate(lead.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
