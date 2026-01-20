"use client";

import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";

export default function SurveysPage() {
  const { user, isUserLoading } = useUser();

  // Construct the URL with the user's ID and username
  const cpxUrl = user
    ? `https://offers.cpx-research.com/index.php?app_id=31040&ext_user_id=${user.uid}&username=${user.displayName || user.email?.split('@')[0]}`
    : '';

  if (isUserLoading || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Pesquisas CPX</h1>
        <p className="text-muted-foreground">Responda pesquisas e ganhe créditos diretamente em sua carteira.</p>
      </div>
      <iframe
        src={cpxUrl}
        className="h-full w-full flex-1 rounded-lg border"
        title="CPX Research Surveys"
      />
    </div>
  );
}
