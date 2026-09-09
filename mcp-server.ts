#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools } from './lib/data/tools.js';

// Create MCP server
const server = new Server(
  {
    name: 'ahmed-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_summary',
        description: "Get Ahmed's professional summary",
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_experience',
        description: 'Get work experience, optionally filtered by company name',
        inputSchema: {
          type: 'object',
          properties: {
            company: {
              type: 'string',
              description: 'Optional company name to filter experience',
            },
          },
          required: [],
        },
      },
      {
        name: 'get_technical_skills',
        description: 'Get technical skills, optionally filtered by category',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Optional category to filter skills (e.g., python, react, database)',
            },
          },
          required: [],
        },
      },
      {
        name: 'search_projects',
        description: 'Search or list projects, optionally filtered by query',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Optional search query to filter projects',
            },
          },
          required: [],
        },
      },
      {
        name: 'get_education',
        description: 'Get education history',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_dukaanx_project',
        description: 'Get detailed information about the DukaanX SaaS product',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
      {
        name: 'get_links',
        description: 'Get contact information and project links',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!tools[name as keyof typeof tools]) {
    throw new Error(`Unknown tool: ${name}`);
  }

  const toolFn = tools[name as keyof typeof tools] as (params?: any) => any;
  const result = toolFn(args);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Ahmed MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
