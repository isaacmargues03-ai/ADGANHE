"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { generateAds } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Loader2, AlertTriangle, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PROFILE_KEY = "adengage-user-profile";

export function PersonalizedAds() {
  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getAds = () => {
    let userProfile = "Adora futebol, principalmente a Premier League. Time favorito é o Manchester United.";
    try {
        const storedProfile = localStorage.getItem(PROFILE_KEY);
        if (storedProfile) {
            const parsed = JSON.parse(storedProfile);
            userProfile = `Time favorito: ${parsed.favoriteTeam || 'N/A'}. Jogador para observar: ${parsed.playerToWatch || 'N/A'}. Interesses: ${parsed.interests || 'Fã de futebol em geral'}.`
        }
    } catch (e) {
        console.warn("Could not read user profile from localStorage.");
    }
    

    setError(null);
    startTransition(async () => {
      const result = await generateAds({ userProfile, scoutAIStatistics: "Alto engajamento com destaques da Champions League." });
      if ("error" in result) {
        setError(result.error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: result.error,
        });
      } else {
        setRecommendations(result.adRecommendations);
      }
    });
  };

  useEffect(() => {
    getAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <CardTitle>Para Você: Anúncios Recomendados</CardTitle>
        </div>
        <Button onClick={getAds} disabled={isPending} size="sm">
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
          Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        {isPending && recommendations.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-destructive">
            <AlertTriangle className="h-8 w-8" />
            <p className="mt-2 text-center">{error}</p>
          </div>
        ) : recommendations.length > 0 ? (
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <List className="h-5 w-5 flex-shrink-0 text-accent mt-1" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
            <p>Nenhuma recomendação disponível. Tente atualizar!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
