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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/app/actions/users";
import { InviteUserDialog } from "./invite-user-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
};

export function UserManagement({ users }: { users: Profile[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleRoleChange(userId: string, role: "admin" | "membro") {
    setLoading(userId);
    try {
      await updateUserRole(userId, role);
      toast.success("Role atualizado");
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar role");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium">Equipe</h2>
        <InviteUserDialog onUserInvited={() => router.refresh()} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(v: string | null) =>
                      v && handleRoleChange(user.id, v as "admin" | "membro")
                    }
                    disabled={loading === user.id}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="membro">Membro</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
