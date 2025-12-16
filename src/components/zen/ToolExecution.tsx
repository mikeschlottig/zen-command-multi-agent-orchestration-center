import React from 'react';
import { Terminal, CheckCircle, XCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';
import type { ToolCall } from '../../../worker/types';
interface ToolExecutionProps {
  toolCall: ToolCall;
}
export function ToolExecution({ toolCall }: ToolExecutionProps) {
  const result = toolCall.result as { content?: string; error?: string } | undefined;
  const isError = result && 'error' in result;
  return (
    <Collapsible defaultOpen={false} className="bg-zinc-900/70 rounded-lg border border-zinc-700">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-zinc-800/50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <span className="font-mono text-sm text-zinc-300">{toolCall.name}</span>
          </div>
          {result && (
            isError
              ? <XCircle className="w-4 h-4 text-red-500" />
              : <CheckCircle className="w-4 h-4 text-emerald-500" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-3 border-t border-zinc-700 bg-black/20 rounded-b-lg">
          <div className="font-mono text-xs text-zinc-400 space-y-2">
            <div>
              <span className="text-zinc-500 select-none">$ </span>
              <span className="text-cyan-400">{toolCall.name}</span>
              <span className="text-zinc-300">(</span>
              <span className="text-amber-400">{JSON.stringify(toolCall.arguments)}</span>
              <span className="text-zinc-300">)</span>
            </div>
            {result && (
              <div className={isError ? 'text-red-400' : 'text-zinc-300'}>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}