import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie as informações da sua conta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Em breve, você poderá editar os detalhes do seu perfil aqui.</p>
        </CardContent>
      </Card>
    </div>
  );
}
