import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  team: string;
  change: string;
};

export function StatCard({ title, value, team, change }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{team}</p>
        <div className="mt-2 flex items-center text-xs text-accent">
          <TrendingUp className="mr-1 h-3 w-3" />
          {change}
        </div>
      </CardContent>
    </Card>
  );
}
