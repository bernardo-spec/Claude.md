"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { z } from "zod";

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

const origemOptions = [
  "Instagram",
  "Indicação",
  "Google Ads",
  "Orgânico",
  "YouTube",
  "LinkedIn",
  "Outro",
];

const leadFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().optional(),
  telefone: z.string().optional(),
  origem: z.string().optional(),
  senioridade: z.string().optional(),
  stack_principal: z.string().optional(),
  nivel_ingles: z.string().optional(),
  plano_interesse: z.string().optional(),
  notas: z.string().optional(),
  assigned_to: z.string().optional(),
  valor_estimado: z.union([z.coerce.number(), z.literal(""), z.null()]).optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

type LeadFormProps = {
  defaultValues?: Partial<LeadFormData>;
  allUsers?: { id: string; full_name: string }[];
  onSubmit: (data: LeadFormData) => Promise<void>;
  submitLabel?: string;
};

export function LeadForm({
  defaultValues,
  allUsers = [],
  onSubmit,
  submitLabel = "Salvar",
}: LeadFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leadFormSchema) as any,
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      origem: "",
      senioridade: "",
      stack_principal: "",
      nivel_ingles: "",
      plano_interesse: "",
      notas: "",
      assigned_to: "",
      valor_estimado: null,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome *</Label>
        <Input id="nome" {...register("nome")} />
        {errors.nome && (
          <p className="text-xs text-destructive">{errors.nome.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...register("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" {...register("telefone")} placeholder="+5511999999999" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Senioridade</Label>
          <Select
            value={watch("senioridade") || ""}
            onValueChange={(v: string | null) => setValue("senioridade", v || "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {senioridadeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Nível de Inglês</Label>
          <Select
            value={watch("nivel_ingles") || ""}
            onValueChange={(v: string | null) => setValue("nivel_ingles", v || "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {nivelInglesOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Origem</Label>
          <Select
            value={watch("origem") || ""}
            onValueChange={(v: string | null) => setValue("origem", v || "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {origemOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Plano de Interesse</Label>
          <Select
            value={watch("plano_interesse") || ""}
            onValueChange={(v: string | null) => setValue("plano_interesse", v || "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {planoOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stack_principal">Stack Principal</Label>
        <Input
          id="stack_principal"
          {...register("stack_principal")}
          placeholder="React, Node.js, Python..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valor_estimado">Valor Estimado (R$)</Label>
          <Input
            id="valor_estimado"
            type="number"
            step="0.01"
            {...register("valor_estimado")}
          />
        </div>
        <div className="space-y-2">
          <Label>Responsável</Label>
          <Select
            value={watch("assigned_to") || ""}
            onValueChange={(v: string | null) => setValue("assigned_to", v || "")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Nenhum" />
            </SelectTrigger>
            <SelectContent>
              {allUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notas">Notas</Label>
        <Textarea id="notas" rows={3} {...register("notas")} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
