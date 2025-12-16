import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SendHorizonal, CornerDownLeft, Loader, Bot, User } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AgentStatePanel } from '@/components/zen/AgentStatePanel';
import { MessageBubble } from '@/components/zen/MessageBubble';
import { chatService } from '@/lib/chat';
import type { Message } from '../../worker/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
export function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentModel, setCurrentModel] = useState('google-ai-studio/gemini-2.5-flash');
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, []);
  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }
    const loadSession = async () => {
      setIsLoading(true);
      chatService.switchSession(sessionId);
      const response = await chatService.getMessages();
      if (response.success && response.data) {
        setMessages(response.data.messages);
        setCurrentModel(response.data.model);
      } else {
        toast.error("Failed to load session.", { description: "This session may not exist or an error occurred." });
        navigate('/');
      }
      setIsLoading(false);
    };
    loadSession();
  }, [sessionId, navigate]);
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, scrollToBottom]);
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setStreamingMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    });
    await chatService.sendMessage(userMessage.content, currentModel, (chunk) => {
      setStreamingMessage(prev => prev ? { ...prev, content: prev.content + chunk } : null);
    });
    const finalState = await chatService.getMessages();
    if (finalState.success && finalState.data) {
        setMessages(finalState.data.messages);
    }
    setIsProcessing(false);
    setStreamingMessage(null);
  };
  const handleModelChange = async (modelId: string) => {
    setCurrentModel(modelId);
    await chatService.updateModel(modelId);
    toast.success(`Model switched to ${modelId}`);
  };
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-grow">
      <ResizablePanel defaultSize={70} minSize={50}>
        <div className="flex flex-col h-full bg-zinc-950/80">
          <header className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-200">Orchestrator</h2>
            <div className="text-xs text-zinc-500">Session ID: {sessionId?.split('-')[0]}...</div>
          </header>
          <div className="flex-grow overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4 md:p-6 space-y-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="flex items-start gap-3"><User className="w-6 h-6 rounded-full" /><Skeleton className="w-3/5 h-16" /></div>
                    <div className="flex items-start gap-3 justify-end"><Skeleton className="w-4/5 h-24" /><Bot className="w-6 h-6 rounded-full" /></div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
                    {streamingMessage && <MessageBubble message={streamingMessage} isStreaming />}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="p-4 border-t border-zinc-800">
            <form onSubmit={handleSendMessage} className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Send a command to your agent swarm..."
                className="w-full bg-zinc-900 border-zinc-700 rounded-lg pr-24 resize-none focus:ring-indigo-500"
                rows={1}
              />
              <div className="absolute bottom-2.5 right-3 flex items-center gap-2">
                <Button type="submit" size="icon" disabled={isProcessing || !input.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  {isProcessing ? <Loader className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
                </Button>
              </div>
            </form>
            <p className="text-xs text-zinc-600 mt-2 text-center">
              Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-md">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 text-xs font-semibold text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-md">Shift + Enter</kbd> for a new line.
            </p>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <AgentStatePanel currentModel={currentModel} onModelChange={handleModelChange} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}