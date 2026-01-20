"use client";

import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";

// Nota: Usando um App ID de exemplo para demonstração. Substitua pelo seu ID real do CPX Research.
const CPX_APP_ID = "16391"; 

export default function SurveysPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const username = user.displayName || user.email?.split('@')[0] || `user_${user.uid.substring(0, 5)}`;
  const cpxUrl = `https://wall.cpx-research.com/index.php?app_id=${CPX_APP_ID}&ext_user_id=${user.uid}&email=${user.email || ''}&username=${username}`;

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ganhe com Pesquisas</h1>
        <p className="text-muted-foreground">
          Sua opinião vale créditos! Responda perguntas e veja seu saldo crescer.
        </p>
      </div>

      <div className="flex-1 rounded-lg border">
        <iframe
          src={cpxUrl}
          className="h-full w-full rounded-lg border-0"
          title="CPX Research Surveys"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
