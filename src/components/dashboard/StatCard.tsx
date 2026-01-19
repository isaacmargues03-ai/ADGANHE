import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { DynamicIcon, type IconName } from "@/components/dynamic-icon";

type StatCardProps = {
  title: string;
  value: string;
  icon: IconName;
  change: string;
};

export function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <DynamicIcon name={icon} className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="mt-4 flex items-center text-xs text-accent">
          <TrendingUp className="mr-1 h-3 w-3" />
          {change}
        </div>
      </CardContent>
    </Card>
  );
}
