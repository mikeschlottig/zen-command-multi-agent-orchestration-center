import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "../ThemeToggle";
import { CommandPalette } from "../zen/CommandPalette";
import { motion, AnimatePresence } from "framer-motion";
export function AppLayout(): JSX.Element {
  useTheme();
  const isMobile = useIsMobile();
  const location = useLocation();
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="relative h-dvh w-full bg-zinc-950 text-foreground overflow-hidden font-sans selection:bg-indigo-500/30">
        {/* Dynamic Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute left-[10%] top-[10%] h-[400px] w-[400px] rounded-full bg-indigo-600 blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute right-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-emerald-600 blur-[150px]" 
          />
        </div>
        <AppSidebar />
        <SidebarInset className="bg-transparent">
          <div className="flex h-dvh flex-col">
            <header className="flex-shrink-0 h-14 flex items-center justify-end px-6 relative z-50">
              <ThemeToggle className="relative top-0 right-0" />
            </header>
            <main className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </SidebarInset>
        <CommandPalette />
        <Toaster theme="dark" richColors closeButton position="bottom-right" />
      </div>
    </SidebarProvider>
  );
}