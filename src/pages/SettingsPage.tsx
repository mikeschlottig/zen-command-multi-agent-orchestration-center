import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BrainCircuit, Zap, Palette, RefreshCw, Activity, ShieldCheck, Keyboard, Globe, Code, MessageSquare } from 'lucide-react';
import { MODELS } from '@/lib/chat';
import { motion } from 'framer-motion';
const ShortcutRow = ({ keys, desc }: { keys: string[], desc: string }) => (
  <TableRow className="border-zinc-800">
    <TableCell className="font-medium text-zinc-300">{desc}</TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end gap-1">
        {keys.map(k => (
          <kbd key={k} className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-mono text-zinc-400">{k}</kbd>
        ))}
      </div>
    </TableCell>
  </TableRow>
);
export function SettingsPage() {
  const [currentModel, setCurrentModel] = useState('anthropic/claude-4-sonnet');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div className="py-8 md:py-12 space-y-10">
        <header>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100">System Configuration</h1>
          <p className="mt-2 text-zinc-400">Manage your agent environment and visual preferences.</p>
        </header>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-indigo-400" /> Model Performance
                </CardTitle>
                <CardDescription>Real-time capability metrics for active swarms.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                {MODELS.slice(0, 4).map((m, i) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-semibold text-zinc-200">{m.name.split(' ')[0]}</span>
                      <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-400">Online</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-zinc-500 uppercase"><span>Logic Quality</span><span>{90 - i * 5}%</span></div>
                        <Progress value={90 - i * 5} className="h-1 bg-zinc-800" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-zinc-500 uppercase"><span>Response Speed</span><span>{70 + i * 10}%</span></div>
                        <Progress value={70 + i * 10} className="h-1 bg-zinc-800" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Keyboard className="w-5 h-5 text-amber-400" /> Keyboard Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <ShortcutRow keys={["⌘", "K"]} desc="Open Command Palette" />
                    <ShortcutRow keys={["⌘", "N"]} desc="New Mission" />
                    <ShortcutRow keys={["⌘", "Enter"]} desc="Send Message" />
                    <ShortcutRow keys={["Esc"]} desc="Close Modals" />
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-emerald-400" /> Experimental
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Streaming Responses</Label>
                    <p className="text-xs text-zinc-500">Show AI output in real-time.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thinking Process</Label>
                    <p className="text-xs text-zinc-500">Visualize internal agent logic.</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Archive</Label>
                    <p className="text-xs text-zinc-500">Archive inactive sessions daily.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette className="w-5 h-5 text-rose-400" /> Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-sm text-zinc-300">Glassmorphism Intensity</span>
                  <Badge variant="secondary">High</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                  <span className="text-sm text-zinc-300">Default Theme</span>
                  <Badge variant="secondary">Cyber Dark</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}