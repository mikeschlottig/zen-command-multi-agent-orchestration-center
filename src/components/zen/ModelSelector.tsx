import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MODELS } from '@/lib/chat';
interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
}
export function ModelSelector({ currentModel, onModelChange }: ModelSelectorProps) {
  return (
    <Select value={currentModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-200">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
        {MODELS.map(model => (
          <SelectItem key={model.id} value={model.id} className="focus:bg-zinc-800">
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}