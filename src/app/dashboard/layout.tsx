"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Clapperboard,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Wallet,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppLogo } from "@/components/icons";
import { useUser, useAuth } from "@/firebase";

const menuItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/watch", label: "Assistir Anúncios", icon: Clapperboard },
  { href: "/dashboard/wallet", label: "Carteira", icon: Wallet },
  { href: "/dashboard/profile", label: "Perfil", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login");
    }
  }, [isUserLoading, user, router]);

  const handleLogout = () => {
    auth.signOut();
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <AppLogo className="text-primary size-7" />
            <span className="text-lg font-semibold">AdEngage</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Configurações">
                <Settings />
                <span>Configurações</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Perfil do Usuário">
                <Avatar className="size-7">
                  <AvatarImage
                    src={user.photoURL ?? "https://picsum.photos/seed/avatar/100/100"}
                    alt={user.displayName ?? "Usuário"}
                  />
                  <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span>{user.displayName ?? "Usuário"}</span>
                  <span className="text-xs text-sidebar-foreground/70">
                    {user.email}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Sair">
                <LogOut />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <AppLogo className="text-primary size-6" />
            <span className="text-md font-semibold">AdEngage</span>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
