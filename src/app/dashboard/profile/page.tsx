"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

const PROFILE_KEY = "adengage-user-profile";

const profileFormSchema = z.object({
  interests: z.string().max(200).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      interests: "",
    },
  });

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_KEY);
      if (storedProfile) {
        form.reset(JSON.parse(storedProfile));
      }
    } catch (error) {
        console.error("Could not read profile from localStorage", error);
    }
  }, [form]);

  function onSubmit(data: ProfileFormValues) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
      toast({
        title: "Perfil Salvo",
        description: "Suas recomendações de anúncios serão atualizadas.",
      });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao Salvar Perfil",
            description: "Não foi possível salvar suas preferências.",
        });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seu Perfil</h1>
        <p className="text-muted-foreground">
          Ajude-nos a personalizar sua experiência com anúncios.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas Preferências</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seus Interesses</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="ex: Tecnologia, jogos, culinária..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Conte-nos mais sobre o que você gosta para receber anúncios mais relevantes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Salvar Preferências</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
