"use client";

import { Info } from "lucide-react";

export default function WatchPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
        <p className="text-muted-foreground">
          Os anúncios agora são exibidos automaticamente enquanto você navega.
        </p>
      </div>

      <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <Info className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground max-w-sm">
            Continue usando o site normalmente. As recompensas por visualização de anúncios serão creditadas em sua carteira.
          </p>
        </div>
      </div>
    </div>
  );
}
