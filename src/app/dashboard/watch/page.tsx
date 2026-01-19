"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clapperboard, Loader2 } from "lucide-react";
import { useCredits } from "@/hooks/use-credits";
import { useToast } from "@/hooks/use-toast";

export default function WatchPage() {
  const adWatchTime = 20; // 20 seconds
  const rewardAmount = 0.50; // R$ 0,50
  const adUrl = "https://www.effectivegatecpm.com/u2kb7rcvi?key=1b2369148d1530ae3b0f8aa4f424c29a";

  const { updateCredits } = useCredits();
  const { toast } = useToast();

  const [countdown, setCountdown] = useState<number>(adWatchTime);
  const [isWatching, setIsWatching] = useState(false);

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
      updateCredits(rewardAmount);
      toast({
        title: "Recompensa Recebida!",
        description: `Você ganhou R$ ${rewardAmount.toFixed(2)}.`,
      });
      // Reset for next watch
      setTimeout(() => setCountdown(adWatchTime), 1000);
    }
  }, [isWatching, countdown, updateCredits, toast, rewardAmount]);

  const handleStartReward = () => {
    window.open(adUrl, '_blank', 'noopener,noreferrer');
    setIsWatching(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
        <p className="text-muted-foreground">
          Clique no botão para ver o anúncio e iniciar o temporizador para ganhar sua recompensa.
        </p>
      </div>

      <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Button size="lg" onClick={handleStartReward} disabled={isWatching}>
          {isWatching ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Aguarde {countdown}s...</span>
            </>
          ) : (
            <>
              <Clapperboard className="mr-2 h-5 w-5" />
              <span>Ver Anúncio</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
