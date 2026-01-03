import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
import { getToolDefinitions } from './tools';
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
            const url = new URL(c.req.url);
            url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
            return agent.fetch(new Request(url.toString(), {
                method: c.req.method,
                headers: c.req.header(),
                body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
            }));
        } catch (error) {
            return c.json({ success: false, error: API_RESPONSES.AGENT_ROUTING_FAILED }, 500);
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/tools', async (c) => {
        const definitions = await getToolDefinitions();
        const tools = definitions.map(t => ({
            id: t.function.name,
            name: t.function.name,
            description: t.function.description,
            enabled: true
        }));
        return c.json({ success: true, data: tools });
    });
    app.get('/api/sessions', async (c) => {
        const controller = getAppController(c.env);
        const sessions = await controller.listSessions();
        return c.json({ success: true, data: sessions });
    });
    app.post('/api/sessions', async (c) => {
        const { title, sessionId: providedSessionId, firstMessage } = await c.req.json();
        const sessionId = providedSessionId || crypto.randomUUID();
        await registerSession(c.env, sessionId, title || "New Mission");
        return c.json({ success: true, data: { sessionId, title } });
    });
    app.delete('/api/sessions/:sessionId', async (c) => {
        const deleted = await unregisterSession(c.env, c.req.param('sessionId'));
        return c.json({ success: !!deleted });
    });
    app.put('/api/sessions/:sessionId/title', async (c) => {
        const { title } = await c.req.json();
        const controller = getAppController(c.env);
        const updated = await controller.updateSessionTitle(c.req.param('sessionId'), title);
        return c.json({ success: !!updated });
    });
}