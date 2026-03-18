import { z } from "zod";

export const senioridadeOptions = [
  { value: "junior", label: "Júnior" },
  { value: "pleno", label: "Pleno" },
  { value: "senior", label: "Sênior" },
  { value: "tech_lead", label: "Tech Lead" },
  { value: "arquiteto", label: "Arquiteto" },
  { value: "cto", label: "CTO" },
] as const;

export const nivelInglesOptions = [
  { value: "basico", label: "Básico" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
  { value: "fluente", label: "Fluente" },
] as const;

export const planoInteresseOptions = [
  { value: "1.0", label: "Mentoria 1.0" },
  { value: "2.0", label: "Mentoria 2.0" },
] as const;

export const origemOptions = [
  "Instagram",
  "Indicação",
  "Google Ads",
  "Orgânico",
  "YouTube",
  "LinkedIn",
  "Outro",
] as const;

export const activityTypes = [
  { value: "note", label: "Nota" },
  { value: "call", label: "Ligação" },
  { value: "email", label: "E-mail" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "meeting", label: "Reunião" },
] as const;

// Zod schema for lead form
export const leadFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  telefone: z.string().optional().or(z.literal("")),
  origem: z.string().optional().or(z.literal("")),
  senioridade: z.string().optional().or(z.literal("")),
  stack_principal: z.string().optional().or(z.literal("")),
  nivel_ingles: z.string().optional().or(z.literal("")),
  plano_interesse: z.string().optional().or(z.literal("")),
  notas: z.string().optional().or(z.literal("")),
  assigned_to: z.string().optional().or(z.literal("")),
  valor_estimado: z.coerce.number().optional().nullable(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Activity form schema
export const activityFormSchema = z.object({
  type: z.enum(["note", "call", "email", "whatsapp", "meeting"]),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export type ActivityFormData = z.infer<typeof activityFormSchema>;

// Database row types
export type PipelineStage = {
  id: string;
  name: string;
  slug: string;
  position: number;
  color: string | null;
  is_closed_won: boolean;
  is_closed_lost: boolean;
  created_at: string;
};

export type Lead = {
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

export type LeadWithStage = Lead & {
  pipeline_stages: PipelineStage;
};

export type LeadActivity = {
  id: string;
  lead_id: string;
  user_id: string;
  type: string;
  content: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  profiles?: Profile;
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "membro";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};
