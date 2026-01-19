"use client";

import { AdCard } from "@/components/dashboard/AdCard";
import { rewardedAds } from "@/lib/data";

export default function WatchPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
        <p className="text-muted-foreground">
          Complete as tarefas abaixo para ganhar créditos.
        </p>
      </div>

      {rewardedAds.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rewardedAds.map((ad, index) => (
            <AdCard
              key={index}
              title={ad.title}
              reward={ad.reward}
              duration={ad.duration}
              imageUrl={ad.imageUrl}
              imageHint={ad.imageHint}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">Nenhum anúncio disponível no momento. Volte mais tarde!</p>
        </div>
      )}
    </div>
  );
}
