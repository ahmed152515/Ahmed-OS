export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  summary: string;
  engineeringPhilosophy: string;
}

export const profile: Profile = {
  name: "Ahmed Sayyed",
  title: "Full-Stack Engineer",
  subtitle: "AI / ML Engineer · Agentic AI Developer",
  location: "Pune, India",
  email: "sayyedwp@gmail.com",
  phone: "+91 8530070721",
  github: "github.com/ahmed152515",
  summary: `Full-Stack Engineer and AI/ML Engineer with expertise in building scalable web applications, CRM systems, and AI-powered solutions. Proficient in React, Next.js, Python, Node.js, and modern cloud infrastructure. Experienced in agentic AI workflows, RAG architectures, MCP, and LLM applications. Strong background in distributed systems, serverless architecture, and multi-tenant SaaS development. Adept at privacy-focused application design, API development, and database optimization. Currently building DukaanX, a multi-tenant SaaS platform with AI-powered capabilities.`,
  engineeringPhilosophy: `Research the problem thoroughly, evaluate alternatives, control unnecessary costs, and maintain product quality. Continuous learning through real projects and practical implementation.`
};
