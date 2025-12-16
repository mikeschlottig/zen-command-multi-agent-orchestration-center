import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Trash2, Bot } from 'lucide-react';
import { chatService } from '@/lib/chat';
import type { SessionInfo } from '../../worker/types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
export function ArchivesPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const fetchSessions = async () => {
    setLoading(true);
    const response = await chatService.listSessions();
    if (response.success && response.data) {
      setSessions(response.data);
    } else {
      toast.error("Failed to load archives.", { description: response.error });
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchSessions();
  }, []);
  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    const response = await chatService.deleteSession(sessionToDelete);
    if (response.success) {
      toast.success("Mission archive deleted.");
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete));
    } else {
      toast.error("Failed to delete archive.", { description: response.error });
    }
    setSessionToDelete(null);
  };
  const filteredSessions = useMemo(() => {
    return sessions.filter(session =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sessions, searchTerm]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
      <div className="py-8 md:py-10 lg:py-12 flex-grow flex flex-col">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">Mission Archives</h1>
          <p className="mt-3 text-lg text-zinc-400">Review and manage all past and active missions.</p>
        </header>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <Input
            placeholder="Search missions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg pl-10 bg-zinc-900 border-zinc-700 focus:ring-indigo-500"
          />
        </div>
        <Card className="flex-grow flex flex-col bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardContent className="p-0 flex-grow">
            <ScrollArea className="h-full max-h-[calc(100vh-300px)]">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
                </div>
              ) : filteredSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {filteredSessions.map(session => (
                    <Card key={session.id} className="bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 transition-all group">
                      <CardHeader>
                        <CardTitle className="text-base font-semibold text-zinc-200 truncate group-hover:text-white cursor-pointer" onClick={() => navigate(`/session/${session.id}`)}>
                          {session.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-zinc-500">
                          Last active: {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-end">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10" onClick={() => setSessionToDelete(session.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                        </AlertDialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-zinc-500 flex flex-col items-center">
                  <Bot className="h-12 w-12 mb-4" />
                  <h3 className="text-lg font-semibold">No Missions Found</h3>
                  <p>Your search returned no results, or no missions have been started.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the mission archive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSessionToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </div>
  );
}