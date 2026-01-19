
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
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

type WithdrawalRequest = {
  id: string;
  userName: string;
  userEmail: string;
  amount: string;
  pixKey: string;
  date: string;
  status: 'pending' | 'completed' | 'rejected';
};

const WITHDRAWALS_KEY = "adengage-withdrawal-requests";


export default function AdminPage() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedRequests = localStorage.getItem(WITHDRAWALS_KEY);
      if (storedRequests) {
        setRequests(JSON.parse(storedRequests));
      } else {
        localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(initialRequests));
        setRequests(initialRequests);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      setRequests(initialRequests);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRequest = (id: string, action: "approve" | "reject") => {
    const request = requests.find((r) => r.id === id);
    if (!request) return;
    
    const newStatus = action === "approve" ? "completed" : "rejected";

    const updatedRequests = requests.map((r) =>
      r.id === id ? { ...r, status: newStatus } : r
    );

    try {
      localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(updatedRequests));
      setRequests(updatedRequests);
      toast({
        title: `Solicitação ${newStatus === "completed" ? "Aprovada" : "Rejeitada"}`,
        description: `O saque de ${request.amount} para ${request.userName} foi processado.`,
      });
    } catch (error) {
       console.error("Failed to update request:", error);
       toast({
           variant: "destructive",
           title: "Erro",
           description: "Não foi possível atualizar a solicitação.",
       });
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status === 'completed' || req.status === 'rejected');

  if (loading) {
     return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <TableHead>Chave PIX</TableHead>
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
                    <TableCell>{req.pixKey}</TableCell>
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
                  <TableCell colSpan={5} className="text-center">
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
                <TableHead>Chave PIX</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedRequests.length > 0 ? (
                processedRequests.sort((a, b) => new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime()).map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-medium">{req.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {req.userEmail}
                      </div>
                    </TableCell>
                    <TableCell>{req.pixKey}</TableCell>
                    <TableCell>{req.amount}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell className="text-right">
                       <Badge variant={req.status === 'completed' ? 'outline' : 'destructive'} className={req.status === 'completed' ? 'text-accent border-accent' : ''}>
                         {req.status === 'completed' ? 'Completo' : 'Rejeitado'}
                       </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
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
