"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getUsers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function inviteUser(
  email: string,
  fullName: string,
  role: "admin" | "membro"
) {
  const supabase = await createClient();

  // Check if current user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Apenas administradores podem convidar usuários");
  }

  // Use admin client to create user
  const adminClient = createAdminClient();

  const tempPassword = Math.random().toString(36).slice(-12) + "A1!";

  const { data: newUser, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (createError) throw createError;

  // Update role if admin
  if (role === "admin" && newUser.user) {
    await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", newUser.user.id);
  }

  // Send password reset so user can set their own password
  await adminClient.auth.admin.generateLink({
    type: "recovery",
    email,
  });

  revalidatePath("/settings/users");
  return { tempPassword };
}

export async function updateUserRole(userId: string, role: "admin" | "membro") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    throw new Error("Apenas administradores podem alterar roles");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) throw error;

  revalidatePath("/settings/users");
}
