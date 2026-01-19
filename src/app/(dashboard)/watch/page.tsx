"use client";

import { useState } from "react";
import { AdCard } from "@/components/AdCard";
import { adOpportunities } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdPlayer } from "@/components/AdPlayer";
import { useCredits } from "@/hooks/use-credits";
import { useToast } from "@/hooks/use-toast";

type AdOpportunity = (typeof adOpportunities)[0];

export default function WatchPage() {
  const [selectedAd, setSelectedAd] = useState<AdOpportunity | null>(null);
  const { updateCredits } = useCredits();
  const { toast } = useToast();

  const handleWatch = (ad: AdOpportunity) => {
    setSelectedAd(ad);
  };

  const handleCompleteAd = () => {
    if (selectedAd) {
      updateCredits(selectedAd.reward);
      toast({
        title: "Recompensa Resgatada!",
        description: `Você ganhou ${selectedAd.reward} créditos.`,
      });
      setSelectedAd(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
          <p className="text-muted-foreground">
            Complete as visualizações de anúncios para ganhar créditos.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adOpportunities.map((ad) => (
            <AdCard
              key={ad.id}
              title={ad.title}
              description={ad.description}
              reward={ad.reward}
              onWatch={() => handleWatch(ad)}
            />
          ))}
        </div>
      </div>
      <Dialog open={!!selectedAd} onOpenChange={() => setSelectedAd(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedAd?.title}</DialogTitle>
          </DialogHeader>
          {selectedAd && (
            <AdPlayer
              duration={selectedAd.duration}
              imageUrl={selectedAd.image}
              onComplete={handleCompleteAd}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
