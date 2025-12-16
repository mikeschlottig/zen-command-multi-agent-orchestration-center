import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ModelSelector } from './ModelSelector';
import { VisualContextGraph } from './VisualContextGraph';
import { BrainCircuit, Zap, ShieldCheck, Network } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { motion } from 'framer-motion';
interface AgentStatePanelProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
}
export function AgentStatePanel({ currentModel, onModelChange }: AgentStatePanelProps) {
  const confidence = 85;
  return (
    <div className="h-full flex flex-col bg-zinc-900 border-l border-zinc-800">
      <header className="p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-200">Mission Data</h2>
      </header>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-zinc-300">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                Active Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModelSelector
                currentModel={currentModel}
                onModelChange={onModelChange}
              />
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-zinc-300">
                <Network className="w-5 h-5 text-teal-400" />
                Swarm Topology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VisualContextGraph />
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-zinc-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Confidence Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-full bg-zinc-800 rounded-full h-2.5">
                  <motion.div
                    className="bg-emerald-500 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                  />
                </div>
                <span className="font-semibold text-emerald-400">{confidence}%</span>
              </div>
              <p className="text-xs text-zinc-500 mt-2">Agent confidence in current solution path.</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-zinc-300">
                <Zap className="w-5 h-5 text-amber-400" />
                Active Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-mono border-zinc-700">clink</Badge>
                <Badge variant="outline" className="font-mono border-zinc-700">planner</Badge>
                <Badge variant="outline" className="font-mono border-zinc-700">codereview</Badge>
                <Badge variant="outline" className="font-mono border-zinc-700">web_search</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <footer className="p-4 border-t border-zinc-800 text-center text-xs text-zinc-600">
        <p>AI requests are rate-limited across all user apps.</p>
        <p className="mt-1">Zen MCP v1.0</p>
      </footer>
    </div>
  );
}