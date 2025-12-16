import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Zap, Crown, DollarSign, BrainCircuit } from 'lucide-react';
import { MODELS } from '@/lib/chat';
interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
}
const getModelMetadata = (id: string) => {
  if (id.includes('opus')) return { speed: 'deep', tier: 'premium', icon: <Crown className="w-3 h-3" /> };
  if (id.includes('sonnet')) return { speed: 'balanced', tier: 'premium', icon: <BrainCircuit className="w-3 h-3" /> };
  if (id.includes('haiku') || id.includes('mini')) return { speed: 'fast', tier: 'efficient', icon: <Zap className="w-3 h-3" /> };
  if (id.includes('pro')) return { speed: 'balanced', tier: 'standard', icon: <BrainCircuit className="w-3 h-3" /> };
  return { speed: 'balanced', tier: 'standard', icon: <DollarSign className="w-3 h-3" /> };
};
export function ModelSelector({ currentModel, onModelChange }: ModelSelectorProps) {
  return (
    <Select value={currentModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-200 h-11">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200 max-h-[400px]">
        {MODELS.map(model => {
          const meta = getModelMetadata(model.id);
          return (
            <SelectItem key={model.id} value={model.id} className="focus:bg-zinc-800 py-3">
              <div className="flex flex-col gap-1.5">
                <span className="font-medium">{model.name}</span>
                <div className="flex gap-1.5">
                  <Badge variant="outline" className={`text-[10px] h-5 gap-1 px-1.5 border-zinc-700 ${
                    meta.speed === 'fast' ? 'text-emerald-400' : meta.speed === 'deep' ? 'text-blue-400' : 'text-amber-400'
                  }`}>
                    {meta.icon}
                    <span className="capitalize">{meta.speed}</span>
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] h-5 px-1.5 border-zinc-700 ${
                    meta.tier === 'premium' ? 'text-purple-400' : meta.tier === 'efficient' ? 'text-teal-400' : 'text-zinc-400'
                  }`}>
                    <span className="capitalize">{meta.tier}</span>
                  </Badge>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}