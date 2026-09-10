export interface SkillCategory {
  category: string;
  skills: string[];
  level?: 'knowledge' | 'professional' | 'expert';
}

export const skills: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["C", "C++", "JavaScript", "TypeScript", "Python", "SQL"],
    level: "professional"
  },
  {
    category: "Frontend",
    skills: ["React", "React Native", "Next.js", "Redux", "React Query", "Angular", "Tailwind CSS", "GraphQL", "Design Systems", "Storybook", "HTML5", "CSS3"],
    level: "professional"
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express.js", "Hono", "Django", "FastAPI", "Flask", "Firebase", "WebSockets"],
    level: "professional"
  },
  {
    category: "Cloudflare",
    skills: ["Cloudflare Workers", "Cloudflare Durable Objects", "Cloudflare Queues", "Cloudflare R2", "Cloudflare D1", "Cloudflare serverless", "edge architecture"],
    level: "knowledge"
  },
  {
    category: "Data",
    skills: ["SQL", "MongoDB", "Cloudflare D1", "Drizzle ORM", "Vector Databases", "Database optimization", "Data modeling"],
    level: "professional"
  },
  {
    category: "AI / ML",
    skills: ["OpenAI", "LLM Applications", "RAG Architectures", "Prompt Engineering", "Function Calling", "Tool Calling", "Agentic AI Workflows", "MCP", "MCP Servers", "LangChain", "LangGraph", "LangSmith", "AssemblyAI", "AI-powered applications", "AI chatbots", "AI integrations", "AI SaaS"],
    level: "knowledge"
  },
  {
    category: "Systems",
    skills: ["Distributed Systems", "Serverless Systems", "Real-Time Systems", "Multi-Tenant SaaS", "Microservices", "Event-driven systems", "API-driven architecture"],
    level: "knowledge"
  },
  {
    category: "Cloud / DevOps",
    skills: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "CI/CD", "cPanel"],
    level: "knowledge"
  },
  {
    category: "Testing",
    skills: ["Playwright", "Vitest", "React Testing Library", "Postman", "Newman", "Software Testing", "API Testing", "Debugging", "Troubleshooting"],
    level: "professional"
  },
  {
    category: "Security",
    skills: ["JWT", "RBAC", "Privacy-focused application design", "ABDM", "Regulated data exchange"],
    level: "knowledge"
  },
  {
    category: "Development Tools",
    skills: ["Git", "GitHub", "Jira", "Postman", "Browser DevTools"],
    level: "professional"
  },
  {
    category: "Python Ecosystem",
    skills: ["NumPy", "Pandas", "Matplotlib", "Flask", "Django", "FastAPI"],
    level: "knowledge"
  }
];

export const allSkills = skills.flatMap(cat => cat.skills);
