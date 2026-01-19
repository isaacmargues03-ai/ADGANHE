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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

const PROFILE_KEY = "adengage-user-profile";

const profileFormSchema = z.object({
  favoriteTeam: z.string().max(50).optional(),
  playerToWatch: z.string().max(50).optional(),
  interests: z.string().max(200).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      favoriteTeam: "",
      playerToWatch: "",
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
        title: "Profile Saved",
        description: "Your ad recommendations will now be updated.",
      });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error Saving Profile",
            description: "Could not save your preferences.",
        });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Help us personalize your ad experience.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Football Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="favoriteTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Favorite Football Team</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Manchester United" {...field} />
                    </FormControl>
                    <FormDescription>
                      This helps us find ads related to your team.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="playerToWatch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>A Player You Follow</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cristiano Ronaldo" {...field} />
                    </FormControl>
                    <FormDescription>
                      Get recommendations about player-sponsored content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Interests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Fantasy football, sports betting, football jerseys..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tell us more about what you like.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save Preferences</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
