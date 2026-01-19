"use client";

import { useCredits } from "@/hooks/use-credits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Loader2 } from "lucide-react";

export function CreditBalance() {
  const { credits, loading } = useCredits();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">My Credits</CardTitle>
        <Award className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <div className="text-2xl font-bold">
            {credits?.toLocaleString() ?? 0}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Earn more by watching ads
        </p>
      </CardContent>
    </Card>
  );
}
