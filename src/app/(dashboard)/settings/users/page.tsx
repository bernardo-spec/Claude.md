import { getUsers } from "@/app/actions/users";
import { UserManagement } from "@/components/settings/user-management";

export default async function UsersSettingsPage() {
  const users = await getUsers();
  return <UserManagement users={users} />;
}
