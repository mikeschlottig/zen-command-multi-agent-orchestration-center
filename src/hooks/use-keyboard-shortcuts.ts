import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';
import { chatService } from '@/lib/chat';
import { toast } from 'sonner';
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  // New Mission
  useHotkeys('mod+n', (e) => {
    e.preventDefault();
    chatService.createSession().then(res => {
      if (res.success) {
        navigate(`/session/${res.data?.sessionId}`);
        toast.success("New mission initiated");
      }
    });
  });
  // Go to Dashboard
  useHotkeys('mod+h', (e) => {
    e.preventDefault();
    navigate('/');
  });
  // Go to Archives
  useHotkeys('mod+a', (e) => {
    e.preventDefault();
    navigate('/archives');
  });
  // Go to Settings
  useHotkeys('mod+s', (e) => {
    e.preventDefault();
    navigate('/settings');
  });
  return {
    getModifierKey: () => (navigator.platform.indexOf('Mac') > -1 ? '⌘' : 'Ctrl')
  };
}