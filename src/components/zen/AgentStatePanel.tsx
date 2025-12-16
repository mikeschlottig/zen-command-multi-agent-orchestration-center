import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModelSelector } from './ModelSelector';
import { VisualContextGraph } from './VisualContextGraph';
import { BrainCircuit, Zap, ShieldCheck, Network, Activity, Clock, MoreVertical, RefreshCw } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
const mockTrend = [
  { val: 80 }, { val: 82 }, { val: 78 }, { val: 85 }, { val: 88 }, { val: 84 }, { val: 90 }
];
export function AgentStatePanel({ currentModel, onModelChange }: { currentModel: string, onModelChange: (m: string) => void }) {
  return (
    <div className="h-full flex flex-col bg-zinc-950/20 backdrop-blur-md border-l border-zinc-800">
      <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/40">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Mission Intelligence</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500"><MoreVertical className="w-4 h-4" /></Button>
      </header>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          <Card className="bg-zinc-900/40 border-zinc-800 shadow-inner">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit className="w-3 h-3 text-indigo-400" /> Active Core
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModelSelector currentModel={currentModel} onModelChange={onModelChange} />
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Confidence Vector
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-emerald-400 tracking-tighter">94%</span>
                <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-500 bg-emerald-500/5">STABLE</Badge>
              </div>
              <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockTrend}>
                    <Line type="monotone" dataKey="val" stroke="#10b981" strokeWidth={2} dot={false} />
                    <YAxis hide domain={[0, 100]} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-3 h-3 text-amber-400" /> Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: <Zap className="w-3 h-3" />, text: "clink executed", time: "2m ago", color: "text-amber-400" },
                  { icon: <BrainCircuit className="w-3 h-3" />, text: "model switch: haiku", time: "5m ago", color: "text-indigo-400" },
                  { icon: <Clock className="w-3 h-3" />, text: "session checkpoint", time: "12m ago", color: "text-zinc-500" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className={item.color}>{item.icon}</div>
                      <span className="text-zinc-300">{item.text}</span>
                    </div>
                    <span className="text-zinc-600 font-mono">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/40 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Network className="w-3 h-3 text-teal-400" /> Swarm Topology
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-40">
              <VisualContextGraph />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <footer className="p-4 border-t border-zinc-800 bg-zinc-900/40">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] text-zinc-500">
            <span>Latency</span>
            <span className="font-mono text-emerald-500">142ms</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500">
            <span>Uptime</span>
            <span className="font-mono">99.9%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}