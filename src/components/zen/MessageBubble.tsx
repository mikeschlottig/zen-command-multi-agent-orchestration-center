import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '../../../worker/types';
import { ToolExecution } from './ToolExecution';
interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}
export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  return (
    <div className={cn("flex items-start gap-3 md:gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
          <Bot className="w-5 h-5 text-indigo-400" />
        </div>
      )}
      <div className={cn(
        "max-w-xl lg:max-w-2xl w-full p-4 rounded-2xl",
        isUser
          ? "bg-indigo-600 text-white rounded-br-lg"
          : "bg-zinc-800 text-zinc-200 rounded-bl-lg"
      )}>
        <div className="prose prose-sm prose-invert max-w-none prose-p:before:content-none prose-p:after:content-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
          {isStreaming && !message.content && <div className="w-2 h-4 bg-zinc-400 animate-pulse rounded-full" />}
        </div>
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <Zap className="w-4 h-4" />
              <span>Executing Tools...</span>
            </div>
            {message.toolCalls.map(toolCall => (
              <ToolExecution key={toolCall.id} toolCall={toolCall} />
            ))}
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center border border-zinc-600">
          <User className="w-5 h-5 text-zinc-300" />
        </div>
      )}
    </div>
  );
}