"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clapperboard, Loader2 } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/use-transactions";

export default function WatchPage() {
  const adWatchTime = 20; // 20 seconds
  const rewardAmount = 0.02; // R$ 0,02
  const adUrl = "https://www.effectivegatecpm.com/u2kb7rcvi?key=1b2369148d1530ae3b0f8aa4f424c29a";

  const { updateCredits } = useCredits();
  const { addTransaction } = useTransactions();
  const { toast } = useToast();

  const [countdown, setCountdown] = useState<number>(adWatchTime);
  const [isWatching, setIsWatching] = useState(false);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    if (!isWatching || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isWatching, countdown]);

  useEffect(() => {
    if (isWatching && countdown === 0) {
      setIsWatching(false);
      setShowAd(false);
      updateCredits(rewardAmount);
      addTransaction({ description: "Recompensa de anúncio", amount: rewardAmount });
      toast({
        title: "Recompensa Recebida!",
        description: `Você ganhou R$ ${rewardAmount.toFixed(2)}.`,
      });
      // Reset for next watch
      setTimeout(() => setCountdown(adWatchTime), 1000);
    }
  }, [isWatching, countdown, updateCredits, toast, rewardAmount, addTransaction]);

  const handleStartReward = () => {
    setIsWatching(true);
    setShowAd(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
        <p className="text-muted-foreground">
          Clique no botão abaixo para ver um anúncio e iniciar o temporizador para ganhar sua recompensa.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center gap-8">
        <Button size="lg" onClick={handleStartReward} disabled={isWatching}>
          {isWatching ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Aguarde {countdown}s...</span>
            </>
          ) : (
            <>
              <Clapperboard className="mr-2 h-5 w-5" />
              <span>Ver Anúncio e Ganhar</span>
            </>
          )}
        </Button>
        
        {showAd && (
          <div className="w-full h-96 rounded-lg overflow-hidden border bg-muted">
            <iframe
              src={adUrl}
              title="Anúncio"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              onError={() => {
                toast({
                  variant: "destructive",
                  title: "Erro ao carregar anúncio",
                  description: "O provedor de anúncios pode não permitir a exibição em um frame.",
                });
                setShowAd(false);
                setIsWatching(false);
                setCountdown(adWatchTime);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
