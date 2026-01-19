"use client";

import { Button } from "@/components/ui/button";
import { Clapperboard } from "lucide-react";

export default function WatchPage() {

  const adUrl = "https://www.effectivegatecpm.com/u2kb7rcvi?key=1b2369148d1530ae3b0f8aa4f424c29a";

  const handleWatchAd = () => {
    window.open(adUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
        <p className="text-muted-foreground">
          Clique no botão abaixo para ver um anúncio e ganhar recompensas.
        </p>
      </div>

      <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Button size="lg" onClick={handleWatchAd}>
          <Clapperboard className="mr-2 h-5 w-5" />
          Ver Anúncio
        </Button>
      </div>
    </div>
  );
}
