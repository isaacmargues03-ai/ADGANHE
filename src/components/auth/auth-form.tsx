"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

type AuthFormValues = z.infer<typeof formSchema>;

type AuthFormProps = {
  type: "login" | "signup";
};

export function AuthForm({ type }: AuthFormProps) {
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: AuthFormValues) {
    setIsLoading(true);
    
    const email = data.email.trim().toLowerCase();

    const handleAuthSuccess = () => {
      router.replace('/dashboard');
    };

    const handleAuthError = (error: any) => {
        setIsLoading(false);
        let description = "Ocorreu um erro. Tente novamente.";
        // Map Firebase error codes to user-friendly messages in Portuguese
        switch (error.code) {
            case "auth/user-not-found":
            case "auth/invalid-credential": // This covers wrong email/password for newer SDKs
                description = "Email ou senha incorretos.";
                break;
            case "auth/wrong-password":
                description = "Senha incorreta. Tente novamente.";
                break;
            case "auth/email-already-in-use":
                description = "Este email já está em uso por outra conta.";
                break;
            case "auth/invalid-email":
                description = "O formato do email é inválido.";
                break;
            case "auth/weak-password":
                description = "A senha é muito fraca. Tente uma mais forte.";
                break;
            default:
                description = "Falha na autenticação. Verifique suas credenciais.";
                break;
        }
        toast({
            variant: "destructive",
            title: "Erro de Autenticação",
            description: description,
        });
    }

    if (type === "login") {
        signInWithEmailAndPassword(auth, email, data.password)
            .then(handleAuthSuccess)
            .catch(handleAuthError);
    } else {
        createUserWithEmailAndPassword(auth, email, data.password)
            .then(async (userCredential) => {
              if (!firestore) return;
              const user = userCredential.user;
              const userDocRef = doc(firestore, 'users', user.uid);
              
              // Use a transaction to safely create the user document, preventing data loss.
              await runTransaction(firestore, async (transaction) => {
                const userDoc = await transaction.get(userDocRef);
                if (!userDoc.exists()) {
                  // Document doesn't exist: This is a brand new user.
                  // Create the document with an initial credit balance of 0.
                  transaction.set(userDocRef, {
                    id: user.uid,
                    email: user.email,
                    credits: 0,
                    registrationDate: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                    username: user.email?.split('@')[0] ?? `user_${user.uid.substring(0,5)}`,
                  });
                } else {
                  // Document already exists: This can happen in rare cases (e.g., re-creating a deleted auth account).
                  // To be safe, we will NOT touch the credits. We'll just update the last login time.
                  transaction.update(userDocRef, {
                    lastLogin: serverTimestamp()
                  });
                }
              });

              handleAuthSuccess();
            })
            .catch(handleAuthError);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {type === "login" ? "Entrar" : "Criar Conta"}
        </Button>
      </form>
    </Form>
  );
}
