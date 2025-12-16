import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "../ThemeToggle";
export function AppLayout(): JSX.Element {
  useTheme(); // Initialize and apply theme
  const isMobile = useIsMobile();
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="relative h-dvh w-full bg-zinc-950 text-zinc-50">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-600 opacity-20 blur-[100px]"></div>
        </div>
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-dvh flex-col">
            <header className="flex-shrink-0 h-16 flex items-center justify-end px-4 sm:px-6 lg:px-8">
              <ThemeToggle className="relative top-0 right-0" />
            </header>
            <main className="flex-1 overflow-hidden">
              <Outlet />
            </main>
          </div>
        </SidebarInset>
        <Toaster theme="dark" richColors closeButton />
      </div>
    </SidebarProvider>
  );
}