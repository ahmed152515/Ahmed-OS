// Portfolio tool functions for AhmedOS

import { profile, skills, experience, education, projects, getProjectById, searchProjects } from './portfolio';

export interface ToolResult {
  success: boolean;
  data: unknown;
  error?: string;
}

// Tool functions
export const tools = {
  get_profile: (): ToolResult => ({
    success: true,
    data: profile
  }),
  
  get_summary: (): ToolResult => ({
    success: true,
    data: profile.summary
  }),
  
  get_experience: (params?: { company?: string }): ToolResult => {
    if (params?.company) {
      const companyName = params.company;
      const filtered = experience.filter(
        exp => exp.company.toLowerCase().includes(companyName.toLowerCase())
      );
      return { success: true, data: filtered };
    }
    return { success: true, data: experience };
  },
  
  get_skills: (params?: { category?: string }): ToolResult => {
    if (params?.category) {
      const category = params.category;
      const filtered = skills.filter(cat => 
        cat.category.toLowerCase().includes(category.toLowerCase()) ||
        cat.skills.some(skill => skill.toLowerCase().includes(category.toLowerCase()))
      );
      return { success: true, data: filtered };
    }
    return { success: true, data: skills };
  },
  
  get_education: (): ToolResult => ({
    success: true,
    data: education
  }),
  
  get_projects: (params?: { query?: string }): ToolResult => {
    if (params?.query) {
      const filtered = searchProjects(params!.query);
      return { success: true, data: filtered };
    }
    return { success: true, data: projects };
  },
  
  get_project_details: (params?: { projectId?: string }): ToolResult => {
    if (params?.projectId) {
      const project = getProjectById(params!.projectId);
      return { success: true, data: project };
    }
    return { success: true, data: projects };
  },
  
  get_ai_experience: (): ToolResult => ({
    success: true,
    data: {
      aiSkills: skills.find(s => s.category === 'AI / ML')?.skills || [],
      aiProjects: projects.filter(p => p.technologies.some(t => t.toLowerCase().includes('ai'))),
      aiInExperience: experience.filter(exp => 
        exp.technologies?.some(t => t.toLowerCase().includes('ai') || t.toLowerCase().includes('llm') || t.toLowerCase().includes('rag'))
      ),
      llmExperience: experience.filter(exp => 
        exp.technologies?.some(t => t.toLowerCase().includes('llm'))
      ),
      ragExperience: experience.filter(exp => 
        exp.technologies?.some(t => t.toLowerCase().includes('rag'))
      )
    }
  }),
  
  get_cloud_experience: (): ToolResult => ({
    success: true,
    data: {
      cloudSkills: skills.filter(s => 
        s.category === 'Cloudflare' || s.category === 'Cloud / DevOps'
      ),
      cloudProjects: projects.filter(p => 
        p.technologies.some(t => t.toLowerCase().includes('cloudflare') || t.toLowerCase().includes('aws') || t.toLowerCase().includes('serverless'))
      )
    }
  }),
  
  get_engineering_philosophy: (): ToolResult => ({
    success: true,
    data: profile.engineeringPhilosophy
  }),
  
  search_portfolio: (params?: { query?: string }): ToolResult => {
    if (!params?.query) {
      return { success: true, data: { profile, skills, experience, education, projects } };
    }
    
    const query = params!.query.toLowerCase();
    const results = {
      profile: profile.name.toLowerCase().includes(query) || profile.summary.toLowerCase().includes(query) ? profile : null,
      skills: skills.filter(s => 
        s.category.toLowerCase().includes(query) || 
        s.skills.some(skill => skill.toLowerCase().includes(query))
      ),
      experience: experience.filter(e => 
        e.company.toLowerCase().includes(query) || 
        e.role.toLowerCase().includes(query) ||
        e.description.some(d => d.toLowerCase().includes(query)) ||
        e.technologies?.some(t => t.toLowerCase().includes(query))
      ),
      projects: searchProjects(params!.query),
      education: education.filter(e => 
        e.degree.toLowerCase().includes(query) || 
        e.institution.toLowerCase().includes(query)
      )
    };
    
    return { success: true, data: results };
  },
  
  get_links: (): ToolResult => ({
    success: true,
    data: {
      email: profile.email,
      phone: profile.phone,
      github: profile.github,
      projects: projects.map(p => ({ name: p.name, url: p.url, github: p.github }))
    }
  })
};

// Tool definitions for Claude API
export const toolDefinitions = [
  {
    name: "get_profile",
    description: "Get Ahmed's complete profile information",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [] as string[]
    }
  },
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
    name: "get_skills",
    description: "Get technical skills by category or all skills",
    input_schema: {
      type: "object" as const,
      properties: {
        category: {
          type: "string" as const,
          description: "Optional category to filter skills (e.g., 'AI / ML', 'Frontend', 'Backend')"
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
    name: "get_projects",
    description: "Get all projects or search by query",
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
    name: "get_project_details",
    description: "Get detailed information about a specific project by ID",
    input_schema: {
      type: "object" as const,
      properties: {
        projectId: {
          type: "string" as const,
          description: "Project ID (e.g., 'dukaanx', 'bpo-crm')"
        }
      },
      required: [] as string[]
    }
  },
  {
    name: "get_ai_experience",
    description: "Get Ahmed's AI/ML experience, skills, and related projects",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [] as string[]
    }
  },
  {
    name: "get_cloud_experience",
    description: "Get Ahmed's cloud/DevOps experience and related projects",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [] as string[]
    }
  },
  {
    name: "get_engineering_philosophy",
    description: "Get Ahmed's engineering philosophy and approach",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [] as string[]
    }
  },
  {
    name: "search_portfolio",
    description: "Search across all portfolio data (profile, skills, experience, projects, education)",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string" as const,
          description: "Search query to find matching information across the portfolio"
        }
      },
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
