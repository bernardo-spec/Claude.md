import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function IntegrationsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium">Integrações</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Slack</CardTitle>
            <CardDescription>
              Receba notificações quando leads mudam de etapa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Configure a variável de ambiente SLACK_WEBHOOK_URL para ativar.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">WhatsApp</CardTitle>
            <CardDescription>
              Links rápidos para contato via WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Já ativo. O botão de WhatsApp aparece nos cards com telefone.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Google Calendar</CardTitle>
            <CardDescription>
              Agende reuniões diretamente do CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Em breve.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Digital Manager Guru</CardTitle>
            <CardDescription>
              Sincronize pagamentos e assinaturas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Em breve.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
