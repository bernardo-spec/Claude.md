import { getStages } from "@/app/actions/stages";
import { getLeadsByStage } from "@/app/actions/leads";
import { getUsers } from "@/app/actions/users";
import { PipelineClient } from "./pipeline-client";

export default async function PipelinePage() {
  const [stages, leads, users] = await Promise.all([
    getStages(),
    getLeadsByStage(),
    getUsers(),
  ]);

  const allUsers = users.map((u) => ({ id: u.id, full_name: u.full_name }));

  return <PipelineClient stages={stages} initialLeads={leads} allUsers={allUsers} />;
}
