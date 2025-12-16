import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bot, BrainCircuit, Code, ShieldCheck, Users, Zap } from 'lucide-react';
import { chatService } from '@/lib/chat';
import type { SessionInfo } from '../../worker/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
const StatCard = ({ icon, title, value, description }: { icon: React.ReactNode, title: string, value: string, description: string }) => (
  <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
      <div className="text-zinc-500">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-zinc-50">{value}</div>
      <p className="text-xs text-zinc-500">{description}</p>
    </CardContent>
  </Card>
);
const WorkflowCard = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) => (
  <Card
    onClick={onClick}
    className="bg-zinc-900/50 border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/60 transition-all cursor-pointer group"
  >
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-zinc-800 group-hover:bg-indigo-600 transition-colors">{icon}</div>
        <div>
          <CardTitle className="text-base font-semibold text-zinc-200 group-hover:text-white">{title}</CardTitle>
          <CardDescription className="text-sm text-zinc-400 mt-1">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
  </Card>
);
export function HomePage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const response = await chatService.listSessions();
      if (response.success && response.data) {
        setSessions(response.data);
      } else {
        toast.error("Failed to load recent missions.");
      }
      setLoading(false);
    };
    fetchSessions();
  }, []);
  const startNewMission = async (title: string, firstMessage: string) => {
    const result = await chatService.createSession(title, undefined, firstMessage);
    if (result.success && result.data) {
      navigate(`/session/${result.data.sessionId}`);
    } else {
      toast.error("Failed to start new mission.");
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
      <div className="py-8 md:py-10 lg:py-12 flex-grow flex flex-col">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">Mission Control</h1>
          <p className="mt-3 text-lg text-zinc-400">Oversee and orchestrate your multi-agent AI workflows.</p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatCard icon={<Users className="h-4 w-4" />} title="Active Swarms" value="3" description="Currently running agent groups" />
          <StatCard icon={<Zap className="h-4 w-4" />} title="Tokens Saved" value="1.2M" description="vs. single-model workflows" />
          <StatCard icon={<ShieldCheck className="h-4 w-4" />} title="Avg. Confidence" value="High" description="Across all active missions" />
          <StatCard icon={<Bot className="h-4 w-4" />} title="Total Missions" value={sessions.length.toString()} description="Completed & active" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          <div className="lg:col-span-2 flex flex-col">
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">Start a New Mission</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <WorkflowCard
                icon={<Code className="h-6 w-6 text-indigo-400" />}
                title="Deep Code Review"
                description="Analyze code with multiple models for quality."
                onClick={() => startNewMission("Code Review", "Perform a deep code review on the current project.")}
              />
              <WorkflowCard
                icon={<Users className="h-6 w-6 text-emerald-400" />}
                title="Consensus Debate"
                description="Let models debate a topic to find the best solution."
                onClick={() => startNewMission("Consensus Debate", "Start a consensus debate on...")}
              />
              <WorkflowCard
                icon={<BrainCircuit className="h-6 w-6 text-amber-400" />}
                title="System Design"
                description="Plan complex architecture with AI collaborators."
                onClick={() => startNewMission("System Design", "Design a scalable system for...")}
              />
              <WorkflowCard
                icon={<ShieldCheck className="h-6 w-6 text-rose-400" />}
                title="Security Audit"
                description="Identify potential vulnerabilities in your codebase."
                onClick={() => startNewMission("Security Audit", "Perform a security audit.")}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-zinc-200 mb-4">Recent Missions</h2>
            <Card className="flex-grow flex flex-col bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardContent className="p-0 flex-grow">
                <ScrollArea className="h-full max-h-[400px] p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  ) : sessions.length > 0 ? (
                    <ul className="space-y-4">
                      {sessions.slice(0, 5).map(session => (
                        <li key={session.id} onClick={() => navigate(`/session/${session.id}`)} className="p-3 rounded-lg hover:bg-zinc-800/70 cursor-pointer transition-colors">
                          <p className="font-medium text-zinc-200 truncate">{session.title}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-zinc-400">
                              {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}
                            </p>
                            <Badge variant="outline" className="border-indigo-500/50 text-indigo-400">Active</Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-zinc-500 py-10">No recent missions.</div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
        <footer className="text-center text-zinc-600 pt-8 text-sm">
          Built with ��️ at Cloudflare
        </footer>
      </div>
    </div>
  );
}