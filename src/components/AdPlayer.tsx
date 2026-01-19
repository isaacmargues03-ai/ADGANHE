"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";

type AdPlayerProps = {
  duration: number;
  imageUrl: string;
  onComplete: () => void;
};

export function AdPlayer({ duration, imageUrl, onComplete }: AdPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      setIsComplete(true);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => prev + 100 / duration);
    }, 1000);

    return () => clearInterval(timer);
  }, [progress, duration]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="relative w-full aspect-video overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt="Anúncio"
          fill
          className="object-cover"
          data-ai-hint="advertisement abstract"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="w-full space-y-2">
        <Progress value={progress} className="w-full h-2" />
        <p className="text-center text-sm text-muted-foreground">
          {isComplete
            ? "Anúncio finalizado! Resgate sua recompensa."
            : `Anúncio em andamento... ${Math.max(0, duration - Math.floor((progress/100)*duration))}s restantes`}
        </p>
      </div>

      <Button
        onClick={onComplete}
        disabled={!isComplete}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        size="lg"
      >
        <Award className="mr-2 h-5 w-5" />
        Resgatar Recompensa
      </Button>
    </div>
  );
}
