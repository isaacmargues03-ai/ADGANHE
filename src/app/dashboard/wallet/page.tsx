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
import { ArrowDown, ArrowUp, Banknote, Loader2 } from "lucide-react";
import { useState } from "react";
import { useUser, useFirestore } from "@/firebase";
import { useCredits } from "@/hooks/use-credits";
import { useTransactions } from "@/hooks/use-transactions";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function WalletPage() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [amount, setAmount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const { credits, updateCredits, loading: creditsLoading } = useCredits();
  const { transactions, addTransaction, loading: transactionsLoading } = useTransactions();

  const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || credits === null || !firestore) return;

    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount < 2) {
      toast({
        variant: "destructive",
        title: "Valor Inválido",
        description: "O valor mínimo para saque é de R$ 2,00.",
      });
      return;
    }

    if (!pixKey) {
        toast({
            variant: "destructive",
            title: "Chave PIX Inválida",
            description: "Por favor, insira sua chave PIX.",
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

    const newRequest = {
      userId: user.uid,
      userName: user.displayName || user.email || "Usuário Anônimo",
      userEmail: user.email || "Não informado",
      amount: withdrawAmount,
      pixKey: pixKey,
      status: 'pending' as const,
      createdAt: serverTimestamp(),
    };

    try {
      const requestsCollection = collection(firestore, 'withdrawalRequests');
      await addDoc(requestsCollection, newRequest);

      updateCredits(-withdrawAmount);
      addTransaction({ description: "Solicitação de saque", amount: -withdrawAmount });
      setAmount("");
      setPixKey("");
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
                    <CardDescription>O valor mínimo para saque é de R$ 2,00. Insira sua chave PIX.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                     <Input 
                      type="text" 
                      placeholder="Sua chave PIX" 
                      required 
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      disabled={isWithdrawing || creditsLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isWithdrawing || creditsLoading || !amount || !pixKey}>
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
          {transactionsLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length > 0 ? (
            transactions.map((txn) => (
              <div key={txn.id} className="flex items-center">
                <div
                  className={`p-2 rounded-full mr-3 ${
                    txn.amount >= 0
                      ? "bg-accent/20 text-accent"
                      : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {txn.amount >= 0 ? (
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
                    txn.amount >= 0
                      ? "text-accent"
                      : "text-destructive"
                  }`}
                >
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(txn.amount)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-10">
              Nenhuma transação encontrada.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
