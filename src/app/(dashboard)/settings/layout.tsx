import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/pipeline");
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-semibold">Configurações</h1>
      <nav className="mb-6 flex gap-4 border-b pb-2">
        <Link
          href="/settings/users"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Usuários
        </Link>
        <Link
          href="/settings/pipeline"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Pipeline
        </Link>
        <Link
          href="/settings/integrations"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Integrações
        </Link>
      </nav>
      {children}
    </div>
  );
}
