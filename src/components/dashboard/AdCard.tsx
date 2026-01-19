"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCredits } from "@/hooks/use-credits";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlayCircle } from "lucide-react";

type AdCardProps = {
  title: string;
  reward: number;
  duration: number;
  imageUrl: string;
  imageHint: string;
};

export function AdCard({ title, reward, duration, imageUrl, imageHint }: AdCardProps) {
  const [isWatching, setIsWatching] = useState(false);
  const { updateCredits } = useCredits();
  const { toast } = useToast();

  const handleWatchAd = () => {
    setIsWatching(true);
    setTimeout(() => {
      updateCredits(reward);
      setIsWatching(false);
      toast({
        title: "Recompensa Recebida!",
        description: `Você ganhou R$ ${reward.toFixed(2)} por assistir ao anúncio.`,
      });
    }, duration * 1000); // Simulação de visualização, em segundos
  };
  
  const formattedReward = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reward);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Recompensa: {formattedReward}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            data-ai-hint={imageHint}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleWatchAd}
          disabled={isWatching}
        >
          {isWatching ? (
            <Loader2 className="mr-2 animate-spin" />
          ) : (
            <PlayCircle className="mr-2" />
          )}
          Assistir ({duration}s)
        </Button>
      </CardFooter>
    </Card>
  );
}
