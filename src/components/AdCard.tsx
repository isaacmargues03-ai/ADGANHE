import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clapperboard, Award } from "lucide-react";

type AdCardProps = {
  title: string;
  description: string;
  reward: number;
  onWatch: () => void;
};

export function AdCard({ title, description, reward, onWatch }: AdCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <div className="flex items-center gap-1 text-sm font-semibold text-accent">
                <Award className="h-4 w-4" />
                <span>{reward}</span>
            </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow" />
      <CardFooter>
        <Button onClick={onWatch} className="w-full">
          <Clapperboard className="mr-2 h-4 w-4" />
          Assista Agora
        </Button>
      </CardFooter>
    </Card>
  );
}
