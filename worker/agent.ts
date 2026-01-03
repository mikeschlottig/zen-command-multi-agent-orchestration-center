import { Agent } from 'agents';
import type { Env } from './core-utils';
import type { ChatState, Message } from './types';
import { ChatHandler } from './chat';
import { API_RESPONSES } from './config';
import { createMessage, createStreamResponse, createEncoder } from './utils';
export class ChatAgent extends Agent<Env, ChatState> {
  private chatHandler?: ChatHandler;
  initialState: ChatState = {
    messages: [],
    sessionId: crypto.randomUUID(),
    isProcessing: false,
    model: 'anthropic/claude-4-sonnet'
  };
  async onStart(): Promise<void> {
    this.chatHandler = new ChatHandler(
      this.env.CF_AI_BASE_URL,
      this.env.CF_AI_API_KEY,
      this.state.model
    );
  }
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    if (method === 'GET' && url.pathname === '/messages') return Response.json({ success: true, data: this.state });
    if (method === 'POST' && url.pathname === '/chat') return this.handleChatMessage(await request.json());
    if (method === 'POST' && url.pathname === '/model') return this.handleModelUpdate(await request.json());
    if (method === 'DELETE' && url.pathname === '/clear') {
      this.setState({ ...this.state, messages: [] });
      return Response.json({ success: true });
    }
    return Response.json({ success: false, error: "Not Found" }, { status: 404 });
  }
  private async handleChatMessage(body: { message: string; model?: string; stream?: boolean }): Promise<Response> {
    const { message, model, stream } = body;
    if (!message?.trim()) return Response.json({ success: false, error: "Empty" }, { status: 400 });
    if (model && model !== this.state.model) {
      this.setState({ ...this.state, model });
      this.chatHandler?.updateModel(model);
    }
    const userMsg = createMessage('user', message.trim());
    this.setState({ ...this.state, messages: [...this.state.messages, userMsg], isProcessing: true });
    if (stream) {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = createEncoder();
      (async () => {
        try {
          const response = await this.chatHandler!.processMessage(message, this.state.messages, (chunk) => {
            writer.write(encoder.encode(chunk));
          });
          const assistantMsg = createMessage('assistant', response.content, response.toolCalls);
          this.setState({ ...this.state, messages: [...this.state.messages, assistantMsg], isProcessing: false });
        } finally {
          writer.close();
        }
      })();
      return createStreamResponse(readable);
    }
    const response = await this.chatHandler!.processMessage(message, this.state.messages);
    const assistantMsg = createMessage('assistant', response.content, response.toolCalls);
    this.setState({ ...this.state, messages: [...this.state.messages, assistantMsg], isProcessing: false });
    return Response.json({ success: true, data: this.state });
  }
  private handleModelUpdate(body: { model: string }): Response {
    this.setState({ ...this.state, model: body.model });
    this.chatHandler?.updateModel(body.model);
    return Response.json({ success: true });
  }
}