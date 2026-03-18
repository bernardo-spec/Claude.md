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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inviteUser } from "@/app/actions/users";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

export function InviteUserDialog({
  onUserInvited,
}: {
  onUserInvited: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"admin" | "membro">("membro");
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await inviteUser(email, fullName, role);
      setTempPassword(result.tempPassword);
      toast.success("Usuário convidado com sucesso");
      onUserInvited();
    } catch {
      toast.error("Erro ao convidar usuário");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setEmail("");
    setFullName("");
    setRole("membro");
    setTempPassword("");
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : handleClose())}>
      <DialogTrigger render={<Button size="sm" />}>
        <UserPlus className="mr-2 h-4 w-4" />
        Convidar Usuário
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Usuário</DialogTitle>
        </DialogHeader>

        {tempPassword ? (
          <div className="space-y-4">
            <p className="text-sm">
              Usuário criado! Compartilhe a senha temporária:
            </p>
            <div className="rounded-md bg-muted p-3 font-mono text-sm">
              {tempPassword}
            </div>
            <p className="text-xs text-muted-foreground">
              O usuário deve trocar a senha no primeiro acesso.
            </p>
            <Button onClick={handleClose} className="w-full">
              Fechar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">E-mail</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v: string | null) => v && setRole(v as "admin" | "membro")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="membro">Membro</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Convidar
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
