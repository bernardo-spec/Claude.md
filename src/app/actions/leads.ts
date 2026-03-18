"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getLeadsByStage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, pipeline_stages(*), profiles:assigned_to(id, full_name, avatar_url)")
    .order("position_in_stage", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getLeads(filters?: {
  search?: string;
  senioridade?: string;
  nivel_ingles?: string;
  plano_interesse?: string;
  assigned_to?: string;
  origem?: string;
  stage_id?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*, pipeline_stages(id, name, color), profiles:assigned_to(id, full_name)")
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }
  if (filters?.senioridade) {
    query = query.eq("senioridade", filters.senioridade);
  }
  if (filters?.nivel_ingles) {
    query = query.eq("nivel_ingles", filters.nivel_ingles);
  }
  if (filters?.plano_interesse) {
    query = query.eq("plano_interesse", filters.plano_interesse);
  }
  if (filters?.assigned_to) {
    query = query.eq("assigned_to", filters.assigned_to);
  }
  if (filters?.origem) {
    query = query.eq("origem", filters.origem);
  }
  if (filters?.stage_id) {
    query = query.eq("stage_id", filters.stage_id);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createLead(formData: {
  nome: string;
  email?: string;
  telefone?: string;
  origem?: string;
  senioridade?: string;
  stack_principal?: string;
  nivel_ingles?: string;
  plano_interesse?: string;
  notas?: string;
  assigned_to?: string;
  valor_estimado?: number | null;
}) {
  const supabase = await createClient();

  // Get the first stage (Lead Novo)
  const { data: firstStage } = await supabase
    .from("pipeline_stages")
    .select("id")
    .order("position", { ascending: true })
    .limit(1)
    .single();

  if (!firstStage) throw new Error("Nenhum estágio encontrado no pipeline");

  // Get max position in the first stage
  const { data: maxPos } = await supabase
    .from("leads")
    .select("position_in_stage")
    .eq("stage_id", firstStage.id)
    .order("position_in_stage", { ascending: false })
    .limit(1)
    .single();

  const position = (maxPos?.position_in_stage ?? -1) + 1;

  const leadData = {
    nome: formData.nome,
    email: formData.email || null,
    telefone: formData.telefone || null,
    origem: formData.origem || null,
    senioridade: formData.senioridade || null,
    stack_principal: formData.stack_principal || null,
    nivel_ingles: formData.nivel_ingles || null,
    plano_interesse: formData.plano_interesse || null,
    notas: formData.notas || null,
    assigned_to: formData.assigned_to || null,
    valor_estimado: formData.valor_estimado ?? null,
    stage_id: firstStage.id,
    position_in_stage: position,
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(leadData)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/pipeline");
  revalidatePath("/leads");
  return data;
}

export async function updateLead(
  id: string,
  updates: Record<string, unknown>
) {
  const supabase = await createClient();

  // Clean empty strings to null
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    cleaned[key] = value === "" ? null : value;
  }

  const { data, error } = await supabase
    .from("leads")
    .update(cleaned)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/pipeline");
  revalidatePath("/leads");
  return data;
}

export async function moveLead(
  leadId: string,
  newStageId: string,
  newPosition: number
) {
  const supabase = await createClient();

  // Get current lead data
  const { data: lead } = await supabase
    .from("leads")
    .select("stage_id, position_in_stage")
    .eq("id", leadId)
    .single();

  if (!lead) throw new Error("Lead não encontrado");

  const oldStageId = lead.stage_id;
  const oldPosition = lead.position_in_stage;

  if (oldStageId === newStageId) {
    // Moving within the same column
    if (oldPosition < newPosition) {
      // Moving down: shift items between old+1 and new up by 1
      await supabase.rpc("reorder_leads_in_stage", {
        p_stage_id: newStageId,
        p_start: oldPosition + 1,
        p_end: newPosition,
        p_delta: -1,
      });
    } else if (oldPosition > newPosition) {
      // Moving up: shift items between new and old-1 down by 1
      await supabase.rpc("reorder_leads_in_stage", {
        p_stage_id: newStageId,
        p_start: newPosition,
        p_end: oldPosition - 1,
        p_delta: 1,
      });
    }
  } else {
    // Moving to a different column
    // Close gap in old column
    await supabase.rpc("close_gap_in_stage", {
      p_stage_id: oldStageId,
      p_position: oldPosition,
    });

    // Make space in new column
    await supabase.rpc("make_space_in_stage", {
      p_stage_id: newStageId,
      p_position: newPosition,
    });
  }

  // Update the lead's stage and position
  const { error } = await supabase
    .from("leads")
    .update({
      stage_id: newStageId,
      position_in_stage: newPosition,
    })
    .eq("id", leadId);

  if (error) throw error;

  revalidatePath("/pipeline");
  revalidatePath("/leads");
}

export async function deleteLead(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/pipeline");
  revalidatePath("/leads");
}
