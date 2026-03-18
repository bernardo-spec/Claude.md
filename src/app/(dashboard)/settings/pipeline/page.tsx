import { getStages } from "@/app/actions/stages";

export default async function PipelineSettingsPage() {
  const stages = await getStages();

  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium">Etapas do Pipeline</h2>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-2 text-left text-sm font-medium">Ordem</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Nome</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Cor</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => (
              <tr key={stage.id} className="border-b">
                <td className="px-4 py-2 text-sm">{stage.position + 1}</td>
                <td className="px-4 py-2 text-sm font-medium">{stage.name}</td>
                <td className="px-4 py-2">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: stage.color || "#6b7280" }}
                  />
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {stage.is_closed_won
                    ? "Ganho"
                    : stage.is_closed_lost
                    ? "Perdido"
                    : "Aberto"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        A edição de etapas estará disponível em breve.
      </p>
    </div>
  );
}
