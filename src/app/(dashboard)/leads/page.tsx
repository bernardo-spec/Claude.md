import { getLeads } from "@/app/actions/leads";
import { getStages } from "@/app/actions/stages";
import { getUsers } from "@/app/actions/users";
import { LeadsTableClient } from "./leads-table-client";

export default async function LeadsPage() {
  const [leads, stages, users] = await Promise.all([
    getLeads(),
    getStages(),
    getUsers(),
  ]);

  return (
    <LeadsTableClient
      initialLeads={leads}
      stages={stages}
      allUsers={users.map((u) => ({ id: u.id, full_name: u.full_name }))}
    />
  );
}
