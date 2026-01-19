"use client";

import { AdCard } from "@/components/dashboard/AdCard";
import { rewardedAds } from "@/lib/data";

export default function WatchPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
        <p className="text-muted-foreground">
          Assista aos anúncios abaixo para ganhar créditos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rewardedAds.map((ad) => (
          <AdCard key={ad.id} {...ad} />
        ))}
      </div>
    </div>
  );
}
