import { AuthForm } from "@/components/auth/auth-form";
import { AppLogo } from "@/components/icons";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <AppLogo className="size-10 mb-2 text-primary" />
          <h1 className="text-2xl font-bold">Bem-vindo(a) de volta!</h1>
          <p className="text-muted-foreground">
            Faça login para continuar na ADGANHE.
          </p>
        </div>
        <AuthForm type="login" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
