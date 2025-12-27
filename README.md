# Zen Command - Multi-Agent Orchestration Center

[![Deploy to Cloudflare][![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikeschlottig/zen-command-multi-agent-orchestration-center)]

Zen Command is a state-of-the-art GUI dashboard and control plane for the Zen MCP multi-agent ecosystem. It transforms the command-line heavy experience of orchestrating multiple AI models into a sleek, visual, and interactive 'Mission Control' center.

The application oversees workflows where a primary agent (like Claude) delegates tasks to sub-agents (Gemini, OpenAI, etc.), featuring a Mission Control Dashboard, Orchestrator Interface, Visual Context Graph, and Tool & Model Registry.

## ✨ Key Features

- **Mission Control Dashboard**: System health overview, active agent swarms, token metrics, and quick-launch workflows (Deep Debug, Consensus Debate, Security Audit).
- **Orchestrator Session View**: Rich terminal-hybrid chat with visualized 'Thought Chain', tool executions, and model hand-offs.
- **Visual Context Graph**: Sidebar topology of active agent swarms and model confidence levels.
- **Tool & Model Management**: Configure Zen tools (clink, planner, etc.) and API connections.
- **Cyberpunk UI**: Dark mode glassmorphism, neon accents, smooth animations, and responsive design.
- **Real-time Streaming**: Live AI responses, tool visualizations, and session persistence via Cloudflare Durable Objects.
- **Multi-Session Management**: Create, switch, rename, and delete workflows with automatic title generation.

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Lucide React, Zustand
- **Backend**: Cloudflare Workers, Hono, Durable Objects (ChatAgent, AppController), OpenAI SDK
- **AI Integration**: Cloudflare AI Gateway, MCP Protocol support, real-time streaming
- **State/UI**: TanStack Query, React Router, Sonner (toasts)
- **Tools**: Web search (SerpAPI), MCP tools, session persistence

## 🚀 Quick Start

1. **Prerequisites**:
   - Bun installed (`curl -fsSL https://bun.sh/install | bash`)
   - Cloudflare account and Wrangler CLI (`bunx wrangler@latest init`)
   - Cloudflare AI Gateway credentials (set in `wrangler.jsonc`)

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd zen-command-center
   bun install
   ```

3. **Configure**:
   - Update `wrangler.jsonc` with your `CF_AI_BASE_URL` and `CF_AI_API_KEY`
   - Optional: Add `SERPAPI_KEY` or `OPENROUTER_API_KEY` for enhanced tools

4. **Development**:
   ```bash
   bun run dev
   ```
   Open `http://localhost:3000`

## 📋 Installation

```bash
# Clone repository
git clone <your-repo-url>
cd zen-command-center

# Install dependencies
bun install

# Generate types (Cloudflare-specific)
bun run cf-typegen
```

Set environment variables in `wrangler.jsonc`:
```json
{
  "vars": {
    "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway}/openai",
    "CF_AI_API_KEY": "{your_ai_key}"
  }
}
```

**Note**: AI features have rate limits across all Cloudflare Workers apps. For production, monitor usage via Cloudflare dashboard.

## 💻 Usage

- **Dashboard**: Land on `/` for system overview and quick-start cards.
- **New Workflow**: Click "New Workflow" → Select type (e.g., Code Review) → Enter Orchestrator.
- **Chat & Orchestrate**: Type requests; watch real-time 'Thinking...' from models, tool blocks (e.g., `clink`), and responses.
- **Sessions**: Switch/delete via sidebar; auto-saves history.
- **Model Switch**: Dropdown to force Gemini Pro, etc., mid-conversation.

Example prompts:
```
"Perform codereview using gemini pro and o3"
"Debug this error with planner and consensus"
```

## 🔧 Development

```bash
# Start dev server
bun run dev

# Build for production
bun run build

# Lint
bun run lint

# Type check
bun tsc --noEmit
```

- Edit `src/pages/HomePage.tsx` for UI (primary entry).
- Extend agent in `worker/agent.ts` or routes in `worker/userRoutes.ts`.
- Add MCP servers in `worker/mcp-client.ts`.
- UI components: Import from `@/components/ui/*` (shadcn).

Hot reload works on frontend; Workers changes require redeploy.

## ☁️ Deployment

Deploy to Cloudflare Workers with Pages/Assets:

```bash
# Login to Cloudflare
bunx wrangler@latest login

# Deploy
bun run deploy
```

Your app will be live at `https://{project-name}.{account_id}.workers.dev`.

[![Deploy to Cloudflare][![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mikeschlottig/zen-command-multi-agent-orchestration-center)]

**Bindings**: Uses `CHAT_AGENT` (conversations) and `APP_CONTROLLER` (sessions). No changes needed to `wrangler.jsonc`.

## 🤝 Contributing

1. Fork & clone
2. `bun install`
3. Create feature branch (`git checkout -b feature/zen-tool`)
4. Commit (`git commit -m 'Add clink visualization'`)
5. Push & PR

Follow TypeScript, ESLint, and Tailwind conventions.

## 📄 License

Apache 2.0 License - see [LICENSE](LICENSE) for details.

## 🙌 Acknowledgments

Built with Cloudflare Workers, Zen MCP, and shadcn/ui. Powered by multi-model AI collaboration.