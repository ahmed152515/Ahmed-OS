export interface ArchitectureNode {
  id: string;
  type: 'client' | 'frontend' | 'backend' | 'database' | 'api' | 'auth' | 'storage' | 'ai' | 'cloud' | 'queue' | 'payment' | 'admin' | 'service';
  label: string;
  category: string;
  description?: string;
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  type: 'data' | 'request' | 'response' | 'auth' | 'sync' | 'async';
}

export interface Architecture {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface Project {
  id: string;
  name: string;
  category: string;
  status: string;
  technologies: string[];
  overview: string;
  problem?: string;
  solution?: string;
  architecture?: string;
  architectureGraph?: Architecture;
  features?: string[];
  howItWasBuilt?: string;
  contribution?: string;
  technicalDecisions?: string[];
  challenges?: string[];
  learning?: string;
  github?: string;
  url?: string;
  highlight?: boolean;
}

export const projects: Project[] = [
  {
    id: "dukaanx",
    name: "DukaanX",
    category: "Multi-Tenant SaaS / E-Commerce / AI",
    status: "In Development",
    technologies: ["React", "TypeScript", "SQL", "Cloudflare", "Serverless", "AI"],
    overview: "DukaanX is Ahmed's own multi-tenant SaaS platform designed for local businesses. It provides inventory management and customizable e-commerce storefronts with subscription-based features and AI-powered capabilities.",
    problem: "Local businesses need an easy way to manage inventory and create online storefronts without technical expertise.",
    solution: "A multi-tenant SaaS platform where businesses can manage products, inventory, and create customizable storefronts through subdomains with theme selection.",
    architecture: "Multi-tenant SaaS architecture with dynamic storefronts, subscription-based feature access, SQL database, and serverless infrastructure.",
    architectureGraph: {
      nodes: [
        { id: "business", type: "client", label: "LOCAL BUSINESS", category: "Input" },
        { id: "dukaanx-core", type: "backend", label: "DUKAANX CORE", category: "Platform" },
        { id: "products", type: "service", label: "PRODUCTS & INVENTORY", category: "Service" },
        { id: "multi-tenant", type: "service", label: "MULTI-TENANT SYSTEM", category: "Service" },
        { id: "ai-gen", type: "ai", label: "AI IMAGE GENERATION", category: "AI" },
        { id: "storefront", type: "frontend", label: "STOREFRONT", category: "Frontend" },
        { id: "themes", type: "service", label: "THEMES", category: "Service" },
        { id: "subscription", type: "service", label: "SUBSCRIPTIONS", category: "Service" },
        { id: "sql-db", type: "database", label: "SQL DATABASE", category: "Database" },
        { id: "cloudflare", type: "cloud", label: "CLOUDFLARE SERVERLESS", category: "Infrastructure" },
        { id: "customer", type: "client", label: "CUSTOMER", category: "User" }
      ],
      edges: [
        { id: "e1", source: "business", target: "dukaanx-core", type: "request" },
        { id: "e2", source: "dukaanx-core", target: "products", type: "request" },
        { id: "e3", source: "dukaanx-core", target: "multi-tenant", type: "request" },
        { id: "e4", source: "dukaanx-core", target: "ai-gen", type: "request" },
        { id: "e5", source: "products", target: "storefront", type: "data" },
        { id: "e6", source: "multi-tenant", target: "storefront", type: "data" },
        { id: "e7", source: "storefront", target: "themes", type: "request" },
        { id: "e8", source: "storefront", target: "subscription", type: "request" },
        { id: "e9", source: "products", target: "sql-db", type: "data" },
        { id: "e10", source: "multi-tenant", target: "sql-db", type: "data" },
        { id: "e11", source: "subscription", target: "sql-db", type: "data" },
        { id: "e12", source: "ai-gen", target: "storefront", type: "response" },
        { id: "e13", source: "dukaanx-core", target: "cloudflare", type: "sync" },
        { id: "e14", source: "storefront", target: "customer", type: "response" }
      ]
    },
    features: [
      "Product and inventory management",
      "Dynamic storefront creation",
      "Subdomain-based storefronts",
      "Theme selection and customization",
      "Subscription-based features",
      "AI-powered image generation"
    ],
    contribution: "Solo full-stack development including architecture design, frontend, backend, database, and AI integrations.",
    technicalDecisions: [
      "Multi-tenant architecture for scalability",
      "Serverless infrastructure for cost efficiency",
      "SQL database for structured data",
      "AI integration for image generation"
    ],
    learning: "Deepened understanding of multi-tenant SaaS patterns, serverless architecture, and AI integration in production applications.",
    highlight: true
  },
  {
    id: "bpo-crm",
    name: "BPO CRM",
    category: "Full-Stack / CRM",
    status: "Completed",
    technologies: ["Python", "Flask", "MongoDB"],
    overview: "A BPO lead-management CRM developed for daily company operations at Atenar Tech.",
    problem: "The company needed a system to manage leads, assign them to users, track customer interactions, and generate response reports as PDFs.",
    solution: "A full-stack CRM system built with Python, Flask, and MongoDB that handles the complete lead management workflow.",
    architecture: "Admin uploads leads → distributes to users → users contact customers → complete response forms → submit → PDF generation → record storage",
    architectureGraph: {
      nodes: [
        { id: "admin", type: "admin", label: "ADMIN", category: "Admin" },
        { id: "crm-core", type: "backend", label: "BPO CRM CORE", category: "Backend" },
        { id: "lead-upload", type: "service", label: "LEAD / PDF UPLOAD", category: "Service" },
        { id: "lead-management", type: "service", label: "LEAD MANAGEMENT", category: "Service" },
        { id: "user", type: "client", label: "USER", category: "User" },
        { id: "customer-call", type: "service", label: "CUSTOMER CALL", category: "Service" },
        { id: "response-form", type: "service", label: "RESPONSE FORM", category: "Service" },
        { id: "pdf-gen", type: "service", label: "PDF GENERATION", category: "Service" },
        { id: "mongodb", type: "database", label: "MONGODB", category: "Database" }
      ],
      edges: [
        { id: "e1", source: "admin", target: "crm-core", type: "request" },
        { id: "e2", source: "crm-core", target: "lead-upload", type: "request" },
        { id: "e3", source: "lead-upload", target: "lead-management", type: "data" },
        { id: "e4", source: "lead-management", target: "user", type: "request" },
        { id: "e5", source: "user", target: "customer-call", type: "request" },
        { id: "e6", source: "customer-call", target: "response-form", type: "request" },
        { id: "e7", source: "response-form", target: "pdf-gen", type: "request" },
        { id: "e8", source: "lead-management", target: "mongodb", type: "data" },
        { id: "e9", source: "response-form", target: "mongodb", type: "data" },
        { id: "e10", source: "pdf-gen", target: "mongodb", type: "data" }
      ]
    },
    features: [
      "Lead management and assignment",
      "PDF upload for lead data",
      "User workflows for customer contact",
      "Response form submission",
      "PDF generation from responses",
      "Record storage and retrieval",
      "Administrative workflow management"
    ],
    contribution: "Independent design and development of the entire system including backend, database, workflow logic, and application development.",
    technicalDecisions: [
      "Python and Flask for rapid backend development",
      "MongoDB for flexible document storage",
      "PDF generation for report output"
    ],
    learning: "Gained experience in full-stack CRM development, workflow automation, and database design.",
    github: "github.com/ahmed152515/bpo-crm"
  },
  {
    id: "integral-academy-crm",
    name: "Integral Academy CRM",
    category: "Educational CRM",
    status: "Completed",
    technologies: ["React", "Node.js", "SQL"],
    overview: "A comprehensive educational CRM system for managing students, teachers, parents, classes, exams, timetables, attendance, and bus schedules.",
    problem: "Educational institutions need a unified system to manage all administrative and academic operations.",
    solution: "A full-featured CRM that handles student management, teacher management, parent communication, class scheduling, exams, attendance tracking, and bus schedule management.",
    architectureGraph: {
      nodes: [
        { id: "admin", type: "admin", label: "ADMIN", category: "Admin" },
        { id: "crm-core", type: "backend", label: "ACADEMIC CRM CORE", category: "Backend" },
        { id: "student", type: "client", label: "STUDENT", category: "User" },
        { id: "teacher", type: "client", label: "TEACHER", category: "User" },
        { id: "parent", type: "client", label: "PARENT", category: "User" },
        { id: "classes", type: "service", label: "CLASSES", category: "Service" },
        { id: "exams", type: "service", label: "EXAMS", category: "Service" },
        { id: "attendance", type: "service", label: "ATTENDANCE", category: "Service" },
        { id: "timetable", type: "service", label: "TIMETABLE", category: "Service" },
        { id: "bus-schedule", type: "service", label: "BUS SCHEDULE", category: "Service" },
        { id: "sql", type: "database", label: "SQL DATABASE", category: "Database" }
      ],
      edges: [
        { id: "e1", source: "admin", target: "crm-core", type: "request" },
        { id: "e2", source: "student", target: "crm-core", type: "request" },
        { id: "e3", source: "teacher", target: "crm-core", type: "request" },
        { id: "e4", source: "parent", target: "crm-core", type: "request" },
        { id: "e5", source: "crm-core", target: "classes", type: "request" },
        { id: "e6", source: "crm-core", target: "exams", type: "request" },
        { id: "e7", source: "crm-core", target: "attendance", type: "request" },
        { id: "e8", source: "crm-core", target: "timetable", type: "request" },
        { id: "e9", source: "crm-core", target: "bus-schedule", type: "request" },
        { id: "e10", source: "classes", target: "timetable", type: "data" },
        { id: "e11", source: "exams", target: "timetable", type: "data" },
        { id: "e12", source: "attendance", target: "timetable", type: "data" },
        { id: "e13", source: "classes", target: "sql", type: "data" },
        { id: "e14", source: "exams", target: "sql", type: "data" },
        { id: "e15", source: "attendance", target: "sql", type: "data" },
        { id: "e16", source: "timetable", target: "sql", type: "data" },
        { id: "e17", source: "bus-schedule", target: "sql", type: "data" }
      ]
    },
    features: [
      "Student management",
      "Teacher management",
      "Parent management",
      "Class management",
      "Exam management",
      "Timetable scheduling",
      "Attendance tracking",
      "Bus schedule management",
      "Administrative workflows"
    ],
    url: "integralacademy.in/crm"
  },
  {
    id: "jk-college-website",
    name: "JK College Website",
    category: "Dynamic Website",
    status: "Completed",
    technologies: ["React", "Node.js", "SQL"],
    overview: "A dynamic college website with admin panel for managing announcements, gallery, and database-driven content.",
    problem: "The college needed a dynamic website that could be updated easily without technical changes.",
    solution: "A database-driven website with an admin panel for content management.",
    architectureGraph: {
      nodes: [
        { id: "visitor", type: "client", label: "VISITOR", category: "User" },
        { id: "admin", type: "admin", label: "ADMIN", category: "Admin" },
        { id: "website-core", type: "backend", label: "COLLEGE WEBSITE CORE", category: "Backend" },
        { id: "dynamic-content", type: "service", label: "DYNAMIC CONTENT", category: "Service" },
        { id: "announcements", type: "service", label: "ANNOUNCEMENTS", category: "Service" },
        { id: "gallery", type: "service", label: "GALLERY", category: "Service" },
        { id: "admin-panel", type: "service", label: "ADMIN PANEL", category: "Service" },
        { id: "sql", type: "database", label: "SQL DATABASE", category: "Database" }
      ],
      edges: [
        { id: "e1", source: "visitor", target: "website-core", type: "request" },
        { id: "e2", source: "admin", target: "website-core", type: "request" },
        { id: "e3", source: "website-core", target: "dynamic-content", type: "request" },
        { id: "e4", source: "dynamic-content", target: "announcements", type: "data" },
        { id: "e5", source: "dynamic-content", target: "gallery", type: "data" },
        { id: "e6", source: "admin", target: "admin-panel", type: "request" },
        { id: "e7", source: "admin-panel", target: "announcements", type: "request" },
        { id: "e8", source: "admin-panel", target: "gallery", type: "request" },
        { id: "e9", source: "announcements", target: "sql", type: "data" },
        { id: "e10", source: "gallery", target: "sql", type: "data" }
      ]
    },
    features: [
      "Dynamic content management",
      "Admin panel",
      "Announcements management",
      "Gallery management",
      "Database-driven content"
    ],
    url: "jkstudyabroad.com"
  },
  {
    id: "jk-paramedical-admin",
    name: "JK Paramedical Admin Panel",
    category: "Admin Panel",
    status: "Completed",
    technologies: ["React", "Node.js"],
    overview: "Administrative panel for managing website and application content for JK Paramedical.",
    problem: "Needed a centralized admin interface for managing application content.",
    solution: "A React-based admin panel with content management capabilities.",
    architectureGraph: {
      nodes: [
        { id: "admin", type: "admin", label: "ADMIN", category: "User" },
        { id: "admin-core", type: "backend", label: "PARAMEDICAL ADMIN CORE", category: "Backend" },
        { id: "content-mgmt", type: "service", label: "CONTENT MANAGEMENT", category: "Service" },
        { id: "user-mgmt", type: "service", label: "USER MANAGEMENT", category: "Service" },
        { id: "api", type: "service", label: "NODE.JS API", category: "Service" }
      ],
      edges: [
        { id: "e1", source: "admin", target: "admin-core", type: "request" },
        { id: "e2", source: "admin-core", target: "content-mgmt", type: "request" },
        { id: "e3", source: "admin-core", target: "user-mgmt", type: "request" },
        { id: "e4", source: "content-mgmt", target: "api", type: "data" },
        { id: "e5", source: "user-mgmt", target: "api", type: "data" }
      ]
    },
    features: [
      "Content management",
      "Administrative controls",
      "User management"
    ],
    url: "jkparamedical.com/admin"
  },
  {
    id: "jk-foundation",
    name: "JK Foundation",
    category: "Website",
    status: "Completed",
    technologies: ["React", "Payment Gateway", "Cloudflare", "cPanel"],
    overview: "Foundation website with payment gateway integration and deployment.",
    problem: "The foundation needed a website with payment capabilities for donations.",
    solution: "A dynamic website with payment gateway integration, deployed on Cloudflare with cPanel management.",
    architectureGraph: {
      nodes: [
        { id: "donor", type: "client", label: "DONOR", category: "User" },
        { id: "website-core", type: "backend", label: "FOUNDATION WEBSITE CORE", category: "Backend" },
        { id: "content", type: "service", label: "CONTENT", category: "Service" },
        { id: "payment", type: "payment", label: "PAYMENT GATEWAY", category: "Payment" },
        { id: "backend", type: "service", label: "BACKEND / DATA", category: "Service" },
        { id: "cloudflare", type: "cloud", label: "CLOUDFLARE DEPLOYMENT", category: "Infrastructure" },
        { id: "cpanel", type: "service", label: "CPANEL", category: "Infrastructure" }
      ],
      edges: [
        { id: "e1", source: "donor", target: "website-core", type: "request" },
        { id: "e2", source: "website-core", target: "content", type: "request" },
        { id: "e3", source: "website-core", target: "payment", type: "request" },
        { id: "e4", source: "payment", target: "backend", type: "data" },
        { id: "e5", source: "content", target: "backend", type: "data" },
        { id: "e6", source: "backend", target: "cloudflare", type: "sync" },
        { id: "e7", source: "website-core", target: "cloudflare", type: "sync" },
        { id: "e8", source: "cloudflare", target: "cpanel", type: "sync" }
      ]
    },
    features: [
      "Dynamic website development",
      "Payment gateway integration",
      "Cloudflare deployment",
      "cPanel management"
    ],
    url: "jkfoundation.co.in"
  },
  {
    id: "indian-loan-center",
    name: "Indian Loan Center",
    category: "Website / Business Application",
    status: "Completed",
    technologies: ["React", "Node.js"],
    overview: "Website and business application for loan center operations.",
    problem: "Loan center needed a web presence and application system.",
    solution: "A web application for loan center operations and customer management.",
    architectureGraph: {
      nodes: [
        { id: "customer", type: "client", label: "CUSTOMER", category: "User" },
        { id: "admin", type: "admin", label: "ADMIN", category: "Admin" },
        { id: "app-core", type: "backend", label: "LOAN CENTER APP CORE", category: "Backend" },
        { id: "loan-mgmt", type: "service", label: "LOAN MANAGEMENT", category: "Service" },
        { id: "customer-mgmt", type: "service", label: "CUSTOMER MANAGEMENT", category: "Service" },
        { id: "api", type: "service", label: "NODE.JS API", category: "Service" }
      ],
      edges: [
        { id: "e1", source: "customer", target: "app-core", type: "request" },
        { id: "e2", source: "admin", target: "app-core", type: "request" },
        { id: "e3", source: "app-core", target: "loan-mgmt", type: "request" },
        { id: "e4", source: "app-core", target: "customer-mgmt", type: "request" },
        { id: "e5", source: "loan-mgmt", target: "api", type: "data" },
        { id: "e6", source: "customer-mgmt", target: "api", type: "data" }
      ]
    },
    url: "indialoancenter.com"
  },
  {
    id: "solutioning-website",
    name: "Solutioning Website",
    category: "Business Website",
    status: "Completed",
    technologies: ["React", "Node.js"],
    overview: "Business website developed as part of professional work at Risiar Pvt. Ltd.",
    problem: "Client needed a professional business website.",
    solution: "A modern business website with responsive design.",
    architectureGraph: {
      nodes: [
        { id: "visitor", type: "client", label: "VISITOR", category: "User" },
        { id: "website-core", type: "backend", label: "BUSINESS WEBSITE CORE", category: "Backend" },
        { id: "content", type: "service", label: "CONTENT", category: "Service" },
        { id: "contact", type: "service", label: "CONTACT", category: "Service" },
        { id: "api", type: "service", label: "NODE.JS API", category: "Service" }
      ],
      edges: [
        { id: "e1", source: "visitor", target: "website-core", type: "request" },
        { id: "e2", source: "website-core", target: "content", type: "request" },
        { id: "e3", source: "website-core", target: "contact", type: "request" },
        { id: "e4", source: "content", target: "api", type: "data" },
        { id: "e5", source: "contact", target: "api", type: "data" }
      ]
    },
    url: "arkwavesolution.com"
  },
  {
    id: "lifecare-trust",
    name: "Lifecare Trust",
    category: "Organisation Website",
    status: "Completed",
    technologies: ["React", "Node.js"],
    overview: "Organisation website for Lifecare Trust.",
    problem: "The organisation needed a web presence.",
    solution: "A professional website for the organisation.",
    architectureGraph: {
      nodes: [
        { id: "visitor", type: "client", label: "VISITOR", category: "User" },
        { id: "admin", type: "admin", label: "ADMIN", category: "Admin" },
        { id: "website-core", type: "backend", label: "ORGANISATION WEBSITE CORE", category: "Backend" },
        { id: "about", type: "service", label: "ABOUT", category: "Service" },
        { id: "services", type: "service", label: "SERVICES", category: "Service" },
        { id: "api", type: "service", label: "NODE.JS API", category: "Service" }
      ],
      edges: [
        { id: "e1", source: "visitor", target: "website-core", type: "request" },
        { id: "e2", source: "admin", target: "website-core", type: "request" },
        { id: "e3", source: "website-core", target: "about", type: "request" },
        { id: "e4", source: "website-core", target: "services", type: "request" },
        { id: "e5", source: "about", target: "api", type: "data" },
        { id: "e6", source: "services", target: "api", type: "data" }
      ]
    },
    url: "lifecaretrust.co.in"
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(p => p.id === id);
};

export const searchProjects = (query: string): Project[] => {
  const lowerQuery = query.toLowerCase();
  return projects.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.technologies.some(t => t.toLowerCase().includes(lowerQuery)) ||
    p.overview.toLowerCase().includes(lowerQuery)
  );
};
