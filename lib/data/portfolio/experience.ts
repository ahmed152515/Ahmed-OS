export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  technologies?: string[];
}

export const experience: Experience[] = [
  {
    company: "Risiar Pvt. Ltd",
    role: "Full Stack Developer",
    period: "May 2026 — Present",
    location: "Pune, India",
    description: [
      "Contributing to development and maintenance of multiple websites, CRM systems, and admin panels",
      "Integrating payment gateways and third-party APIs",
      "Building user-friendly interfaces and scalable backend solutions",
      "Working with Cloudflare, cPanel, and database systems",
      "Implementing analytics, debugging, and production development",
      "Delivering complete client projects including foundation websites, college websites, e-commerce systems, admin panels, CRM systems, and educational platforms"
    ],
    technologies: ["React", "Node.js", "Payment Gateways", "Cloudflare", "cPanel", "SQL", "API Integration"]
  },
  {
    company: "Payr",
    role: "Full Stack Developer",
    period: "Nov 2025 — Mar 2026",
    location: "Pune, India",
    description: [
      "Worked on portion chart modules with improved UI for data visualization",
      "Tested APIs with Postman and integrated them into the frontend",
      "Collaborated on usability and performance improvements",
      "Worked with React, TypeScript, JavaScript, SQL, Docker, AWS, Jira, and testing tools",
      "Contributed to MCP/server-related technologies and dynamic UI development",
      "Worked across multiple product modules improving usability and application functionality"
    ],
    technologies: ["React", "TypeScript", "JavaScript", "SQL", "Docker", "AWS", "Jira", "Postman", "MCP"]
  },
  {
    company: "Ilma Solutions",
    role: "Software Developer",
    period: "Jun 2025 — Oct 2025",
    location: "Pune, India",
    description: [
      "Worked with Google's Privacy Sandbox and PSAT tools",
      "Implemented privacy-focused features, bidding modules, and cookie-related functionality",
      "Developed using React with frontend optimization",
      "Used browser DevTools and console debugging",
      "Contributed to privacy compliance and modern web privacy technologies"
    ],
    technologies: ["React", "Privacy Sandbox", "PSAT", "Browser DevTools", "Privacy Compliance"]
  },
  {
    company: "Atenar Tech",
    role: "Software Developer",
    period: "Feb 2025 — May 2025",
    location: "Pune, India",
    description: [
      "Independently developed a BPO CRM used for daily company operations",
      "Built the CRM with Python, Flask, and MongoDB",
      "Implemented the full workflow: admin uploads leads/PDFs → distributes leads → user receives leads → contacts customer → completes response form → submits response → converts to PDF → stores records",
      "Contributed to multiple company websites",
      "Handled the complete development lifecycle from requirements to deployment"
    ],
    technologies: ["Python", "Flask", "MongoDB", "CRM", "PDF Generation"]
  }
];
