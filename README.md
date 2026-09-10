# AhmedOS

An agentic runtime portfolio site that presents resume data as callable "tools" behind an LLM orchestrator, with live graph visualization and real-time event logging.

## Features

- **Operator Panel**: Displays Ahmed Sayyed's profile, summary, contact info, and capabilities
- **Specialist Panel**: Animated node graph showing the orchestrator/tools/MCP pipeline
- **Chat Panel**: Interactive Q&A interface powered by Claude API with tool-calling
- **Event Stream**: Real-time logging of tool calls, token usage, and costs
- **MCP Server**: Exposes the same tools via Model Context Protocol for Claude Desktop/Claude Code

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Animations**: Framer Motion
- **LLM**: OpenRouter API with Llama 3 model
- **MCP**: Node MCP SDK for Claude Desktop integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the project root:
```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get an API key at https://openrouter.ai/keys

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Using the MCP Server

To use AhmedOS tools in Claude Desktop or Claude Code:

1. Add this to your Claude Desktop config (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "ahmed-mcp": {
      "command": "node",
      "args": ["/path/to/ahmed-os/node_modules/.bin/tsx", "/path/to/ahmed-os/mcp-server.ts"]
    }
  }
}
```

2. Or run directly:
```bash
npm run mcp
```

3. In Claude, you can now call tools like:
- `get_experience({ company: "Risiar" })`
- `get_technical_skills({ category: "python" })`
- `search_projects({ query: "CRM" })`
- `get_dukaanx_project()`

## Available Tools

- `get_summary`: Professional summary
- `get_experience`: Work history (optional company filter)
- `get_technical_skills`: Skills list (optional category filter)
- `search_projects`: Project search (optional query)
- `get_education`: Education history
- `get_dukaanx_project`: DukaanX SaaS details
- `get_links`: Contact info and project links

## Deployment

The project is designed for Cloudflare Workers/Pages deployment. Configure `@cloudflare/next-on-pages` for production deployment.
