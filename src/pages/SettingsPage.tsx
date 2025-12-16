import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ModelSelector } from '@/components/zen/ModelSelector';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BrainCircuit, Zap, Palette } from 'lucide-react';
const availableTools = [
  { id: 'clink', name: 'clink', description: 'Bridge requests to external AI CLIs.', enabled: true },
  { id: 'chat', name: 'chat', description: 'Brainstorm ideas and get second opinions.', enabled: true },
  { id: 'thinkdeep', name: 'thinkdeep', description: 'Extended reasoning and edge case analysis.', enabled: true },
  { id: 'planner', name: 'planner', description: 'Break down complex projects into plans.', enabled: true },
  { id: 'consensus', name: 'consensus', description: 'Get expert opinions from multiple AI models.', enabled: true },
  { id: 'codereview', name: 'codereview', description: 'Professional reviews with severity levels.', enabled: false },
  { id: 'debug', name: 'debug', description: 'Systematic investigation and root cause analysis.', enabled: false },
];
export function SettingsPage() {
  const [tools, setTools] = useState(availableTools);
  const [currentModel, setCurrentModel] = useState('openai/gpt-4o');
  const handleToolToggle = (toolId: string) => {
    setTools(prevTools =>
      prevTools.map(tool =>
        tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
      )
    );
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
      <div className="py-8 md:py-10 lg:py-12">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">Settings</h1>
          <p className="mt-3 text-lg text-zinc-400">Configure your Zen Command Center experience.</p>
        </header>
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
              <div className="max-w-sm">
                <ModelSelector currentModel={currentModel} onModelChange={setCurrentModel} />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-zinc-200">
                <Zap className="w-6 h-6 text-amber-400" />
                Tool Registry
              </CardTitle>
              <CardDescription>Enable or disable tools available to the agent swarms.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {tools.map(tool => (
                <div key={tool.id} className="flex items-center justify-between p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                  <div>
                    <Label htmlFor={tool.id} className="font-mono text-base text-zinc-200">{tool.name}</Label>
                    <p className="text-sm text-zinc-500">{tool.description}</p>
                  </div>
                  <Switch
                    id={tool.id}
                    checked={tool.enabled}
                    onCheckedChange={() => handleToolToggle(tool.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
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
    </div>
  );
}