import { AuthForm } from "@/components/auth/auth-form";
import { AppLogo } from "@/components/icons";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <AppLogo className="size-10 mb-2 text-primary" />
          <h1 className="text-2xl font-bold">Crie sua Conta na ADGANHE</h1>
          <p className="text-muted-foreground">
            Comece a ganhar recompensas hoje mesmo.
          </p>
        </div>
        <AuthForm type="signup" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}
