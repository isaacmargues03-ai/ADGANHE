"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/hooks/use-credits";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/use-transactions";
import { Loader2 } from "lucide-react";

export default function WatchPage() {
  const { updateCredits } = useCredits();
  const { addTransaction } = useTransactions();
  const { toast } = useToast();

  const [cliques, setCliques] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ultimoClique, setUltimoClique] = useState<number | null>(null);
  const [adWindowOpened, setAdWindowOpened] = useState(false);

  const totalNecessario = 5;
  const rewardAmount = 0.02;
  const adUrl = "https://otieu.com/4/10488966";
  const adWaitTime = 15; // seconds

  // Efeito para verificar o tempo quando o usuário volta para a aba
  useEffect(() => {
    if (!adWindowOpened || !ultimoClique) return;

    const handleFocus = () => {
      const agora = Date.now();
      const tempoPassado = (agora - ultimoClique) / 1000; // em segundos

      if (tempoPassado >= adWaitTime) {
        setCliques(prev => {
          const newCliques = prev + 1;
          toast({
            title: "Anúncio Validado!",
            description: `Progresso da Missão: ${newCliques} de ${totalNecessario}.`,
          });
          return newCliques;
        });
      } else {
        toast({
          variant: "destructive",
          title: "Muito Rápido!",
          description: `Você precisa ver o anúncio por pelo menos ${adWaitTime}s. Faltam ${Math.ceil(adWaitTime - tempoPassado)}s.`,
        });
      }
      
      // Limpa o estado e o listener
      setAdWindowOpened(false);
      setUltimoClique(null);
      window.removeEventListener('focus', handleFocus);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [adWindowOpened, ultimoClique, toast, totalNecessario, adWaitTime]);

  const handleAnuncio = () => {
    // Não faz nada se já estivermos aguardando uma verificação
    if (adWindowOpened) return;

    // Salva o horário do clique e abre o anúncio
    setUltimoClique(Date.now());
    const newWindow = window.open(adUrl, '_blank');
    
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      toast({
        variant: "destructive",
        title: "Pop-up Bloqueado",
        description: "Por favor, desative seu bloqueador de anúncios para completar a tarefa.",
      });
      setUltimoClique(null); // Reseta se a janela não abrir
    } else {
      // Define que estamos aguardando o usuário voltar
      setAdWindowOpened(true);
    }
  };

  const resgatarRecompensa = () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      if (cliques >= totalNecessario) {
        updateCredits(rewardAmount);
        addTransaction({ description: "Recompensa de Tarefa", amount: rewardAmount });
        toast({
          title: "Recompensa Resgatada!",
          description: `Parabéns! R$ ${rewardAmount.toFixed(2)} adicionados à sua carteira.`,
        });
        setCliques(0);
      }
    } catch (error) {
        console.error("Erro ao resgatar recompensa:", error);
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível resgatar a recompensa.",
        });
    } finally {
      setTimeout(() => setIsProcessing(false), 2000);
    }
  };
  
  const isBusy = adWindowOpened;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
        <p className="text-muted-foreground">
          Complete a missão para ganhar sua recompensa.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center gap-8 md:p-12">
        <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold">Missão: Ganhe R$ {rewardAmount.toFixed(2)}</h3>
            <p className="text-muted-foreground">Anúncios vistos: {cliques} / {totalNecessario}</p>
        </div>
        
        {cliques < totalNecessario ? (
            <div className="flex flex-col items-center gap-4">
                <Button 
                  onClick={handleAnuncio}
                  size="lg"
                  disabled={isBusy || isProcessing}
                >
                   {isBusy
                    ? "Volte para validar o anúncio..."
                    : (cliques === 0 ? "Começar Tarefa" : "Ver Próximo Anúncio")
                  }
                </Button>
                <div className="text-center">
                    <p className="text-xs text-muted-foreground">Acesse a página, aguarde o site abrir e volte.</p>
                    <p className="text-lg font-bold text-destructive mt-2">PROIBIDO ANTI ADS</p>
                </div>
            </div>
        ) : (
            <Button 
                onClick={resgatarRecompensa}
                size="lg"
                disabled={isProcessing}
                className="bg-accent text-accent-foreground hover:bg-accent/90 animate-bounce"
            >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  `RESGATAR R$ ${rewardAmount.toFixed(2)}`
                )}
            </Button>
        )}
      </div>
    </div>
  );
}
