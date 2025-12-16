import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Zap, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Message } from '../../../worker/types';
import { ToolExecution } from './ToolExecution';
import { format } from 'date-fns';
interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}
export function MessageBubble({ message, isStreaming = false, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={cn("group flex items-start gap-4 mb-6", isUser ? "flex-row-reverse" : "flex-row")}>
      <div className={cn(
        "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-all",
        isUser ? "bg-zinc-800 border-zinc-700" : "bg-indigo-600 border-indigo-500"
      )}>
        {isUser ? <User className="w-5 h-5 text-zinc-300" /> : <Bot className="w-5 h-5 text-white" />}
      </div>
      <div className={cn("relative flex flex-col max-w-[85%] md:max-w-[75%]", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "p-4 rounded-2xl shadow-sm border transition-all",
          isUser 
            ? "bg-zinc-900 border-zinc-800 text-zinc-100 rounded-tr-none" 
            : "bg-zinc-800/40 border-zinc-700/50 text-zinc-200 rounded-tl-none backdrop-blur-sm"
        )}>
          <div className="prose prose-sm prose-invert max-w-none prose-pre:bg-black/40 prose-pre:border prose-pre:border-zinc-800 prose-code:text-indigo-300">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
            {isStreaming && !message.content && <div className="w-2 h-4 bg-indigo-400 animate-pulse rounded-full" />}
          </div>
          {message.toolCalls && message.toolCalls.length > 0 && (
            <div className="mt-4 space-y-3 border-t border-zinc-700/50 pt-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                <Zap className="w-3 h-3" />
                <span>Tool Execution Pipeline</span>
              </div>
              {message.toolCalls.map(tc => <ToolExecution key={tc.id} toolCall={tc} />)}
            </div>
          )}
        </div>
        <div className={cn(
          "flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-[10px] text-zinc-600 font-mono">
            {format(message.timestamp, 'HH:mm:ss')}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-indigo-400" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
            {!isUser && onRegenerate && (
              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-emerald-400" onClick={onRegenerate}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            )}
            {!isUser && (
              <>
                <Button variant="ghost" size="icon" className={cn("h-6 w-6", reaction === 'up' ? "text-emerald-500" : "text-zinc-500")} onClick={() => setReaction('up')}>
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className={cn("h-6 w-6", reaction === 'down' ? "text-rose-500" : "text-zinc-500")} onClick={() => setReaction('down')}>
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}