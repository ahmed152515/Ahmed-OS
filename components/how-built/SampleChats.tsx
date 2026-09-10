const sampleChats = [
  {
    visitor: "Does he have experience with React?",
    runtime: (
      <div className="space-y-2">
        <div className="text-xs font-mono text-[var(--accent)] opacity-70">TOOLS → get_technical_skills()</div>
        <div className="text-xs font-mono text-[var(--accent)] opacity-70">TOOLS → search_projects()</div>
        <div className="mt-2">
          Yes, Ahmed has experience with React. His technical skills include frontend technologies 
          like React, Next.js, and TypeScript. He has built several projects using React including 
          DukaanX, a SaaS product for e-commerce operations.
        </div>
      </div>
    )
  },
  {
    visitor: "What did he build at Risiar?",
    runtime: (
      <div className="space-y-2">
        <div className="text-xs font-mono text-[var(--accent)] opacity-70">TOOLS → get_experience()</div>
        <div className="mt-2">
          At Risiar, Ahmed worked as a Software Engineer. Key responsibilities include building 
          scalable web applications, implementing REST APIs, and collaborating with cross-functional 
          teams to deliver product features.
        </div>
      </div>
    )
  },
  {
    visitor: "Does he know Python?",
    runtime: (
      <div className="space-y-2">
        <div className="text-xs font-mono text-[var(--accent)] opacity-70">TOOLS → get_technical_skills()</div>
        <div className="mt-2">
          Yes, Ahmed has experience with Python. His Python skills include Flask, Django, and various 
          data processing libraries. He has used Python for backend development and automation tasks.
        </div>
      </div>
    )
  },
  {
    visitor: "Tell me about his education",
    runtime: (
      <div className="space-y-2">
        <div className="text-xs font-mono text-[var(--accent)] opacity-70">TOOLS → get_education()</div>
        <div className="mt-2">
          Ahmed has a degree in Computer Science. His education provided a strong foundation in 
          algorithms, data structures, and software engineering principles.
        </div>
      </div>
    )
  },
  {
    visitor: "What is DukaanX?",
    runtime: (
      <div className="space-y-2">
        <div className="text-xs font-mono text-[var(--accent)] opacity-70">TOOLS → get_dukaanx_project()</div>
        <div className="mt-2">
          DukaanX is a SaaS product for managing e-commerce operations. It provides tools for 
          inventory management, order processing, and analytics for online stores. The product 
          was built to help small businesses streamline their e-commerce workflows.
        </div>
      </div>
    )
  },
  {
    visitor: "How can I contact him?",
    runtime: (
      <div className="space-y-2">
        <div className="text-xs font-mono text-[var(--accent)] opacity-70">TOOLS → get_links()</div>
        <div className="mt-2">
          You can contact Ahmed via email. His projects and code are available on GitHub. Check 
          the links panel for his GitHub profile and other contact information.
        </div>
      </div>
    )
  }
];

export default function SampleChats() {
  return (
    <div className="space-y-4">
      {sampleChats.map((chat, index) => (
        <div key={index} className="border-t border-[var(--border)] py-4">
          <div className="mb-3">
            <span className="text-xs uppercase tracking-wider text-[var(--foreground)] opacity-50 font-mono">
              Visitor
            </span>
            <p className="mt-1 text-sm text-[var(--foreground)]">{chat.visitor}</p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-[var(--accent)] opacity-70 font-mono">
              Runtime
            </span>
            <div className="mt-1 text-sm text-[var(--foreground)] opacity-90">{chat.runtime}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
