const faqs = [
  {
    question: "Why an agent instead of a static resume?",
    answer: (
      <p>
        An agent-based portfolio demonstrates technical skills in AI/ML and provides an interactive 
        experience. Instead of reading through static text, visitors can ask questions and get 
        targeted answers. It also showcases knowledge of modern AI architectures, tool-calling, 
        and system design.
      </p>
    )
  },
  {
    question: "What tools are available?",
    answer: (
      <p>
        The system provides seven tool functions: get_summary (professional overview), 
        get_experience (work history), get_technical_skills (tech stack), search_projects 
        (project search), get_education (academic background), get_dukaanx_project (SaaS product 
        details), and get_links (contact information).
      </p>
    )
  },
  {
    question: "Does the LLM see the entire resume?",
    answer: (
      <p>
        In this implementation, there is no external LLM. The system uses a local keyword-based 
        approach where all tool functions are executed upfront to build context, then keyword 
        matching determines the response. All data comes from the structured resume data in the 
        tool functions.
      </p>
    )
  },
  {
    question: "How is hallucination reduced?",
    answer: (
      <p>
        Hallucinations are eliminated by using a deterministic keyword-based system instead of a 
        generative LLM. All answers are derived directly from the structured resume data. The 
        system only returns information that exists in the data and will honestly say it doesn&apos;t 
        have information if the data doesn&apos;t contain the answer.
      </p>
    )
  },
  {
    question: "Is MCP available?",
    answer: (
      <p>
        Yes, the MCP server (mcp-server.ts) exposes the same tool functions used by the web API. 
        You can configure Claude Desktop or Claude Code to use this MCP server, enabling AI 
        assistants to call these tools directly.
      </p>
    )
  },
  {
    question: "How does caching work?",
    answer: (
      <p>
        An in-memory Map stores question-answer pairs keyed by normalized (lowercase, trimmed) 
        questions. When a question is received, the cache is checked first. If found, the cached 
        answer is returned immediately with a CACHE_HIT event. This reduces redundant processing 
        and improves response time.
      </p>
    )
  },
  {
    question: "How are API keys protected?",
    answer: (
      <p>
        This implementation doesn&apos;t require API keys since it uses a local keyword-based system. 
        If you add external LLM support, API keys should be stored in environment variables 
        (.env.local) and never committed to version control. The API route runs server-side, 
        keeping keys secure from client exposure.
      </p>
    )
  },
  {
    question: "How are rate limits handled?",
    answer: (
      <p>
        Since this is a local system with no external API calls, there are no rate limits. The 
        only limitation is server capacity. For production use with external APIs, you would 
        implement rate limiting middleware to prevent abuse and manage API quotas.
      </p>
    )
  },
  {
    question: "What happens if a tool fails?",
    answer: (
      <p>
        If a tool function throws an error, the API route catches it and returns a 500 error 
        response. The error is logged to the console for debugging. The frontend displays a 
        generic error message to the user. In production, you might want to add more sophisticated 
        error handling and retry logic.
      </p>
    )
  }
];

export default function FAQ() {
  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border-t border-[var(--border)] py-4">
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-2">{faq.question}</h3>
          <div className="text-sm text-[var(--foreground)] opacity-80 leading-relaxed">
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
