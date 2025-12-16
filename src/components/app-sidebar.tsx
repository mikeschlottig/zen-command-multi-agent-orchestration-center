import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Home, BotMessageSquare, Settings, PlusCircle, HardDrive, BrainCircuit } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { chatService } from "@/lib/chat";
import { toast } from "sonner";
export function AppSidebar(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const handleNewMission = async () => {
    const newSessionId = crypto.randomUUID();
    const result = await chatService.createSession(undefined, newSessionId);
    if (result.success && result.data) {
      navigate(`/session/${result.data.sessionId}`);
      toast.success("New mission initiated.");
    } else {
      toast.error("Failed to initiate new mission.", { description: result.error });
    }
  };
  const isActive = (path: string) => location.pathname === path;
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2.5 px-2 py-1 transition-colors hover:text-indigo-400">
          <BrainCircuit className="h-7 w-7 text-indigo-500" />
          <span className="text-lg font-semibold tracking-tight">Zen Command</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <div className="flex-grow">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/')}>
                <Link to="/"><Home /> <span>Mission Control</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/archives')}>
                <Link to="#"><HardDrive /> <span>Archives</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/settings')}>
                <Link to="#"><Settings /> <span>Settings</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        <div className="p-4">
          <Button onClick={handleNewMission} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Mission
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}