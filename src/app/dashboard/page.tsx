import { CreditBalance } from "@/components/CreditBalance";
import { StatCard } from "@/components/dashboard/StatCard";
import { dashboardStats } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground">Aqui está sua visão geral de engajamento.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CreditBalance />
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}
