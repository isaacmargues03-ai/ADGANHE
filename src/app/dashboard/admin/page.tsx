
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { withdrawalRequests as initialRequests } from "@/lib/data";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export default function AdminPage() {
  const [requests, setRequests] = useState(initialRequests);
  const { toast } = useToast();

  const handleRequest = (id: string, action: "approve" | "reject") => {
    const request = requests.find((r) => r.id === id);
    if (!request) return;
    
    // Here you would typically call an API to process the request.
    // For this example, we'll just update the local state.
    
    setRequests((prev) =>
      prev.filter((r) => r.id !== id)
    );

    toast({
      title: `Solicitação ${action === "approve" ? "Aprovada" : "Rejeitada"}`,
      description: `O saque de ${request.amount} para ${request.userName} foi processado.`,
    });
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const completedRequests = requests.filter(req => req.status === 'completed');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Painel do Administrador</h1>
        <p className="text-muted-foreground">
          Gerencie as solicitações de saque dos usuários.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações Pendentes</CardTitle>
          <CardDescription>
            Aprove ou rejeite as solicitações de saque pendentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-medium">{req.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {req.userEmail}
                      </div>
                    </TableCell>
                    <TableCell>{req.amount}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-accent"
                        onClick={() => handleRequest(req.id, "approve")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprovar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleRequest(req.id, "reject")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeitar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhuma solicitação pendente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Saques</CardTitle>
           <CardDescription>
            Visualize as solicitações de saque já processadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedRequests.length > 0 ? (
                completedRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-medium">{req.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {req.userEmail}
                      </div>
                    </TableCell>
                    <TableCell>{req.amount}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell className="text-right">
                       <Badge variant="outline" className="text-accent border-accent">Completo</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Nenhum saque processado ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
