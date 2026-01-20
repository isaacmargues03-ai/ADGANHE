"use client";

import { CreditBalance } from "@/components/CreditBalance";
import { StatCard } from "@/components/dashboard/StatCard";
import { dashboardStats } from "@/lib/data";
import { useUser } from "@/firebase";

export default function DashboardPage() {
  const { user } = useUser();

  // Construct the URL with the user's ID
  const cpxUrl = user
    ? `https://offers.cpx-research.com/index.php?app_id=31040&ext_user_id=${user.uid}`
    : '';

  const openSurveys = () => {
    if (user) {
      window.open(cpxUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground">Aqui está sua visão geral de engajamento.</p>
      </div>

      {/* Cartão de Pesquisas CPX Research */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 text-white shadow-lg">
        <h3 className="text-center text-lg font-black">🚀 TAREFA PREMIUM</h3>
        <p className="mb-4 text-center text-sm">
          Ganhe de R$ 1,00 a R$ 15,00 por pesquisa!
        </p>
        <button
          onClick={openSurveys}
          disabled={!user}
          className="w-full cursor-pointer rounded-xl border-none bg-white p-3 font-bold text-emerald-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ABRIR PESQUISAS
        </button>
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
