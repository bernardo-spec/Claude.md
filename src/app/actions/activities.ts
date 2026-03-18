"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addActivity(
  leadId: string,
  type: string,
  content: string,
  metadata?: Record<string, unknown>
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const { data, error } = await supabase
    .from("lead_activities")
    .insert({
      lead_id: leadId,
      user_id: user.id,
      type,
      content,
      metadata: metadata ?? null,
    })
    .select("*, profiles:user_id(id, full_name)")
    .single();

  if (error) throw error;

  revalidatePath("/pipeline");
  return data;
}

export async function getActivities(leadId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lead_activities")
    .select("*, profiles:user_id(id, full_name)")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
