import Journey from './Journey';
import Accordion from './Accordion';

const architectureSections = [
  {
    id: 'idea',
    title: 'Idea behind building this',
    content: (
      <p>
        AhmedOS is an AI-powered portfolio that demonstrates how modern agent systems work. 
        Instead of a static resume, it uses a local keyword-based response system to answer 
        questions about my experience, skills, and projects. The system executes tool functions 
        to retrieve data, then matches keywords in your question to provide relevant answers.
      </p>
    )
  },
  {
    id: 'send',
    title: 'What happens when you hit Send',
    content: (
      <p>
        When you send a question, the system normalizes it, checks the cache for existing answers, 
        executes all tool functions to retrieve data, uses keyword matching to determine the most 
        relevant response, caches the result, and returns the answer with event logs.
      </p>
    )
  },
  {
    id: 'architecture',
    title: 'Architecture (simple picture)',
    content: (
      <div className="font-mono text-xs opacity-80 space-y-1">
        <div>Visitor → Chat UI → /api/chat</div>
        <div>↓</div>
        <div>Tool Functions → Resume Data</div>
        <div>↓</div>
        <div>Keyword Matching → Answer</div>
        <div>↓</div>
        <div>Cache + Events → Response</div>
      </div>
    )
  },
  {
    id: 'mcp',
    title: 'How MCP is used',
    content: (
      <p>
        The MCP server (mcp-server.ts) exposes the same tool functions used by the web API. 
        This allows Claude Desktop and Claude Code to call these tools directly, enabling 
        integration with AI assistants beyond the web interface.
      </p>
    )
  },
  {
    id: 'llm-tools',
    title: 'How the LLM calls tools',
    content: (
      <p>
        In this implementation, we use a local keyword-based system instead of an external LLM. 
        The system executes all tools upfront to build context, then uses pattern matching to 
        select the most relevant response based on your question. This eliminates API costs and 
        model availability issues.
      </p>
    )
  },
  {
    id: 'answer',
    title: 'How the answer is written',
    content: (
      <p>
        The generateAnswer function analyzes your question for keywords (experience, skills, 
        projects, education, contact) and returns formatted data from the corresponding tool results. 
        Specific queries like &quot;Risiar&quot; or &quot;Python&quot; trigger more targeted responses.
      </p>
    )
  },
  {
    id: 'hallucination',
    title: 'How hallucinations are reduced',
    content: (
      <p>
        By using a deterministic keyword-based system instead of a generative LLM, hallucinations 
        are eliminated. All answers are derived directly from the structured resume data in the 
        tool functions. The system only returns information that exists in the data.
      </p>
    )
  },
  {
    id: 'rag',
    title: 'Why not just RAG over a resume?',
    content: (
      <p>
        RAG requires an external LLM and vector database, adding complexity and cost. This 
        implementation uses structured tool functions and keyword matching, which is simpler, 
        faster, and completely free. It provides deterministic answers without the risk of 
        hallucination.
      </p>
    )
  },
  {
    id: 'github',
    title: 'How GitHub is wired',
    content: (
      <p>
        The project is hosted on GitHub with the MCP server configuration in the README. 
        The repository contains the full source code, including the tool definitions, API route, 
        and frontend components.
      </p>
    )
  },
  {
    id: 'cache',
    title: 'How cache works',
    content: (
      <p>
        An in-memory Map stores question-answer pairs keyed by normalized (lowercase, trimmed) 
        questions. When a question is received, the cache is checked first. If found, the cached 
        answer is returned immediately with a CACHE_HIT event.
      </p>
    )
  },
  {
    id: 'cost',
    title: 'How LLM cost is reduced',
    content: (
      <p>
        By using a local keyword-based system instead of an external LLM API, costs are reduced to 
        zero. No API calls are made, no tokens are consumed, and there are no rate limits or 
        billing concerns.
      </p>
    )
  },
  {
    id: 'byok',
    title: 'How BYOK works',
    content: (
      <p>
        This implementation doesn&apos;t require API keys. The system operates entirely locally using 
        the tool functions and keyword matching. If you want to add external LLM support, you can 
        modify the API route to use services like Groq, Hugging Face, or OpenAI.
      </p>
    )
  },
  {
    id: 'rate-limit',
    title: 'How rate limiting works',
    content: (
      <p>
        Since this is a local system with no external API calls, there are no rate limits. 
        The only limitation is server capacity. For production use, you could add rate limiting 
        middleware to prevent abuse.
      </p>
    )
  },
  {
    id: 'animation',
    title: 'How the middle-screen animation works',
    content: (
      <p>
        The NodeGraph component uses Framer Motion to animate nodes and edges. Nodes represent 
        the orchestrator, tools, and MCP server. Edges show the data flow. The animation loops 
        continuously to demonstrate the system architecture visually.
      </p>
    )
  },
  {
    id: 'event-stream',
    title: 'What the runtime event stream does',
    content: (
      <p>
        The event stream logs each step of the request processing: QUESTION_RECEIVED, 
        WORKFLOW_STARTED, TOOL_CALLED, TOOL_RESULT, and WORKFLOW_COMPLETED. These events are 
        displayed in the Event Stream panel with timestamps and color-coded by type.
      </p>
    )
  },
  {
    id: 'history',
    title: 'How conversation history is maintained',
    content: (
      <p>
        The chat UI maintains a messages array in React state. Each message includes the role 
        (visitor or ahmedos), content, and timestamp. The conversation is displayed in the 
        Chat panel with the most recent messages at the bottom.
      </p>
    )
  },
  {
    id: 'prompt-injection',
    title: 'How prompt injection is handled',
    content: (
      <p>
        Since this system uses keyword matching instead of a generative LLM, prompt injection 
        attacks are not applicable. The system only responds to predefined keywords and returns 
        data from the tool functions. It cannot be tricked into executing arbitrary commands or 
        revealing sensitive information.
      </p>
    )
  }
];

export default function HowItWorks() {
  return (
    <div>
      <Journey />
      <Accordion sections={architectureSections} />
    </div>
  );
}
