"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/use-credits";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/use-transactions";

export default function WatchPage() {
  const { updateCredits } = useCredits();
  const { addTransaction } = useTransactions();
  const { toast } = useToast();

  const [cliques, setCliques] = useState(0);
  const totalNecessario = 3;
  const rewardAmount = 0.02;
  const adUrl = "https://otieu.com/4/10488966";

  const handleAnuncio = () => {
    const newWindow = window.open(adUrl, '_blank');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Pop-up foi bloqueado
      toast({
        variant: "destructive",
        title: "Pop-up Bloqueado",
        description: "Por favor, desative seu bloqueador de anúncios para completar a tarefa.",
      });
    } else {
      // Aumenta o contador de cliques
      setCliques(prev => prev + 1);
    }
  };

  const resgatarRecompensa = () => {
    if (cliques >= totalNecessario) {
      updateCredits(rewardAmount);
      addTransaction({ description: "Recompensa de Tarefa", amount: rewardAmount });
      toast({
        title: "Recompensa Resgatada!",
        description: `Parabéns! R$ ${rewardAmount.toFixed(2)} adicionados à sua carteira.`,
      });
      setCliques(0); // Reinicia para a próxima
    }
  };


  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
        <p className="text-muted-foreground">
          Complete a missão para ganhar sua recompensa.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center gap-8">
        <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold">Missão: Ganhe R$ {rewardAmount.toFixed(2)}</h3>
            <p className="text-muted-foreground">Anúncios vistos: {cliques} / {totalNecessario}</p>
        </div>
        
        {cliques < totalNecessario ? (
            <div className="flex flex-col items-center gap-2">
                <Button 
                  onClick={handleAnuncio}
                  size="lg"
                >
                  {cliques === 0 ? "Começar Tarefa" : "Ver Próximo Anúncio"}
                </Button>
                <p className="text-xs text-muted-foreground">Acesse a página, aguarde o site abrir e volte.</p>
            </div>
        ) : (
            <Button 
                onClick={resgatarRecompensa}
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 animate-bounce"
            >
                RESGATAR R$ {rewardAmount.toFixed(2)}
            </Button>
        )}
      </div>
    </div>
  );
}
