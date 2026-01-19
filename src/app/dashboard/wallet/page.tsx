"use client";

import { CreditBalance } from "@/components/CreditBalance";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { transactionHistory, withdrawalRequests as initialRequests } from "@/lib/data";
import { ArrowDown, ArrowUp, Banknote, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@/firebase";
import { useCredits } from "@/hooks/use-credits";

type WithdrawalRequest = {
  id: string;
  userName: string;
  userEmail: string;
  amount: string;
  date: string;
  status: 'pending' | 'completed' | 'rejected';
};

const WITHDRAWALS_KEY = "adengage-withdrawal-requests";

export default function WalletPage() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const { user } = useUser();
  const { credits, updateCredits, loading: creditsLoading } = useCredits();

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedRequests = localStorage.getItem(WITHDRAWALS_KEY);
        if (storedRequests === null) {
            localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(initialRequests));
        }
    }
  }, []);


  const handleWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || credits === null) return;

    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount < 2) {
      toast({
        variant: "destructive",
        title: "Valor Inválido",
        description: "O valor mínimo para saque é de R$ 2,00.",
      });
      return;
    }

    if (withdrawAmount > credits) {
      toast({
        variant: "destructive",
        title: "Saldo Insuficiente",
        description: "Você não tem créditos suficientes para este saque.",
      });
      return;
    }

    setIsWithdrawing(true);

    const newRequest: WithdrawalRequest = {
      id: `req${Date.now()}`,
      userName: user.displayName || user.email || "Usuário Anônimo",
      userEmail: user.email || "Não informado",
      amount: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(withdrawAmount),
      date: new Intl.DateTimeFormat('pt-BR').format(new Date()),
      status: 'pending',
    };

    try {
      const storedRequests = localStorage.getItem(WITHDRAWALS_KEY);
      const requests = storedRequests ? JSON.parse(storedRequests) : [];
      const updatedRequests = [newRequest, ...requests];
      localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(updatedRequests));

      updateCredits(-withdrawAmount);
      setAmount("");
      toast({
        title: "Saque Solicitado",
        description: "Sua solicitação foi recebida e está sendo processada.",
      });
    } catch (error) {
      console.error("Failed to process withdrawal:", error);
      toast({
          variant: "destructive",
          title: "Erro ao Processar",
          description: "Não foi possível processar sua solicitação. Tente novamente.",
      });
    } finally {
        setIsWithdrawing(false);
    }
  };
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minha Carteira</h1>
          <p className="text-muted-foreground">
            Gerencie seus créditos e saques.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            <CreditBalance />
            <Card>
              <form onSubmit={handleWithdraw}>
                <CardHeader>
                    <CardTitle>Sacar Créditos</CardTitle>
                    <CardDescription>O valor mínimo para saque é de R$ 2,00.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Input 
                      type="number" 
                      placeholder="ex: 2.00" 
                      required 
                      min="2" 
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isWithdrawing || creditsLoading}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isWithdrawing || creditsLoading || !amount}>
                        {isWithdrawing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Banknote className="mr-2 h-4 w-4" />}
                        Solicitar Saque
                    </Button>
                </CardFooter>
              </form>
            </Card>
        </div>
      </div>

      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {transactionHistory.map((txn) => (
            <div key={txn.id} className="flex items-center">
              <div
                className={`p-2 rounded-full mr-3 ${
                  txn.amount.startsWith("+")
                    ? "bg-accent/20 text-accent"
                    : "bg-destructive/20 text-destructive"
                }`}
              >
                {txn.amount.startsWith("+") ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{txn.description}</p>
                <p className="text-xs text-muted-foreground">{txn.date}</p>
              </div>
              <p
                className={`font-semibold text-sm ${
                  txn.amount.startsWith("+")
                    ? "text-accent"
                    : "text-destructive"
                }`}
              >
                {txn.amount}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
