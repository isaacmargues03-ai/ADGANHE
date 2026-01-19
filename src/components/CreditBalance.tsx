"use client";

import { useCredits } from "@/hooks/use-credits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Loader2 } from "lucide-react";

export function CreditBalance() {
  const { credits, loading } = useCredits();

  const formattedCredits = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(credits ?? 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <div className="text-2xl font-bold">
            {formattedCredits}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Ganhe mais assistindo a anúncios
        </p>
      </CardContent>
    </Card>
  );
}
