import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Trash2, Bot, Download, Calendar } from 'lucide-react';
import { chatService } from '@/lib/chat';
import type { SessionInfo } from '../../worker/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
export function ArchivesPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const fetchSessions = async () => {
    setLoading(true);
    const res = await chatService.listSessions();
    if (res.success && res.data) setSessions(res.data);
    setLoading(false);
  };
  useEffect(() => { fetchSessions(); }, []);
  const handleDelete = async () => {
    if (!sessionToDelete) return;
    const res = await chatService.deleteSession(sessionToDelete);
    if (res.success) {
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete));
      toast.success("Mission archived permanently");
    }
    setSessionToDelete(null);
  };
  const handleExport = (session: SessionInfo) => {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mission-${session.id.slice(0, 8)}.json`;
    a.click();
    toast.success("Mission data exported");
  };
  const filteredAndSorted = useMemo(() => {
    let result = sessions.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (sortBy === 'newest') result.sort((a, b) => b.lastActive - a.lastActive);
    if (sortBy === 'oldest') result.sort((a, b) => a.lastActive - b.lastActive);
    if (sortBy === 'alpha') result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [sessions, searchTerm, sortBy]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
      <div className="py-8 md:py-12 flex-grow flex flex-col">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100">Mission Archives</h1>
          <p className="mt-2 text-zinc-400">Historical logs of all agent orchestrations.</p>
        </header>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Filter by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="alpha">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="flex-grow">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-32 bg-zinc-900 border-zinc-800 rounded-xl" />)}
            </div>
          ) : filteredAndSorted.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-10">
              <AnimatePresence mode="popLayout">
                {filteredAndSorted.map((s) => (
                  <motion.div key={s.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <Card className="bg-zinc-900/40 border-zinc-800 hover:border-indigo-500/30 transition-all group h-full flex flex-col">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-sm font-semibold text-zinc-200 truncate group-hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => navigate(`/session/${s.id}`)}>
                            {s.title}
                          </CardTitle>
                          <Badge variant="outline" className="text-[9px] border-zinc-800 text-zinc-500">LOG</Badge>
                        </div>
                        <CardDescription className="text-[10px] flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3" /> {format(s.lastActive, 'MMM d, yyyy HH:mm')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2 mt-auto">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-indigo-400" onClick={() => handleExport(s)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500" onClick={() => setSessionToDelete(s.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Purge Mission Logs?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently erase the mission history from the secure vault.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-zinc-900 border-zinc-800">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Purge</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="p-6 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
                <Bot className="h-12 w-12 text-zinc-700" />
              </div>
              <h3 className="text-lg font-medium text-zinc-300">No Mission Logs Found</h3>
              <p className="text-zinc-500 text-sm mt-2 max-w-xs">Start a new orchestration to begin building your archives.</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}