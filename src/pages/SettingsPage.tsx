import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ModelSelector } from '@/components/zen/ModelSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BrainCircuit, Zap, Palette, RefreshCw, ShieldCheck, Activity, Crown } from 'lucide-react';
import { getToolPreferences, setToolPreferences } from '@/lib/settings-store';
import { MODELS } from '@/lib/chat';
interface Tool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}
export function SettingsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loadingTools, setLoadingTools] = useState(true);
  const [currentModel, setCurrentModel] = useState('anthropic/claude-4-sonnet');
  const [refreshing, setRefreshing] = useState(false);
  const fetchTools = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/tools');
      const result = await response.json();
      if (result.success && result.data) {
        const prefs = getToolPreferences();
        const toolsWithPrefs = result.data.map((tool: Tool) => ({
          ...tool,
          enabled: prefs[tool.id] !== undefined ? prefs[tool.id] : true
        }));
        setTools(toolsWithPrefs);
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    } finally {
      setLoadingTools(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchTools();
  }, []);
  const handleToolToggle = (toolId: string, enabled: boolean) => {
    setTools(prev => prev.map(t => t.id === toolId ? { ...t, enabled } : t));
    setToolPreferences(toolId, enabled);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div className="py-8 md:py-10 lg:py-12 space-y-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">Settings</h1>
          <p className="mt-3 text-lg text-zinc-400">Configure your Zen Command Center experience.</p>
        </header>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-zinc-200">
                  <BrainCircuit className="w-6 h-6 text-indigo-400" />
                  Model Configuration
                </CardTitle>
                <CardDescription>Select the default primary model for new missions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-md">
                  <ModelSelector currentModel={currentModel} onModelChange={setCurrentModel} />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-zinc-200">
                  <Activity className="w-6 h-6 text-teal-400" />
                  Model Performance
                </CardTitle>
                <CardDescription>Real-time capability metrics for available models.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MODELS.slice(0, 5).map(model => (
                  <div key={model.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <span className="text-sm font-medium text-zinc-300">{model.name}</span>
                    <div className="flex gap-2">
                      {model.id.includes('opus') || model.id.includes('pro') ? (
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">High Quality</Badge>
                      ) : model.id.includes('mini') || model.id.includes('haiku') ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Fast</Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">Balanced</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl text-zinc-200">
                    <Zap className="w-6 h-6 text-amber-400" />
                    Tool Registry
                  </CardTitle>
                  <CardDescription>Live MCP tools discovered in the environment.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={fetchTools} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                {loadingTools ? (
                  Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full bg-zinc-800/50" />)
                ) : tools.length > 0 ? (
                  tools.map(tool => (
                    <div key={tool.id} className="flex items-start justify-between p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
                      <div className="space-y-1">
                        <Label htmlFor={tool.id} className="font-mono text-base text-zinc-200 cursor-pointer">{tool.name}</Label>
                        <p className="text-sm text-zinc-500 leading-relaxed">{tool.description}</p>
                      </div>
                      <Switch
                        id={tool.id}
                        checked={tool.enabled}
                        onCheckedChange={(checked) => handleToolToggle(tool.id, checked)}
                        className="mt-1"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-zinc-500">No tools detected.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-zinc-200">
              <Palette className="w-6 h-6 text-rose-400" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of the interface.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-zinc-300">Toggle between light and dark themes.</p>
            <ThemeToggle className="relative top-0 right-0" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}