import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bot, BrainCircuit, Code, ShieldCheck, Users, Zap, Loader2, Copy, Check, Edit2, ArrowRight } from 'lucide-react';
import { chatService } from '@/lib/chat';
import type { SessionInfo } from '../../worker/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
const StatCard = ({ icon, title, value, description }: { icon: React.ReactNode, title: string, value: string, description: string }) => (
  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
    <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-md hover:border-indigo-500/30 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <div className="text-zinc-500">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-zinc-50">{value}</div>
        <p className="text-xs text-zinc-500">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);
const WorkflowCard = ({ icon, title, description, onClick, isStarting, colorClass }: { icon: React.ReactNode, title: string, description: string, onClick: () => void, isStarting: boolean, colorClass: string }) => (
  <motion.div whileTap={{ scale: 0.98 }}>
    <Card
      onClick={!isStarting ? onClick : undefined}
      className={`bg-zinc-900/50 border-zinc-800 hover:border-${colorClass}-500/50 hover:bg-zinc-800/60 transition-all cursor-pointer group relative overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${colorClass}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <CardHeader>
        <div className="flex items-center gap-4 relative z-10">
          <div className={`p-3 rounded-lg bg-zinc-800 group-hover:bg-${colorClass}-600 transition-colors`}>
            {isStarting ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : icon}
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-zinc-200 group-hover:text-white">{title}</CardTitle>
            <CardDescription className="text-sm text-zinc-400 mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  </motion.div>
);
export function HomePage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingMission, setStartingMission] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const fetchSessions = async () => {
    setLoading(true);
    const response = await chatService.listSessions();
    if (response.success && response.data) {
      setSessions(response.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchSessions();
  }, []);
  const startNewMission = async (title: string, firstMessage: string) => {
    setStartingMission(title);
    const result = await chatService.createSession(title, undefined, firstMessage);
    if (result.success && result.data) {
      toast.success(`Mission initiated: ${result.data.title}`);
      navigate(`/session/${result.data.sessionId}`);
    } else {
      toast.error("Failed to start mission");
    }
    setStartingMission(null);
  };
  const handleDuplicate = async (session: SessionInfo) => {
    const result = await chatService.createSession(`${session.title} (Copy)`);
    if (result.success) {
      toast.success("Mission duplicated");
      fetchSessions();
    }
  };
  const handleSaveTitle = async (id: string) => {
    if (!editTitle.trim()) return setEditingId(null);
    const res = await chatService.updateSessionTitle(id, editTitle);
    if (res.success) {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, title: editTitle } : s));
      toast.success("Title updated");
    }
    setEditingId(null);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
      <div className="py-8 md:py-10 lg:py-12 flex-grow flex flex-col relative">
        {/* Hero Section */}
        <header className="mb-12 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 mb-4">
              Zen Command
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
              The visual orchestrator for multi-agent AI swarms. Deploy, monitor, and refine complex workflows in real-time.
            </p>
          </motion.div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        </header>
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <StatCard icon={<Users className="h-4 w-4" />} title="Active Swarms" value="03" description="Operational agent groups" />
          <StatCard icon={<Zap className="h-4 w-4" />} title="Tokens Saved" value="1.2M" description="Efficiency vs single-model" />
          <StatCard icon={<ShieldCheck className="h-4 w-4" />} title="Confidence" value="94%" description="System-wide average" />
          <StatCard icon={<Bot className="h-4 w-4" />} title="Total Missions" value={sessions.length.toString().padStart(2, '0')} description="Historical logs" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-grow">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <Zap className="text-amber-400 w-6 h-6" /> Quick Launch
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <WorkflowCard
                icon={<Code className="h-6 w-6 text-white" />}
                title="Deep Code Review"
                description="Multi-model analysis for logic & security."
                onClick={() => startNewMission("Code Review", "Review my latest changes.")}
                isStarting={startingMission === "Code Review"}
                colorClass="indigo"
              />
              <WorkflowCard
                icon={<Users className="h-6 w-6 text-white" />}
                title="Consensus Debate"
                description="Resolve complex architectural decisions."
                onClick={() => startNewMission("Debate", "Help me decide on a tech stack.")}
                isStarting={startingMission === "Debate"}
                colorClass="emerald"
              />
              <WorkflowCard
                icon={<BrainCircuit className="h-6 w-6 text-white" />}
                title="System Design"
                description="Collaborative planning for scale."
                onClick={() => startNewMission("Design", "Design a real-time system.")}
                isStarting={startingMission === "Design"}
                colorClass="amber"
              />
              <WorkflowCard
                icon={<ShieldCheck className="h-6 w-6 text-white" />}
                title="Security Audit"
                description="Identify vulnerabilities automatically."
                onClick={() => startNewMission("Audit", "Scan for security flaws.")}
                isStarting={startingMission === "Audit"}
                colorClass="rose"
              />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-zinc-100">Recent Missions</h2>
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm overflow-hidden">
              <ScrollArea className="h-[420px]">
                <div className="p-4 space-y-3">
                  {loading ? (
                    Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full bg-zinc-800/50" />)
                  ) : sessions.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                      {sessions.slice(0, 8).map((s) => (
                        <motion.div
                          key={s.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-indigo-500/30 transition-all"
                        >
                          <div className="flex items-center justify-between gap-2">
                            {editingId === s.id ? (
                              <Input
                                autoFocus
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={() => handleSaveTitle(s.id)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(s.id)}
                                className="h-7 bg-zinc-800 border-zinc-700 text-sm"
                              />
                            ) : (
                              <p className="font-medium text-zinc-200 truncate cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => navigate(`/session/${s.id}`)}>
                                {s.title}
                              </p>
                            )}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingId(s.id); setEditTitle(s.title); }}>
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDuplicate(s)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                              {formatDistanceToNow(s.lastActive)} ago
                            </span>
                            <ArrowRight className="h-3 w-3 text-zinc-700 group-hover:text-indigo-500 transition-colors" />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Bot className="h-12 w-12 text-zinc-700 mb-4" />
                      <p className="text-zinc-500 text-sm">No missions logged yet.</p>
                      <Button variant="link" className="text-indigo-400 mt-2" onClick={() => startNewMission("New Mission", "Hello!")}>
                        Start your first mission
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
        <footer className="mt-16 pt-8 border-t border-zinc-800/50 flex flex-col items-center gap-4">
          <Badge variant="outline" className="bg-red-500/5 border-red-500/20 text-red-400/80 font-normal px-4 py-1">
            System Note: AI requests are rate-limited across all user instances.
          </Badge>
          <div className="text-zinc-600 text-xs flex items-center gap-2">
            <span>Built with ❤️ at Cloudflare</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>Zen Command v1.2.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}