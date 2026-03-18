"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pipeline_stages")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}
