import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SendHorizonal, Loader, Bot, User, ArrowDown, Command, Sparkles, RefreshCw } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AgentStatePanel } from '@/components/zen/AgentStatePanel';
import { MessageBubble } from '@/components/zen/MessageBubble';
import { chatService } from '@/lib/chat';
import type { Message } from '../../worker/types';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
export function SessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentModel, setCurrentModel] = useState('anthropic/claude-4-sonnet');
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior });
      }
    }
  }, []);
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    setShowScrollButton(!isAtBottom);
  }, []);
  useEffect(() => {
    if (!sessionId) return navigate('/');
    const load = async () => {
      setIsLoading(true);
      chatService.switchSession(sessionId);
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        setMessages(res.data.messages);
        setCurrentModel(res.data.model);
      } else {
        toast.error("Mission not found");
        navigate('/');
      }
      setIsLoading(false);
      setTimeout(() => scrollToBottom('auto'), 100);
    };
    load();
  }, [sessionId, navigate, scrollToBottom]);
  useEffect(() => {
    if (isProcessing) scrollToBottom();
  }, [streamingMessage, isProcessing, scrollToBottom]);
  const handleSendMessage = async (contentOverride?: string) => {
    const text = contentOverride || input.trim();
    if (!text || isProcessing) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    if (!contentOverride) setInput('');
    setIsProcessing(true);
    setStreamingMessage({ id: crypto.randomUUID(), role: 'assistant', content: '', timestamp: Date.now() });
    await chatService.sendMessage(text, currentModel, (chunk) => {
      setStreamingMessage(prev => prev ? { ...prev, content: prev.content + chunk } : null);
    });
    const final = await chatService.getMessages();
    if (final.success && final.data) setMessages(final.data.messages);
    setIsProcessing(false);
    setStreamingMessage(null);
  };
  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) handleSendMessage(lastUserMsg.content);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
      <div className="py-6 h-full flex flex-col">
        <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"} className="flex-grow border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
          <ResizablePanel defaultSize={70} minSize={40}>
            <div className="flex flex-col h-full relative">
              <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-sm font-semibold text-zinc-200 tracking-tight uppercase">Orchestrator Stream</h2>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] border-zinc-700 text-zinc-500">
                  ID: {sessionId?.slice(0, 8)}
                </Badge>
              </header>
              <div className="flex-grow overflow-hidden relative">
                <ScrollArea className="h-full" ref={scrollAreaRef} onScrollCapture={handleScroll}>
                  <div className="p-6 space-y-8 max-w-4xl mx-auto">
                    {isLoading ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex gap-4">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <Skeleton className="h-20 flex-grow rounded-xl" />
                        </div>
                      ))
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-6">
                        <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                          <Sparkles className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-zinc-200">Initialize Mission</h3>
                          <p className="text-zinc-500 text-sm mt-1">Select a prompt or type your command below.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 max-w-md">
                          {["Review my code", "Debug this error", "Explain system design", "Audit security"].map(p => (
                            <Button key={p} variant="outline" size="sm" className="bg-zinc-900/50 border-zinc-800 hover:border-indigo-500/50" onClick={() => setInput(p)}>
                              {p}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        {messages.map((m) => (
                          <MessageBubble key={m.id} message={m} onRegenerate={m.role === 'assistant' ? handleRegenerate : undefined} />
                        ))}
                        {streamingMessage && <MessageBubble message={streamingMessage} isStreaming />}
                        {isProcessing && !streamingMessage && (
                          <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center"><Bot className="w-4 h-4 text-indigo-400" /></div>
                            <div className="flex gap-1 mt-3">
                              {[0, 1, 2].map(i => <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} className="w-1.5 h-1.5 rounded-full bg-zinc-500" />)}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </ScrollArea>
                <AnimatePresence>
                  {showScrollButton && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-4 right-6 z-20">
                      <Button size="icon" variant="secondary" className="rounded-full shadow-lg border border-zinc-700" onClick={() => scrollToBottom()}>
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="p-6 border-t border-zinc-800 bg-zinc-900/20">
                <div className="max-w-4xl mx-auto relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Command your swarm..."
                    className="min-h-[60px] w-full bg-zinc-900/80 border-zinc-700 rounded-xl pr-32 resize-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <Badge variant="outline" className="hidden md:flex items-center gap-1 text-[10px] text-zinc-500 border-zinc-800">
                      <Command className="w-2.5 h-2.5" /> K
                    </Badge>
                    <Button size="icon" disabled={isProcessing || !input.trim()} onClick={() => handleSendMessage()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                      {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : <SendHorizonal className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex justify-center gap-4 text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
                  <span>Shift + Enter for new line</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800 mt-1" />
                  <span>{input.length}/4000 characters</span>
                </div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className={isMobile ? 'hidden' : ''}>
            <AgentStatePanel currentModel={currentModel} onModelChange={(m) => { setCurrentModel(m); chatService.updateModel(m); }} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}