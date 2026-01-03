import type { Message, ChatState, ToolCall, WeatherResult, MCPResult, ErrorResult, SessionInfo } from '../../worker/types';
export interface ChatResponse {
  success: boolean;
  data?: ChatState;
  error?: string;
}
export const MODELS = [
  { id: 'anthropic/claude-4-sonnet', name: 'Claude 4 Sonnet' },
  { id: 'anthropic/claude-4-opus', name: 'Claude 4 Opus' },
  { id: 'google-ai-studio/gemini-3.0-pro', name: 'Gemini 3.0 Pro' },
  { id: 'openai/gpt-5.1-pro', name: 'GPT-5.1 Pro' },
  { id: 'xai/grok-4', name: 'Grok-4' }
];
class ChatService {
  private sessionId: string;
  private baseUrl: string;
  constructor() {
    this.sessionId = crypto.randomUUID();
    this.baseUrl = `/api/chat/${this.sessionId}`;
  }
  async sendMessage(message: string, model?: string, onChunk?: (chunk: string) => void): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model, stream: !!onChunk }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) onChunk(chunk);
        }
        return { success: true };
      }
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
  async getMessages(): Promise<ChatResponse> {
    const res = await fetch(`${this.baseUrl}/messages`);
    return res.ok ? await res.json() : { success: false };
  }
  async updateModel(model: string): Promise<ChatResponse> {
    const res = await fetch(`${this.baseUrl}/model`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model })
    });
    return await res.json();
  }
  switchSession(sessionId: string): void {
    this.sessionId = sessionId;
    this.baseUrl = `/api/chat/${sessionId}`;
  }
  async createSession(title?: string, sessionId?: string, firstMessage?: string) {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, sessionId, firstMessage })
    });
    return await res.json();
  }
  async listSessions() {
    const res = await fetch('/api/sessions');
    return await res.json();
  }
  async deleteSession(sessionId: string) {
    const res = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
    return await res.json();
  }
  async updateSessionTitle(sessionId: string, title: string) {
    const res = await fetch(`/api/sessions/${sessionId}/title`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    return await res.json();
  }
}
export const chatService = new ChatService();