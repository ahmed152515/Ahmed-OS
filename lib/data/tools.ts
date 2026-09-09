// Resume data tool functions for AhmedOS

export interface ToolResult {
  success: boolean;
  data: any;
  error?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
}

export interface Project {
  name: string;
  description: string;
  url?: string;
  github?: string;
  tech?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  gpa?: string;
  percentage?: string;
  period: string;
  location: string;
}

// Resume data
const RESUME_DATA = {
  name: "Ahmed Sayyed",
  title: "Software Developer",
  location: "Pune, India",
  email: "sayyedwp@gmail.com",
  phone: "+91 8530070721",
  github: "github.com/ahmed152515",
  
  summary: `Software Developer with expertise in building privacy-focused web applications and scalable CRM systems. Proficient in React, Python, Flask, and database optimization to enhance user experience and ensure robust frontend-backend integration. Experienced in CRM systems, along with tools like Jira and Postman for project management and API testing. Adept at handling multiple tasks in fast-paced environments, with strong problem-solving abilities, quick learning, and effective communication skills. Currently building DukaanX, a full-stack SaaS product for store and inventory management with an AI-generated storefront imagery feature powered by the Cloudflare AI API.`,
  
  experience: [
    {
      company: "Risiar Pvt. Ltd",
      role: "Full Stack Developer",
      period: "May 2026 – Present",
      location: "Pune, India",
      description: [
        "Contributing to development and maintenance of multiple websites, CRM systems, and admin panels",
        "Integrating payment gateways and third-party APIs",
        "Building user-friendly interfaces and scalable backend solutions"
      ]
    },
    {
      company: "Payr",
      role: "Full Stack Developer",
      period: "Nov 2025 – Mar 2026",
      location: "Pune, India",
      description: [
        "Worked on PRs for portion chart modules, improving UI for data visualization",
        "Tested APIs with Postman and integrated them into the frontend",
        "Collaborated on usability and performance improvements"
      ]
    },
    {
      company: "Ilma Solutions",
      role: "Software Developer",
      period: "Jun 2025 – Oct 2025",
      location: "Pune, India",
      description: [
        "Worked on Google's Privacy Sandbox and PSAT tools",
        "Analysis and implementation of privacy-focused features, bidding modules, and cookie-related functionality using React"
      ]
    },
    {
      company: "Atenar Tech",
      role: "Software Developer",
      period: "Feb 2025 – May 2025",
      location: "Pune, India",
      description: [
        "Built a BPO-based CRM system (Python, Flask, MongoDB) used for daily operations",
        "Contributed to design/development of multiple company websites across the full development lifecycle"
      ]
    }
  ] as Experience[],
  
  education: [
    {
      degree: "Bachelor of Computer Applications",
      institution: "Dr. P.A. Inamdar University",
      gpa: "9.1 CGPA",
      period: "Aug 2023 – May 2026",
      location: "Pune, India"
    },
    {
      degree: "HSC (Computer Science)",
      institution: "Vishwakarma College of Arts, Science and Commerce",
      percentage: "64.17%",
      period: "Aug 2021 – Mar 2023",
      location: "Pune, India"
    },
    {
      degree: "SSC",
      institution: "MCES English Medium High School",
      percentage: "71.60%",
      period: "Aug 2020 – Feb 2021",
      location: "Pune, India"
    }
  ] as Education[],
  
  skills: [
    "C", "C++", "HTML5", "CSS", "JavaScript", "React", "PHP", "Laravel",
    "Python", "NumPy", "Pandas", "Matplotlib", "Docker", "Jira", "Postman",
    "Git/GitHub", "SQL", "API Development", "Database Management", "WordPress"
  ],
  
  dukaanx: {
    name: "DukaanX",
    description: "DukaanX is a full-stack SaaS product for store and inventory management. Store owners manage inventory and get their own auto-generated storefront, including AI-generated product/storefront imagery via the Cloudflare AI API. Currently offering a free 1-month perk period to early users. Positioned as a from-scratch, solo-built SaaS product covering full-stack + applied AI.",
    tech: ["Full-stack", "SaaS", "Cloudflare AI API", "Inventory Management", "Storefront Generation"],
    highlight: true
  },
  
  projects: [
    {
      name: "Solutioning Website",
      url: "arkwavesolution.com"
    },
    {
      name: "BPO CRM",
      github: "github.com/ahmed152515/bpo-crm",
      tech: ["Python", "Flask", "MongoDB"]
    },
    {
      name: "CRM Integral Academy",
      url: "integralacademy.in/crm"
    },
    {
      name: "JK College Website",
      url: "jkstudyabroad.com"
    },
    {
      name: "Organisation Website",
      url: "lifecaretrust.co.in"
    },
    {
      name: "JK Paramedical Admin Panel",
      url: "jkparamedical.com/admin"
    },
    {
      name: "Indian Loan Center",
      url: "indialoancenter.com"
    },
    {
      name: "JK Foundation",
      url: "jkfoundation.co.in"
    }
  ] as Project[]
};

// Tool functions
export const tools = {
  get_summary: (): ToolResult => ({
    success: true,
    data: RESUME_DATA.summary
  }),
  
  get_experience: (params?: { company?: string }): ToolResult => {
    if (params?.company) {
      const filtered = RESUME_DATA.experience.filter(
        (exp: Experience) => exp.company.toLowerCase().includes(params.company!.toLowerCase())
      );
      return { success: true, data: filtered };
    }
    return { success: true, data: RESUME_DATA.experience };
  },
  
  get_technical_skills: (params?: { category?: string }): ToolResult => {
    if (params?.category) {
      const filtered = RESUME_DATA.skills.filter(skill =>
        skill.toLowerCase().includes(params.category!.toLowerCase())
      );
      return { success: true, data: filtered };
    }
    return { success: true, data: RESUME_DATA.skills };
  },
  
  search_projects: (params?: { query?: string }): ToolResult => {
    if (params?.query) {
      const filtered = RESUME_DATA.projects.filter(project =>
        project.name.toLowerCase().includes(params.query!.toLowerCase()) ||
        project.description?.toLowerCase().includes(params.query!.toLowerCase())
      );
      return { success: true, data: filtered };
    }
    return { success: true, data: RESUME_DATA.projects };
  },
  
  get_education: (): ToolResult => ({
    success: true,
    data: RESUME_DATA.education
  }),
  
  get_dukaanx_project: (): ToolResult => ({
    success: true,
    data: RESUME_DATA.dukaanx
  }),
  
  get_links: (): ToolResult => ({
    success: true,
    data: {
      email: RESUME_DATA.email,
      phone: RESUME_DATA.phone,
      github: RESUME_DATA.github,
      projects: RESUME_DATA.projects
    }
  })
};

// Tool definitions for Claude API
export const toolDefinitions = [
  {
    name: "get_summary",
    description: "Get Ahmed's professional summary",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [] as string[]
    }
  },
  {
    name: "get_experience",
    description: "Get work experience, optionally filtered by company name",
    input_schema: {
      type: "object" as const,
      properties: {
        company: {
          type: "string" as const,
          description: "Optional company name to filter experience"
        }
      },
      required: [] as string[]
    }
  },
  {
    name: "get_technical_skills",
    description: "Get technical skills, optionally filtered by category",
    input_schema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string" as const,
          description: "Optional category to filter skills (e.g., 'python', 'react', 'database')"
        }
      },
      required: [] as string[]
    }
  },
  {
    name: "search_projects",
    description: "Search or list projects, optionally filtered by query",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string" as const,
          description: "Optional search query to filter projects"
        }
      },
      required: [] as string[]
    }
  },
  {
    name: "get_education",
    description: "Get education history",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [] as string[]
    }
  },
  {
    name: "get_dukaanx_project",
    description: "Get detailed information about the DukaanX SaaS product",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [] as string[]
    }
  },
  {
    name: "get_links",
    description: "Get contact information and project links",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [] as string[]
    }
  }
];
