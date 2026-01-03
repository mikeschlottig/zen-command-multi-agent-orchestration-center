import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command as CommandIcon, Home, HardDrive, Settings, PlusCircle, Moon, Sun, BrainCircuit, Trash2 } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useHotkeys } from 'react-hotkeys-hook';
import { chatService, MODELS } from '@/lib/chat';
import { toast } from 'sonner';
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useHotkeys('mod+k', (e) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  });
  const runCommand = (command: () => void) => {
    command();
    setOpen(false);
  };
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="bg-zinc-950 border-zinc-800">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <Home className="mr-2 h-4 w-4 text-indigo-400" />
            <span>Mission Control</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/archives'))}>
            <HardDrive className="mr-2 h-4 w-4 text-emerald-400" />
            <span>Archives</span>
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4 text-zinc-400" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(async () => {
            const res = await chatService.createSession();
            if (res.success) navigate(`/session/${res.data?.sessionId}`);
          })}>
            <PlusCircle className="mr-2 h-4 w-4 text-blue-400" />
            <span>New Mission</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => {
            toast.info("Theme toggled");
            document.documentElement.classList.toggle('dark');
          })}>
            <Sun className="mr-2 h-4 w-4 text-amber-400" />
            <span>Toggle Theme</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Models">
          {MODELS.slice(0, 5).map(m => (
            <CommandItem key={m.id} onSelect={() => runCommand(() => {
              chatService.updateModel(m.id);
              toast.success(`Switched to ${m.name}`);
            })}>
              <BrainCircuit className="mr-2 h-4 w-4 text-purple-400" />
              <span>{m.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}