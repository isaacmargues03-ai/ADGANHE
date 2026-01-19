"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";
import { useToast } from "@/hooks/use-toast";
import { useTransactions } from "@/hooks/use-transactions";

export default function WatchPage() {
  const adWatchTime = 20;
  const rewardAmount = 0.02;
  const adUrl = "https://otieu.com/4/10488966";

  const { updateCredits } = useCredits();
  const { addTransaction } = useTransactions();
  const { toast } = useToast();

  const [adOpened, setAdOpened] = useState(false);
  const [countdown, setCountdown] = useState(adWatchTime);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (adOpened && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (adOpened && countdown === 0) {
      setCanClaim(true);
    }
    return () => clearTimeout(timer);
  }, [adOpened, countdown]);

  const handleOpenAd = () => {
    setAdOpened(true);
  };

  const handleClaimReward = () => {
    updateCredits(rewardAmount);
    addTransaction({ description: "Recompensa de anúncio", amount: rewardAmount });
    toast({
      title: "Recompensa Coletada!",
      description: `Você ganhou R$ ${rewardAmount.toFixed(2)}.`,
    });
    // Reset state
    setAdOpened(false);
    setCountdown(adWatchTime);
    setCanClaim(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
        <p className="text-muted-foreground">
          Siga os passos abaixo para ganhar sua recompensa.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center gap-8">
        {!adOpened ? (
          <>
            <p className="text-muted-foreground">Passo 1: Abra o anúncio em uma nova aba.</p>
            <Button asChild size="lg">
              <a href={adUrl} target="_blank" rel="noopener noreferrer" onClick={handleOpenAd}>
                ABRIR ANÚNCIO
              </a>
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">Passo 2: Aguarde o tempo acabar e colete sua recompensa.</p>
             <div className="flex items-center gap-2 text-2xl font-bold">
               {canClaim ? (
                 <span>Pode coletar!</span>
               ) : (
                 <>
                   <Loader2 className="h-6 w-6 animate-spin" />
                   <span>Aguarde {countdown}s...</span>
                 </>
               )}
            </div>
            <Button size="lg" onClick={handleClaimReward} disabled={!canClaim}>
              COLETAR RECOMPENSA
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
