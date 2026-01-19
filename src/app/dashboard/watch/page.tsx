"use client";

export default function WatchPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assista e Ganhe</h1>
        <p className="text-muted-foreground">
          Volte mais tarde para ver novos anúncios.
        </p>
      </div>

      <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Nenhum anúncio disponível no momento.</p>
      </div>
    </div>
  );
}
