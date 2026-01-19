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
import { transactionHistory } from "@/lib/data";
import { ArrowDown, ArrowUp, Banknote, Loader2 } from "lucide-react";
import { useState } from "react";

export default function WalletPage() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  const handleWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsWithdrawing(true);
    // Simulate API call
    setTimeout(() => {
      setIsWithdrawing(false);
      toast({
        title: "Saque Iniciado",
        description:
          "Sua solicitação foi recebida e está sendo processada.",
      });
    }, 2000);
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
            <Card as="form" onSubmit={handleWithdraw}>
                <CardHeader>
                    <CardTitle>Sacar Créditos</CardTitle>
                    <CardDescription>Digite o valor para sacar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Input type="number" placeholder="ex: 500" required />
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled={isWithdrawing}>
                        {isWithdrawing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Banknote className="mr-2 h-4 w-4" />}
                        Solicitar Saque
                    </Button>
                </CardFooter>
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
